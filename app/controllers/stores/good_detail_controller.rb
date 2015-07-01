class Stores::GoodDetailController < Stores::BaseController

  def index
    @good_details = GoodDetail.all
  end

  def new
  end

  def create
  end

  def show
    @good_details = GoodDetail.find_by(id: params[:id])
  end

  def edit
    @good_details = GoodDetail.find_by(id: params[:id])
  end

end
