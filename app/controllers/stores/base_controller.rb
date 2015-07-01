class Stores::BaseController < ApplicationController

  layout 'stores/layouts/stores_application'

  def index
    render 'stores/index'
  end

end