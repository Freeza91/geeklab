class Users::RewardsController < ApplicationController

  include WechatsTicketable

  before_action :require_login?

  def index
    @records = current_user.reward_records.page(params[:page])
  end

  def create
    json = { status: 0, code: 1, msg: '兑换成功' }

    unless current_user.id_card&.status == true
      json[:code], json[:msg] = 0, '还未认证成功！'
      return render json: json
    end

    reward = Reward.where(id: params[:id]).first
    unless reward
      json[:code], json[:mgs] = -1, '没有这个红包'
      return render json: json
    end

    ActiveRecord::Base.transaction do
      credits = current_user.credits - reward.cost
      if credits < 0
        json[:code], json[:mgs] = -2, '积分不足'
        return json
      else
        @order = current_user.orders.build(total_cost: reward.cost,
                                           type: 'reward',
                                           reward_id: reward.id)

        get_ticket

        if @order.save
          @reward_record = current_user.reward_records.build(order_id: @order.id,
                                                             amount: reward.cost,
                                                             id_num: current_user.id_card.id_num,
                                                             name: current_user.id_card.name,
                                                             secret: @secret)
          if @reward_record.save
            current_user.update_column(:credits, credits)
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
    get_ticket
  end

  def destroy
  end

end
