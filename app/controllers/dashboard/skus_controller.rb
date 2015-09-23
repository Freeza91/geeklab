class Dashboard::SkusController < Dashboard::BaseController

  load_and_authorize_resource

  def update
    @sku = Sku.find params[:id]
    @sku.update_attributes(sku_params) if @sku.orders.ids.include?(params[:order_id].to_i)

    redirect_to dashboard_orders_path
  end

private

  def sku_params
    params.permit(:account, :secret)
  end
end