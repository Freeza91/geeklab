class AssignmentsController < ApplicationController

  before_action :require_login?, except: [:callback_from_qiniu, :callback_from_qiniu_transfer]
  skip_before_filter :verify_authenticity_token, :only => [:callback_from_qiniu, :destroy,                                                       :callback_from_qiniu_transfer]

  def index
    tester = current_user.to_tester
    assignments = tester.assignments
    if tester.approved
      @assignments = assignments.new_tasks.page(params[:page]).per(10)
      @num = assignments.not_view_num(tester.last_view_time)
    else
      @assignments = assignments.test_task.page(params[:page]).per(10)
      @num = nil
    end

    respond_to do |format|
      format.html
      format.json do
        json = {status: 0, code: 1, assignments: [] }
        @assignments.each do |a|
          json[:assignments] << a.to_json_with_project
        end
        render json: json
      end
    end
  end

  def show
    assignment = Assignment.find_by(id: params[:id])
    json = { status: 0, code: 1 }
    project = assignment.project
    json[:project] = project.to_json_with_tasks
    render json: json
  end

  def get_video
    json = { status: 0, code: 1, msg: 'successful', video: '' }
    assignment =  Assignment.find_by(id: params[:assignment_id])
    if assignment && assignment.tester_id == current_user.id
      if assignment.is_transfer && !assignment.is_sexy
        json[:video] = assignment.video
      elsif assignment.is_sexy
        json[:code], json[:msg] = 0, '视频资源涉及黄色内容，不予显示'
      elsif !assignment.is_transfer
        json[:code], json[:msg] = 0, '视频资源正在处理中，请稍后查看'
      end
    else
      json[:code], json[:msg] = 0, '没有权限查看视频资源'
    end
  end

  def edit
    @assignment = Assignment.find_by(id: params[:id])
  end

  def update
    @assignment = Assignment.find_by(id: params[:id])
    render :edit unless @assignment.tester == current_user.id
  end

  def miss
    tester = current_user.to_tester
    tester.update_attribute(:last_view_time, Time.now)
    assignments = tester.assignments
    @assignments =  assignments.missing
  end

  def not_interest
    current_user.update_attribute(:last_view_time, Time.now)
    render json: { status: 0, code: 1 }
  end

  def join
    tester = current_user.to_tester
    assignments = tester.assignments
    @assignments_ing =  assignments.take_part_ing
    @assignments_done = assignments.take_part_done
  end

  def destroy
    assignment = current_user.to_tester.assignments.find_by(id: params[:id])
    json = { status: 0, code: 1, msg: '删除任务成功' }
    unless assignment && delete_video_at_qiniu(assignment, {}) && assignment.destroy
      json[:code], json[:msg] = 0, '没有权限删除这个任务或者此任务已经不存在'
    end

    render json: json
  end

  def delete_video
    json = { status: 0, code: 1, msg: '删除视频成功' }

    @assignment = Assignment.find_by(id: params[:assignment_id])
    if @assignment.tester.id == current_user.id
      delete_video_at_qiniu(assignment, json)
    else
      json[:code], json[:msg] = 0, '你没有权限操作'
    end

    render json: json
  end

  def upload_token
    json = { status: 0, code: 1, msg: "生成token成功", token: '' }
    if params[:name].blank?
      json[:code], json[:msg] = 0, '文件名不能为空'
    elsif current_user
      token = generate_token(params[:assignment_id], params[:name])
      json[:token] = token
    else
      json[:code], json[:msg] = 0, '你没有权限'
    end

    render json: json
  end

  def callback_from_qiniu
    json = { status: 0, code: 0, msg: '上传文件不成功' }
    id = $redis.get(params[:auth_token])
    if id && tester = Tester.find_by(id: id)
      assignment = Assignment.find_by(id: params[:assignment_id])
      if assignment.try(:tester_id) == tester.id
        video = "http://" + Settings.qiniu_bucket_domain + "/" + params[:key_name].to_s
        assignment.update_attributes(video: video, status: "wait_check")
        json[:code] = 1
        json[:video] = video
        json[:msg] = '上传文件成功'
      end
    end

    render json: json
  end

  def callback_from_qiniu_transfer
    tester = Tester.find_by(id: params[:tester_id])
    video = "http://" + Settings.qiniu_bucket_domain + "/" + params[:inputKey]
    if tester
      assignment = tester.assignments.find_by(id: params[:assignment_id])
      if assignment && assignment.video == video
        video_url = "http://" + Settings.qiniu_bucket_domain + "/" + params[:items].first[:key].to_s
        assignment.video, assignment.is_transfer = video_url, true
        code, result, response_headers = Qiniu::Storage.delete(
          Settings.qiniu_bucket,
          params[:inputKey].to_s
        )
        assignment.save
      end
    end

    render text: 'hello qiniu transfer'
  end

private

  def delete_video_at_qiniu(assignment, json)
    code, result, response_headers = Qiniu::Storage.delete(
        Settings.qiniu_bucket,
        URI.parse(assignment.try(:video)).path.to_s[1..-1]
    )
    if code == 200
      assignment.update_attributes(status: "delete", video: '') if !json.size.zero?
      true
    else
      json[:code], json[:msg] = 0, '没有找到资源'
      false
    end
  end

  def generate_token(id, file_name)
    auth_token = generate_qiniu_auth_token
    $redis.set(auth_token, current_user.id)
    $redis.expire(auth_token, 1.days)

    key_name = generate_key_name(file_name)
    callback_path = "/testers/#{params[:tester_id]}/assignments/#{params[:assignment_id]}/callback_from_qiniu"
    persistentNotify_path = "/testers/#{params[:tester_id]}/assignments/#{params[:assignment_id]}/callback_from_qiniu_transfer"

    callbackUrl = if Rails.env.development?
      "#{Settings.ngork_domain}#{callback_path}"
    else
      "my domain "
    end
    persistentNotifyUrl = if Rails.env.development?
      "#{Settings.ngork_domain}#{persistentNotify_path}"
      else
      " my domain callbackUrl"
    end

    put_policy = {
      scope: "#{Settings.qiniu_bucket}",
      saveKey: "#{key_name}",
      callbackUrl: callbackUrl,
      callbackBody: "auth_token=#{auth_token}&key_name=#{key_name}&assignment_id=#{id}",
      deadline: 1.days.from_now.to_i,
      persistentOps: "avthumb/mp4/wmImage/" + qiniu_encode("http://119.254.101.120/assets/logo/logo-1d6138d60eb45eac05766b5dc16c240ea0868de1d8816168fb52adc08534fcf8.png") ,
      persistentNotifyUrl: persistentNotifyUrl
    }
    Qiniu::Auth.generate_uptoken(put_policy)
  end

  def generate_qiniu_auth_token
    SecureRandom.uuid + Time.now.to_i.to_s
  end

  def generate_key_name(key_name)
    Time.now.to_i.to_s + [*'a'..'z',*'0'..'9',*'A'..'Z'].sample(8).join + key_name.to_s
  end

  def qiniu_encode(content)
    Qiniu::Utils.urlsafe_base64_encode content
  end
end
