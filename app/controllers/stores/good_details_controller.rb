class Stores::GoodDetailsController < Stores::BaseController

  before_filter :authenticate

  def index
    @good_details = Good.find_by(id: params[:good_id]).good_details
  end

  def new
    @good = Good.find_by(id: params[:good_id])
    @good_detail = @good.good_details.build
  end

  def create
    @good = Good.find_by(id: params[:good_id])
    @good_detail = @good.good_details.build(good_detail_params)

    if @good_detail.save
      redirect_to stores_good_good_details_path
    else
      render :new
    end
  end

  def show
    good = Good.find_by(id: params[:good_id])
    @good_detail = good.good_details.find_by(id: params[:id])
  end

  def edit
    @good = Good.find_by(id: params[:good_id])
    @good_detail = @good.good_details.find_by(id: params[:id])
  end

  def update
    @good = Good.find_by(id: params[:good_id])
    @good_detail = @good.good_details.find_by(id: params[:id])
    if @good_detail.update_attributes(good_detail_params)
      redirect_to stores_good_good_detail_path
    else
      render :edit
    end
  end

private

  def good_detail_params
    params.require(:good_detail).permit(:detail)
  end

end
