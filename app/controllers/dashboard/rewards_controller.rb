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
  end

  def show
  end

  def edit
  end

  def update
  end

  def destroy
  end


private

  def reward_params
  end

  def get_reward
    @reward = Reward.find params[:id]
  end

end
