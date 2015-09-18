class Dashboard::ProjectsController < Dashboard::BaseController

  load_and_authorize_resource

  def index
    @projects = Project.order(:id).page(params[:pgae]).per(10)
  end

  def edit
    respond_to do |format|
      format.html
      format.json do
        json = { code: 0, msg: '', porject: {}, tasks: {} , user_feature: {} }
        @project = Project.includes(:tasks).includes(:user_feature).find(params[:id])

        if @project
          json[:porject] = @project
          json[:tasks] = @project.tasks
          json[:user_feature] = @project.user_feature
        end

        render json: json
      end
    end
  end

  def update
  end

  def select
  end

  def deliver
  end

  def destroy
  end

private

  def project_params
    params.require(:projects).permit(:reasons, :expired_at, :credit, :status)
  end

end

