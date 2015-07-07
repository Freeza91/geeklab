class Stores::OrdersController < Stores::BaseController

  before_action :require_login?

  def index
    @orders = current_user.orders.includes(:good).all
  end

  def create
    json = { status: 0, code: 1, msg: '创建订单成功' }

    good = Good.find_by(id: params[:order][:good_id])
    if good && good.stock > 1
      @order = current_user.orders.build(order_params)
      sku = good.skus.can_sell.last
      if sku
        @order.sku_id = good.id
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
    json = { status: 0, code: 1, msg: '' }
    order = current_user.orders.find_by(id: params[:id])
    json[:msg] = Sku.find_by(id: order.sku.try(:id)).try(:addition) if order

    render json: json

  end

  def destroy
    json = { status: 0, code: 1, msg: '' }
    order = current_user.orders.find_by(id: params[:id])
    unless order && order.destroy
      json[:code], json[:msg] = 0, "已经删除或者没有权限"
    end

    render json: json
  end

private

  def order_params
    params.require(:order).permit(:good_id)
  end

end
