class Stores::OrdersController < Stores::BaseController

  before_action :require_login?
  skip_before_filter :verify_authenticity_token, :create

  def index
    @orders = current_user.orders.all
  end

  def create
    json = { status: 0, code: 1, msg: '创建订单成功' }

    good = Good.find_by(id: params[:good_id])
    p good
    if good && good.stock > 1
      @order = current_user.orders.build(order_params)
      sku = good.skus.can_sell.last
      if sku
        unless @order.save && sku.update_column(:num, sku.num - 1) &&
          good.update_attributes(stock: good.stock - 1, used_num: good.used_num + 1 )
          json[:code], json[:msg] = 0, "#{@order.errors.full_messages}"
        end
      else
        json[:code], json['msg'] = 2, '库存不足'
      end
    else
      json[:code], json['msg'] = 2, '库存不足'
    end

    render json: json
  end

  def show
    @order = current_user.orders.includes(:good).find_by(id: params[:id])
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
    # params.require(:order).permit(:good_id)
    params.permit(:good_id)
  end

end
