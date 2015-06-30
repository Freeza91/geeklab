class OrdersController < ApplicationController

  def index
    @orders = Order.all
  end

  def new
    @order = Order.new
  end

  def create
    json = { status: 0, code: 1, msg: '' }

    @order = Order.new(order_params)
    if @order.save
      redirect_to order_path(@order)
    else
      render :new
    end
  end

  def show
    @order = current_user.orders.find_by(id: params[:id])
  end

  def edit
    @order = current_user.orders.find_by(id: params[:id])
  end

  def update
    @order = current_user.orders.find_by(id: params[:id])
    if @order.update_attributes(order_params)
    else
    end
  end

private

  def order_params
    params.require(:order).permit(:num, :good_name, :total_cost, :good_id)
  end

end
