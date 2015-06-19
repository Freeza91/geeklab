class CommentsController < ApplicationController

  before_action :require_login?
  before_action :is_pm?

  def create
    json = { status: 0, code: 1, msg: ''}

    assignment = Assignment.find_by(:id, params[:assignment_id])
    if assignment && assignment.project_id == params[:project_id] && assignment.tester_id == current_user.id
      comment = assignment.build_comment(comment_params)
      unless comment.save
        json[:code], json[:msg] = 0, "#{comment.errors.full_messages}"
      end
    else
      json[:code], json[:msg] = 0, '没有权限'
    end
  end

private

  def comment_params
    params.require(:comment).permit(:target_user, :qualified)
  end
end
