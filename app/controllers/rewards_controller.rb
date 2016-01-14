class RewardsController < ApplicationController

  def index
    @rewards = Reward.show
  end

end
