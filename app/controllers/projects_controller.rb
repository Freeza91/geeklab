class ProjectsController < ApplicationController

  before_action :require_login?, except: :index
  before_action :is_pm?

  def index
  end

  def show
  end

  def new
  end

  def create
  end

  def destroy
  end

private

  def project_params
  end

  def is_pm?
    redirect_to pms_path unless ['both', 'pm'].include?(current_user.role)
  end

end
