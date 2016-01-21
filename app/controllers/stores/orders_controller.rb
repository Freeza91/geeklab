class Stores::OrdersController < Stores::BaseController

  before_action :require_login?

  def index
    respond_to do |format|
      format.html do
        @num = current_user.orders.includes(:good).page(params[:page]).per(4).try(:size);
      end
      format.json do
        json = { status: 0, code: 1, orders:[] }

        @orders = current_user.orders.good?.includes(:good).page(params[:page]).per(4)
        @orders.each do |order|
          json[:orders] << order.to_json
        end

        render json: json
      end
    end
  end

  def create
    json = { status: 0, code: 1, msg: '创建订单成功' }

    good = Good.find_by(id: params[:order][:good_id])
    @order = current_user.orders.build(order_params)

    ActiveRecord::Base.transaction do
      if good && good.stock > 0
        if current_user.credits < good.cost
          json[:code], json[:msg] = 3, '你的积分不够'
          return render json: json
        end
        sku = good.skus.can_sell.last
        if sku
          @order.sku_id = sku.id
            @order.save
            if !good.virtual? && save_address?
              address = @order.build_address(address_params)
              address.user_id = current_user.id
              address.save
            end
            current_user.update_column(:credits, current_user.credits - good.cost)
            sku.update_column(:num, sku.num - 1) # skip inc_good_stock validate
            good.update_attributes(stock: good.stock - 1, used_num: good.used_num + 1 )
            @integral_record = current_user.integral_records
                                           .build(cost: good.cost,
                                                  describe: "兑换#{good.name}",
                                                  kind_of: 'order',
                                                  order_id: @order.id)
            @integral_record.save
        else
          json[:code], json['msg'] = 2, '库存不足'
        end
      else
        json[:code], json['msg'] = 2, '库存不足'
      end

    end

    render json: json
  end

  def show
    json = { status: 0, code: 1, msg: '' }
    order = current_user.orders.find_by(id: params[:id])
    if order
      if order.virtual?
        json[:msg] = Sku.find_by(id: $hashids.encode(order.sku.try(:id))).try(:addition)
        json[:virtual] = true
      else
        json[:msg] = order.address.try(:addition)
        p order.address.parse_status
        json[:express_status] = order.address.parse_status
        json[:virtual] = false
      end
    else
      json = { status: 0, code: 0, msg:  '这个订单不存在!' }
    end

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
    opt = params.require(:order).permit(:good_id)
    opt[:good_id] = $hashids.decode(opt['good_id'])[0] if opt['good_id']
    opt
  end

  def address_params
    params.require(:order).require(:address)
          .permit(:name, :tel, :location)
  end

  def save_address?
    params['order']['address'] && params['order']['address']['is_save']
  end

end
