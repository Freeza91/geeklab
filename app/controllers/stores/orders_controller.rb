class Stores::OrdersController < Stores::BaseController

  def index
    @orders = current_user.orders.all
  end

  def new
  end

  def create
    json = { status: 0, code: 1, msg: '保存成功' }

    @order = current_user.orders.build(order_params)
    unless @order.save
      json[:code], json[:msg] = 0, "#{@order.errors.full_messages}"
    end

    render json: json
  end

  def show
    @order = current_user.orders.find_by(id: params[:id])
  end

  def edit
    @order = current_user.orders.find_by(id: params[:id])
  end

  def update
    json = { status: 0, code: 1, msg: '更新成功' }

    @order = current_user.orders.find_by(id: params[:id])
    unless @order.update_attributes(order_params)
      json[:code], json[:msg] = 0, "#{@order.errors.full_messages}"
    end

    render json: json
  end

private

  def order_params
    params.require(:order).permit(:num, :good_name, :total_cost, :good_id)
  end

end
