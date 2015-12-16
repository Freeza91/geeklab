class AssignmentsController < ApplicationController

  before_action :require_login?
  before_action :get_resoures, only: [:fresh, :finish,
                                      :ing, :done]
  include QiniuAbout
  include GrabAssignments

  def index
    tester = current_user.to_tester
    unless tester.tester_infor
      return redirect_to choose_device_testers_path
    end
  end

  def fresh
    json = { status: 0, code: 1, assignments: [] }

    if @tester.approved
      @assignments = @assignments.new_tasks.order("id desc").page(params[:page]).per(10)
    else
      @assignments = @assignments.test_task.order("id desc").page(params[:page]).per(10)
    end

    @assignments.each do |a|
      json[:assignments] << a.to_json_for_index
    end

    render json: json
  end

  def finish
    json = { status: 0, code: 1, assignments: [] }

    @assignments = @assignments.finish_project.order("id desc").page(params[:page]).per(10)
    @assignments.each do |a|
      json[:assignments] << a.to_json_for_index
    end

    render json: json
  end

  def show
    json = { status: 0, code: 1 }

    @assignment = Assignment.find_by(id: params[:id])
    type = params[:type]

    if @assignment && @assignment.tester_id == current_user.id
      case type
        when 'task'
          @project = @assignment.project
          json[:project] = @project.to_json_with_tasks
        when 'ing'
          json[:assignment] = @assignment.to_json_for_ing
      end
    else
      json[:code], json[:msg] = 0, '项目为空'
    end

    render json: json
  end

  def get_video
    json = { status: 0, code: 1, msg: 'successful', video: '' }
    assignment =  Assignment.find_by(id: params[:assignment_id])
    if assignment &&( assignment.tester_id == current_user.id ||
                      auth_user_token(params[:auth_token]) )

      if assignment.is_transfer && !assignment.is_sexy
        json[:video] = assignment.video
      elsif assignment.is_sexy
        json[:code], json[:msg] = 1, '视频资源涉及黄色内容，不予显示'
      elsif !assignment.is_transfer
        json[:code], json[:msg] = 2, '视频资源正在处理中，请稍后查看'
      end
    else
      json[:code], json[:msg] = 0, '没有权限查看视频资源'
    end
    render json:json
  end

  def join
    current_user.update_column(:last_view_time, Time.now)
  end

  def ing
    json = {status: 0, code: 1, assignments: [] }

    @assignments = @assignments.take_part_ing.sort_by { |a| -1 * a.id }.uniq
    @assignments = Kaminari.paginate_array(@assignments).page(params[:page]).per(10)
    @assignments.each do |a|
      json[:assignments] << a.to_json_for_ing
    end

    render json: json
  end

  def done
    json = {status: 0, code: 1, assignments: [] }

    @assignments = @assignments.finish_task.sort_by { |a| -1 * a.id }.uniq
    @assignments = Kaminari.paginate_array(@assignments).page(params[:page]).per(10)
    @assignments.each do |a|
      json[:assignments] << a.to_json_for_done
    end

    render json: json
  end

  def destroy
    assignment = current_user.to_tester.assignments.find_by(id: params[:id])
    json = { status: 0, code: 1, msg: '删除任务成功' }
    unless current_user.approved
      json[:code], json[:msg] = 0, '没有完成新手任务，你无法删除'
      return render json: json
    end

    if assignment
      expired_at = Time.now
      assignment.update_columns(status: 'delete', expired_at: expired_at,
                                stop_time: false, video: '')
      NotitySubscribeJob.set(wait_until: expired_at).perform_later(assignment.id)
    else
      json[:code], json[:msg] = 0, '没有权限删除这个任务或者此任务已经不存在'
    end

    render json: json
  end

  def delete_video
    json = { status: 0, code: 1, msg: '删除视频成功' }

    assignment = Assignment.find_by(id: params[:assignment_id])
    if assignment && assignment.tester.id == current_user.id && project = assignment.project
      if project.beginner # 新手任务
        delete_video_at_qiniu(assignment, json)
      elsif assignment.can_do?
        delete_video_at_qiniu(assignment, json)
        recover_time_down(assignment)
      else
        json[:code], json[:msg] = -1, '任务已经过期或者已经结束，你无法进行此项操作'
      end
    else
      json[:code], json[:msg] = 0, '你没有权限操作'
    end

    render json: json
  end

  def rating
    json = { status: 0, msg: 'success', code: 1 }

    assignment = Assignment.find_by(id: params[:id])

    if assignment && assignment.project.pm_id == current_user.id
      record = CreditRecord.find_by(project_id: params[:project_id],
                                    assignment_id: assignment.id)
      unless record

        rating = (params[:rating] || 5).to_i
        assignment.update_column(:rating_from_pm, rating)
        project = assignment.project
        basic_bonus = project.basic_bonus || 0
        bonus = rating * basic_bonus
        origin_credis = current_user.credits || 0
        tester = assignment.tester

        record = CreditRecord.new(tester_id: assignment.tester_id,
                                  project_id: project.id,
                                  assignment_id: assignment.id,
                                  credits: project.credit || 0,
                                  bonus_credits: basic_bonus,
                                  used: true,
                                  rating_type: 'pm',
                                  rating: rating)

        record.save && tester.update_column(:credits, bonus + origin_credis)
      end
    else
      json[:code], json[:msg] = 0, '没有找到资源'
    end

    render json: json
  end

private

  def get_resoures
    @tester = current_user.to_tester
    @assignments = @tester.assignments
  end

  def delete_video_at_qiniu(assignment, json)

    begin
      code, result, response_headers = Qiniu::Storage.delete(
          Settings.qiniu_bucket,
          URI.parse(assignment.video.to_s).path.to_s[1..-1].to_s
      )
      puts '没有找到资源' unless code == 200
    rescue
      puts "网络异常"
    end
    assignment.update_column(:video, '')

    true
  end

  def recover_time_down(assignment)
    if assignment.stop_time
      new_expired_at = assignment.expired_at + (Time.now - assignment.stop_time_at)
      assignment.update_columns(expired_at: new_expired_at, stop_time: false, status: 'new')
      NotitySubscribeJob.set(wait_until: new_expired_at).perform_later(assignment.id)
    end
  end

end
