class ProjectsController < ApplicationController

  before_action :require_login?
  before_action :is_pm?

  def index
    @projects = current_user.to_pm.projects.show.order("id desc").includes(:assignments)
    @projects = @projects.page(params[:page]).per(10)
    #@assignments = []
    #@projects.each do |project|
      #@assignments << project.assignments.done.show_pm.order("updated_at desc").limit(project.demand)
    #end

    respond_to do |format|
      format.html
      format.json do
        json = {status: 0, code: 1, projects: [] }
        @projects.each do |project|
          json[:projects] << project.to_json_for_index
        end
        #@assignments.each do |a|
          #json[:assignments] << a
        #end

        render json: json
      end
    end

  end

  def video
    @project = current_user.to_pm.projects
                           .show.includes(:user_feature)
                           .find_by(id: params[:id])

    if @project
      @assignment = @projects.assignments.includes(:feedbacks)
                             .find_by(id: params[:assignment_id])
      @assignment.update_attribute(:is_read, true) if @assignment
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

    @project = current_user.to_pm.projects.includes(:tasks).includes(:user_feature).find_by(id: params[:id])
    json[:project] = @project.to_json_to_pm if @project

    respond_to do |format|
      format.html
      format.json { render json: json }
    end
  end

  def update

    json = { status: 0, code: 1, msg: '更新成功' }

    project = current_user.to_pm.projects.find_by(id: params[:id])

    if project
      unless project.update(project_params)
        json[:code], json[:msg] = 0, "更新不成功:#{project.errors.full_messages}"
      end
    else
      json[:code], json[:msg] = 0, "没有找到这个项目"
    end

    render json: json

  end

  def destroy
    json = { status: 0, code: 1, msg: '' }

    project = Project.find_by(id: params[:id])
    if project && project.pm_id == current_user.id
      project.update_attribute(:status, 'delete')
    else
      json[:code], json[:msg] = 0, '没有权限或者已经删除'
    end

    render json: json
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

end
