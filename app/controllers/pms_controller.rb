class PmsController < ApplicationController

  before_action :require_login?, except: :index

  def index
  end

  def new
  end

end
