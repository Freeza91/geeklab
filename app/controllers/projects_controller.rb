class ProjectsController < ApplicationController

  before_action :require_login?
  before_action :is_pm?

  def index
  end

  def show
  end

  def web
  end

  def app
  end

  def new
    @project = Project.new
    @task = @project.tasks.build
    @user_feature = @project.build_user_feature
  end

  def create
    project = Project.new(project_params)
    if project.save
      p project.tasks
      p project.user_feature
    else
      p project.errors.full_messages
    end

    render :show
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
                                    user_feature_attributes: [
                                      :sex, :income, :age, :city_level,
                                      :education, :emotional_status,
                                      :sex_orientation, :interest
                                    ])
  end

  def is_pm?
    redirect_to pms_path unless ['both', 'pm'].include?(current_user.role)
  end

end