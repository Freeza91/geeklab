class PmsController < ApplicationController

  before_action :require_login?, except: :index

  def index
  end

  def new
  end

  def web
  end

  def app
  end

end
