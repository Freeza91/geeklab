class Dashboard::RewardRecordsController < Dashboard::BaseController

  load_and_authorize_resource

  before_action :get_resource, only: [:show, :edit, :update]

  def index
    @records = RewardRecord.page(params[:page])
  end

  def show
  end

  def edit
  end

  def update
    if @record.update_attributes(reward_record_params)
      redirect_to dashboard_reward_records_path
    else
      render :edit
    end
  end

private

  def get_resource
    @record = RewardRecord.find params[:id]
  end

  def reward_record_params
    params.require(:reward_record).permit()
  end

end
