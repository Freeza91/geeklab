class FeedbacksController < ApplicationController

  before_action :require_login?
  before_action :auth

  def create
    json = { status: 0, code: 1, msg: 'success' }
    @assignment.feedbacks.build(feedback_params)

    json[:code], json[:msg] = 0, 'failed' unless @assignment.save

    render json: json
  end

  def update
    json = { status: 0, code: 1, msg: 'success' }

    feedback = @assignment.find_by(id: params[:id])

    unless feedback && feedback.update_attributes(feedback_params)
      json[:code], json[:msg] = 0, 'failed'
    end

    render json: json
  end

  def destroy
    json = { status: 0, code: 1, msg: 'success' }
    @assignment.destroy

    render json: json
  end

private

  def auth
    json = { status: 0, code: 0, msg: 'failed' }

    @assignment = Assignment.find_by(id: params[:assignment_id])
    unless @assignment && @assignment.tester_id == current_user.id
      return render json: json
    end

  end

  def feedback_params
    params.require(:feedback).permit(:timeline, :desc)
  end

end
