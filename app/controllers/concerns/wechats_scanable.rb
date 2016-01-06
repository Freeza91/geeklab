require 'active_support/concern'

module WechatsScanable
  extend ActiveSupport::Concern

  include WechatsRewardable

  def scan(scene_id, openid)

    return send_reward(openid, @reward.amount, @reward.num) if check(scene_id)

    "这个二维码已经过期，无法兑换！！"

  end

  private

  def check(scene_id)
    order_id = $reids.get scene_id
  end

end