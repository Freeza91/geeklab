class Dashboard::AssignmentsController < Dashboard::BaseController

  load_and_authorize_resource # 此处无法使用hash id

  def index
    @assignments = Assignment.all.includes(:project).order("updated_at desc").page(params[:page]).per(10)
  end

  def check
    respond_to do |format|
      format.html { render '/dashboard/assignments/check' }
      format.json do
        json = { code: 0, msg: '', assignment: {} }
        @assignment = Assignment.includes(:project).find(params[:id])
        if @assignment
          json[:assignment] = {
            id: @assignment.id,
            public: @assignment.public,
            status: @assignment.status,
            reasons: @assignment.reasons,
            rank: @assignment.rank,
            feedbacks: @assignment.feedbacks
          }
        end

        render json: json
      end
    end
  end

  def update
    @assignment = Assignment.find params[:id]
    if @assignment && @assignment.update_attributes(assignment_params)
      redirect_to dashboard_videos_path
    else
      render :check
    end
  end

  def destroy
    @assignment = Assignment.find(params[:id])
    @assignment && @assignment.destroy

    redirect_to dashboard_videos_path
  end

private

  def assignment_params
    params.require(:assignments).pemit(:public, :reasons, :rank, :status,
                                       feedbacks_attributes:
                                         [:timeline, :desc, :suggestion])
  end

end
