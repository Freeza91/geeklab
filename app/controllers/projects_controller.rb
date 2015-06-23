class ProjectsController < ApplicationController

  before_action :require_login?
  before_action :is_pm?

  def index
    @projects = current_user.to_pm.projects.includes(:assignments).order("id desc")
  end

  def show
    @project = current_user.to_pm.projects.includes(:tasks).includes(:user_feature).includes(:assignments).find_by(id: params[:id])
    @assignments = @project ? @project.assignments.order("id desc") : nil
  end

  def video
    @project = current_user.to_pm.projects.includes(:user_feature).includes(:assignments).find_by(id: params[:id])
    @assignments = @project ? @project.assignments : nil
    @assignment = @assignments ? @assignments.find_by(id: params[:assignments_id]) : nil
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

    project = current_user.to_pm.projects.includes(:tasks).includes(:user_feature).find_by(id: params[:id])
    json[:project] = project.to_json_to_pm if project
    render json

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
                tasks_attributes: [:content],
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