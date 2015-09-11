class Dashboard::AssignmentsController < Dashboard::BaseController

  load_and_authorize_resource

  def index
    @assignments = Assignment.all.order("updated_at desc").page(params[:page]).per(10)
  end

  def update
  end

end