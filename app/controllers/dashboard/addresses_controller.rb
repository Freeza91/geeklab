class Dashboard::AddressesController < Dashboard::BaseController

  load_and_authorize_resource

  def update
    @address = Address.find params[:id]
    if @address.order.id.to_s == params[:order_id]
      @address.deliver_id = params[:deliver_id]
      @address.deliver_company = params[:deliver_company]

      @address.update_attributes(address_params)
    end

    redirect_to dashboard_orders_path
  end

private

  def address_params
    params.permit(:name, :tel, :status, :location)
  end

end
