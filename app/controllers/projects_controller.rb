class ProjectsController < ApplicationController

  before_action :require_login?
  before_action :is_pm?

  def index
  end

  def show
    @project = Project.find_by(id: params[:id]).includes(:tasks).includes(:user_feature)
  end

  def web
  end

  def app
  end

  def create
    json = { status: 0, code: 1, msg: '' }
    project = Project.new(project_params)
    if project.save
      json[:msg] = 'success'
    else
      json[:code], json[:msg] = 0, project.errors.full_messages
    end

    render json: json
  end

  def destroy
  end

private

  def project_params
    params.require(:project).permit(:name, :profile, :device, :requirement,
                                    :platform, :desc, :contact_name,
                                    :qr_code, :demand,
                                    :phone, :email, :company,
                                    tasks_attributes: [:content],
                                    user_feature_attributes:[
                                      {
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