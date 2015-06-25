class ProjectsController < ApplicationController

  before_action :require_login?
  before_action :is_pm?

  def index
    @projects = current_user.to_pm.projects.includes(:assignments).order("id desc")
  end

  def show
    @project = current_user.to_pm.projects.includes(:tasks).includes(:user_feature).includes(:assignments).find_by(id: params[:id])
    @assignments = @project ? @project.assignments.done.order("id desc").limit(@project.try(:demand)) : []
  end

  def video

    @project = current_user.to_pm.projects.includes(:user_feature).includes(:assignments).find_by(id: params[:id])
    @other_assignments = []
    @assignment = []

    if @project
      assignments = @project.assignments.done.limit(@project.try(:demand))
      if assignments && assignments.size > 0
        @assignment = assignments.find_by(id: params[:assignments_id])
        @assignment.update_attribute(:is_read, true) if @assignment
        @other_assignments = assignments - [@assignment]
      end
    end


  end

  def web
  end

  def app
  end

  def create
    json = { status: 0, code: 1, msg: '' }
    project = current_user.to_pm.projects.build(project_params)

    json[:code], json[:msg] = 0, project.errors.full_messages unless project.save

    render json: json
  end

  def edit
    json = { status: 0, code: 1, msg: "" }

    @project = project = current_user.to_pm.projects.includes(:tasks).includes(:user_feature).find_by(id: params[:id])
    json[:project] = project.to_json_to_pm if project

    respond_to do |format|
      format.html
      format.json { render json: json }
    end
  end

  def update

    json = { status: 0, code: 1, msg: '更新成功' }

    project = current_user.to_pm.projects.find_by(id: params[:id])
    p project
    p project_params

    unless project && project.update(project_params)
      json[:code], json[:msg] = 0, "更新不成功:#{project.errors.full_messages}"
    end

    render json: json

  end

  def destroy
  end

private

  def project_params

    project_param = params.permit(:name, :profile, :device, :requirement,
                                  :platform, :desc, :contact_name,
                                  :qr_code, :demand,
                                  :phone, :email, :company)
    tasks_params = {
      "tasks_attributes": JSON.parse(params[:tasks_attributes]),
    }

    action_params = {
      "controller": "projects",
      "action": "create"
    }

    user_feature_params = {
      "user_feature_attributes": JSON.parse(params[:user_feature_attributes])
    }

    params = ActionController::Parameters.new(project_param.merge(user_feature_params).merge(tasks_params).merge!(action_params))

    params.permit(
                :name, :profile, :device, :requirement,
                :platform, :desc, :contact_name,
                :qr_code, :demand,
                :phone, :email, :company,
                tasks_attributes: [:id, :content, :_destroy],
                user_feature_attributes:[{
                  sex:  [], city_level: [],
                  emotional_status: [],
                  sex_orientation: [],
                  education: [],
                  interest: []
                },
                :age, :income
                ])
  end

  def is_pm?
    redirect_to pms_path unless ['both', 'pm'].include?(current_user.role)
  end

end
