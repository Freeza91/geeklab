class AssignmentsController < ApplicationController

  before_action :require_login?, except: :callback_from_qiniu
  skip_before_filter :verify_authenticity_token, :only => [:callback_from_qiniu, :destroy]

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
    unless assignment && assignment.destroy
      json[:code], json[:msg] = 0, '没有权限删除这个任务或者此任务已经不存在'
    end

    render json: json
  end

  def delete_video
    json = { status: 0, code: 1, msg: '删除视频成功' }

    @assignment = Assignment.find_by(id: params[:assignment_id])
    if @assignment.tester.id == current_user.id
      code, result, response_headers = Qiniu::Storage.delete(
          Settings.qiniu_bucket,
          @assignment.try(:video).to_s
      )
      if code == 200
        @assignment.update_attributes(status: "delete", video: '')
      else
        json[:code], json[:msg] = 0, '没有找到资源'
      end
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
        video = params[:key_name]
        assignment.update_attributes(video: video, status: "wait_check")
        json[:code] = 1
        json[:video_url] = "http://" + Settings.qiniu_bucket_domain + "/#{video}"
        json[:msg] = '上传文件成功'
      end
    end

    render json: json
  end

private

  def generate_token(id, file_name)
    auth_token = generate_qiniu_auth_token
    $redis.set(auth_token, current_user.id)
    $redis.expire(auth_token, 1.days)

    key_name = generate_key_name(file_name)
    callback_path = "/testers/#{params[:tester_id]}/assignments/#{params[:assignment_id]}/callback_from_qiniu"

    callbackUrl = if Rails.env.development?
      "#{Settings.ngork_domain}#{callback_path}"
    else
      "my domain "
    end

    put_policy = {
      scope: "#{Settings.qiniu_bucket}",
      saveKey: "#{key_name}",
      callbackUrl: callbackUrl,
      callbackBody: "auth_token=#{auth_token}&key_name=#{key_name}&assignment_id=#{id}",
      deadline: 1.days.from_now.to_i,
      persistentOps: "avthumb/mp4"
    }
    Qiniu::Auth.generate_uptoken(put_policy)
  end

  def generate_qiniu_auth_token
    SecureRandom.uuid + Time.now.to_i.to_s
  end

  def generate_key_name(key_name)
    Time.now.to_i.to_s + [*'a'..'z',*'0'..'9',*'A'..'Z'].sample(8).join + key_name.to_s
  end
end
