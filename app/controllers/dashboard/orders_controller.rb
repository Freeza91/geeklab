class Dashboard::OrdersController  < Dashboard::BaseController

  load_and_authorize_resource

  def index
    @orders = Order.includes(:good).page(params[:page]).per(10)
    @q = Order.ransack(params[:q])
  end

  def edit
    @orders = Order.find params[:id]
    if @orders.good.virtual?
      @sku = @order.sku
      render :virtual
    else
      @address = @order.address
      render :real
    end
  end

  def destroy
    @orders = Order.find params[:id]
    @orders.destroy

    redirect_to dashboard_orders_path
  end

  def search
    # it should be get http
    @orders = Order.ransack(params[:q])
                 .result.page(params[:page]).per(1000)
    @q = Order.ransack(params[:q])

    render :index
  end

end