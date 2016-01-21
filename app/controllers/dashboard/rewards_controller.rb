class Dashboard::RewardsController < Dashboard::BaseController

  load_and_authorize_resource
  before_action :get_reward, only: [:show, :edit, :destroy, :update]

  def index
    @rewards = Reward.page(params[:page])
  end

  def new
    @reward = Reward.new
  end

  def create
    @reward = Reward.new(reward_params)
    if @reward.save
      redirect_to dashboard_reward_path(@reward)
    else
      render :new
    end
  end

  def show
  end

  def edit
  end

  def update
    if @reward.update_attributes(reward_params)
      redirect_to dashboard_rewards_path
    else
      render :edit
    end
  end

  def destroy
    @reward.destroy

    redirect_to dashboard_rewards_path
  end


private

  def reward_params
    params.require(:reward).permit(:name, :cost, :amount, :publish)
  end

  def get_reward
    @reward = Reward.find params[:id]
  end

end
