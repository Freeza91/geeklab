class Users::RewardRecordsController < ApplicationController

  include WechatsTicketable

  before_action :require_login?

  def index
    @records = current_user.reward_records.page(params[:page])
  end

  def create
    json = { status: 0, code: 1, msg: '兑换成功' }

    unless current_user.id_card&.status == true
      json[:code], json[:msg] = -1, '还未认证成功！'
      return render json: json
    end

    reward = Reward.where(id: params[:id]).first
    unless reward
      json[:code], json[:msg] = -2, '没有这个红包'
      return render json: json
    end

    ActiveRecord::Base.transaction do
      credits = current_user.credits - reward.cost
      if credits < 0
        json[:code], json[:msg] = -3, '积分不足'
        return render json: json
      else
        @order = current_user.orders.build(good_name: reward.name,
                                           total_cost: reward.cost,
                                           kind: 'reward',
                                           reward_id: reward.id)
        if @order.save
          @reward_record = current_user.reward_records.build(order_id: @order.id,
                                                             amount: reward.amount,
                                                             cost: reward.cost,
                                                             id_num: current_user.id_card.id_num,
                                                             name: current_user.id_card.name,
                                                             status: 'CREATED')
          @integral_record = current_user.integral_records
                                         .build(cost: reward.cost,
                                                describle: reward.name,
                                                kind_of: 'order',
                                                order_id: @order.id)

          if @reward_record.save && @integral_record.save
            current_user.update_column(:credits, credits)
            json[:id] = $hashids.encode(@reward_record.id)
          else
            json[:code], json[:msg] = -3, '兑换失败'
          end
        else
          json[:code], json[:msg] = -3, '兑换失败'
        end
      end
    end

    return render json: json
  end

  def show
    json = { status:0, code: 1, msg: '成功查看' }

    record = current_user.reward_records.find_by(id: params[:id])

    unless record
      json[:code], json[:msg] = 0, '不存在这个红包记录'
      return render json: json
    end

    if get_ticket
      record.update_column(:secret, @secret)
      json[:ticket] = @ticket
    else
      json[:code], json[:msg] = -1, '获取ticket失败，请重试！'
    end

    render json: json

  end

  def destroy
  end
end
