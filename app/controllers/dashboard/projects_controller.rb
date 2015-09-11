class Dashboard::ProjectsController < Dashboard::BaseController

  load_and_authorize_resource

  def index
  end

  def show
    @project = Project.find_by(id: params[:id])
  end

end

