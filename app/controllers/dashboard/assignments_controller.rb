class Dashboard::AssignmentsController < Dashboard::BaseController

  load_and_authorize_resource # 此处无法使用hash id

  def index
    @assignments = Assignment.order('id desc').page(params[:page]).per(10)
    @q = Assignment.ransack(params[:q])
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
            feedbacks: @assignment.feedbacks,
            rating_from_pm: @assignment.rating_from_pm,
            rating_from_admin: @assignment.rating_from_admin,
            is_record: !!@assignment.credit_record
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

  def search
    # it should be get http
    @q = Assignment.ransack(params[:q])
    @assignments = Assignment.ransack(params[:q])
                       .result.page(params[:page]).per(1000)
    render :index
  end

private

  def assignment_params
    params.require(:assignment).permit(:public, :rating_from_pm, :rating_from_admin, :status,
                                       reasons: [],
                                       feedbacks_attributes:
                                         [:id, :timeline, :desc, :suggestion, :_destroy])
  end

end
