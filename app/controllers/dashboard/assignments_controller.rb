class Dashboard::AssignmentsController < Dashboard::BaseController

  load_and_authorize_resource # 此处无法使用hash id

  def index
    @assignments = Assignment.order(:id).page(params[:page]).per(10)
  end

  def edit
    respond_to do |format|
      format.html { render '/dashboard/assignments/edit' }
      format.json do
        json = { code: 0, msg: '', assignment: {} }
        @assignment = Assignment.includes(:project).find(params[:id])
        if @assignment
          json[:assignment] = {
            id: @assignment.id,
            public: @assignment.public,
            status: @assignment.status,
            reasons: @assignment.reasons || [],
            rank: @assignment.rank,
            feedbacks: @assignment.feedbacks
          }
        end

        render json: json
      end
    end
  end

  def update
    json = { status: 0, code: 1, msg: "success" }
    @assignment = Assignment.find params[:id]
    unless @assignment && @assignment.update_attributes(assignment_params)
      json[:code], json[:msg] = 0, 'failed'
    end

    render json: json
  end

  def destroy
    @assignment = Assignment.find(params[:id])
    @assignment && @assignment.destroy

    redirect_to dashboard_videos_path
  end

private

  def assignment_params
    params.require(:assignment).permit(:public, :rank, :status,
                                       reasons: [],
                                       feedbacks_attributes:
                                         [:id, :timeline, :desc, :suggestion, :_destroy])
  end

end
