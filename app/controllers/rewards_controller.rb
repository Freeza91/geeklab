class RewardsController < ApplicationController

  before_action :require_login?

  def index
    @rewards = Reward.show
  end

end
