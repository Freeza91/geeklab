require 'active_support/concern'

module WechatsScanable
  extend ActiveSupport::Concern

  include WechatsRewardable

  def scan(scene_id, openid)

    if check(scene_id)

      return '已经发放成功无法在使用!' unless @record.status == 'CREATED' # 创建完成
      return '账号异常，禁止发红包' if @record.limit?
      return '正在发放红包中，请耐心等待！' if $redis.get "user-#{scene_id}"
      used = $redis.get "user-#{scene_id}", true

      reply_text = ''
      begin
        reply_text = send_reward(openid, @record.amount, @record.secret, scene_id)
      rescue
        reply_text = "网络异常！请稍微再试！"
      ensure
        $redis.del "user-#{scene_id}"
      end

      reply_text

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