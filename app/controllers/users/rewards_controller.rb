class Users::RewardsController < ApplicationController

  before_action :require_login?

  def index
    @records = current_user.reward_records.page(params[:page])
  end

  def create
    json = { status: 0, code: 0, msg: '兑换成功' }
    check!
    build_order
    build_reward
    build_qrcode
    # 创建订单
    # 创建reward记录
    # 生成二维码
  end

  def show
    build_qrcode
  end

  def destroy
  end

private

  def check!
  end

end
