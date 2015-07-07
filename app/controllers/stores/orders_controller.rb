class Stores::OrdersController < Stores::BaseController

  before_action :require_login?

  def index
    @orders = current_user.orders.all
  end

  def create
    json = { status: 0, code: 1, msg: '保存成功' }

    good = Good.find_by(order_params)
    if good.stock > 1
      @order = current_user.orders.build(order_params)
      unless @order.save
        json[:code], json[:msg] = 0, "#{@order.errors.full_messages}"
      end
    else
      json[:code], json['msg'] = 2, '库存不足'
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
    params.require(:order).permit(:good_id)
  end

end
