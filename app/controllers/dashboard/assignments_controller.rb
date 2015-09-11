class Dashboard::AssignmentsController < Dashboard::BaseController

  load_and_authorize_resource # 此处无法使用hash id

  def index
    @assignments = Assignment.all.includes(:project).order("updated_at desc").page(params[:page]).per(10)
  end

  def check
    @assignment = Assignment.find(params[:id])
  end

  def pass
  end

  def destroy
    @assignment = Assignment.find(params[:id])
    @assignment && @assignment.destroy

    redirect_to dashboard_videos_path
  end

end