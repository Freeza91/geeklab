class AssignmentsController < ApplicationController
  include QiniuAbout

  def index
    tester = current_user.to_tester
    assignments = tester.assignments
    if tester.approved
      @assignments = assignments.new_tasks.order("id desc").page(params[:page]).per(10)
      @num = assignments.not_view_num(tester.last_view_time)
    else
      @assignments = assignments.test_task.order("id desc").page(params[:page]).per(10)
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
    render json:json
  end

  def miss
    tester = current_user.to_tester
    assignments = tester.assignments
    @assignments =  assignments.missing.order("id desc").page(params[:page]).per(10)

    respond_to do |format|
      format.html do
        tester.update_column(:last_view_time, Time.now)
      end
      format.json do
        json = {status: 0, code: 1, assignments: [] }
        @assignments.each do |a|
          json[:assignments] << a.to_json_with_project
        end
        render json: json
      end
    end

  end

  def not_interest
    current_user.update_column(:last_view_time, Time.now)
    render json: { status: 0, code: 1 }
  end

  def join
    tester = current_user.to_tester
    assignments = tester.assignments
    tester.update_column(:last_view_time, Time.now)
    @assignments_ing =  assignments.take_part_ing.order("id desc").page(params[:page]).per(10)
    @assignments_done = Kaminari.paginate_array(assignments.take_part_done).page(params[:page]).per(10)
  end

  def ing
    tester = current_user.to_tester
    assignments = tester.assignments
    assignments_ing =  assignments.take_part_ing.order("id desc").page(params[:page]).per(10)
    json = {status: 0, code: 1, assignments_ing: [] }
    assignments_ing.each do |a|
      json[:assignments_ing] << a.to_json_with_project
    end

    render json: json
  end

  def done
    tester = current_user.to_tester
    assignments = tester.assignments
    assignments_done = Kaminari.paginate_array(assignments.take_part_done.order("id desc")).page(params[:page]).per(10)
    json = {status: 0, code: 1, assignments_done: [] }
    assignments_done.each do |a|
      json[:assignments_done] << a.to_json_with_project
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

    unless assignment && delete_video_at_qiniu(assignment, {}) && assignment.destroy
      json[:code], json[:msg] = 0, '没有权限删除这个任务或者此任务已经不存在'
    end

    render json: json
  end

  def delete_video
    json = { status: 0, code: 1, msg: '删除视频成功' }

    assignment = Assignment.find_by(id: params[:assignment_id])
    if assignment.tester.id == current_user.id
      delete_video_at_qiniu(assignment, json)
    else
      json[:code], json[:msg] = 0, '你没有权限操作'
    end

    render json: json
  end


private

  def delete_video_at_qiniu(assignment, json)

    code, result, response_headers = Qiniu::Storage.delete(
        Settings.qiniu_bucket,
        URI.parse(assignment.try(:video).to_s).path.to_s[1..-1].to_s
    )

    json[:code], json[:msg] = 0, '没有找到资源' unless code == 200
    assignment.update_attributes(status: "delete", video: '') if !json.size.zero?

    true
  end

end
