require 'active_support/concern'

module WechatsScanable
  extend ActiveSupport::Concern

  include WechatsRewardable

  def scan(scene_id, openid)

    if check(scene_id)
      return '已经发放成功无法在使用!' unless @record.status == 'CREATED' # 创建完成
      return '账号异常，禁止发红包' if @record.limit?
      return send_reward(openid, @record.amount, @record.secret, scene_id)
    end

    "这个二维码已经过期，无法兑换！！"

  end

  private

  def check(scene_id)
    secret = $redis.get scene_id
    @record = RewardRecord.find_by(secret: secret)

    @record.present?
  end

end