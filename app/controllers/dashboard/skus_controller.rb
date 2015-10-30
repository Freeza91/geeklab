class Dashboard::SkusController < Dashboard::BaseController

  load_and_authorize_resource

  def new
    @good = Good.where(id: params[:good_id]).first
  end

  def create_or_update
    @good = Good.where(id: params[:good_id]).first
    if @good && @good.update_attributes(goos_skus_params)
      redirect_to edit_dashboard_good_path(@good)
    else
      render :new
    end
  end

  def update
    @good = Good.where(id: params[:good_id]).first
    @good && @good.update_attributes(good_skus_order_params)

    redirect_to dashboard_orders_path
  end

private

  def goos_skus_params
    params.require(:good).permit(skus_attributes:
                                  [:id, :account, :secret, :_destroy, :num])
  end

  def good_skus_order_params
    params.permit(:account, :secret)
  end

end