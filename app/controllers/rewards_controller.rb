class RewardsController < ApplicationController

  def index
    @rewards = Reward.page(params[:page])
  end

end
