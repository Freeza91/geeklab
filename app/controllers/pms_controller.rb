class PmsController < ApplicationController

  before_action :require_login?, except: :index

  def index
    current_user.update_attribute(:role, 'both') if current_user.try(:role) == 'tester'
  end

  def new
  end

  def web
  end

  def app
  end

end
