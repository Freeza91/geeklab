class Dashboard::RewardRecordsController < Dashboard::BaseController

  load_and_authorize_resource

  before_action :get_resource, only: [:show, :edit, :update]

  def index
    @records = RewardRecord.page(params[:page])
    @q = RewardRecord.ransack(params[:q])
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

   def export
    @records = RewardRecord.unscoped
                           .select('id_num, name, sum(amount) as amount')
                           .group('id_num, name')
                           # .having
                           # .where()
    respond_to do |format|
      format.csv { send_data @records.to_csv }
      # format.xls { send_data @products.to_csv(col_sep: "\t") }
    end
  end

  def search
    @records = RewardRecord.ransack(params[:q])
                          .result.page(params[:page]).per(10)
    @q = RewardRecord.ransack(params[:q])

    render :index
  end

private

  def get_resource
    @record = RewardRecord.find params[:id]
  end

  def reward_record_params
    params.require(:reward_record).permit()
  end

end
