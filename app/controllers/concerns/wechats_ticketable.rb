require 'active_support/concern'

module WechatsTicketable
  extend ActiveSupport::Concern

  URL = "https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token="

  def get_ticket
    check_access_token!
    get_ticket_from_wechat
  end

  private

  def check_access_token
    @access_token = $redis.access_token
    unless @access_token
      WechatsAccessToken.get_or_update
      @access_token = $redis.access_token
    end
  end

  def get_ticket_from_wechat
    response = RestClient.post URL + @access_token, ticket_params,
                               content_type: :json, accept: :json
    if response.code == 200
      json = JSON.parse(response.body)
      if json['errcode'] == 42001 || # access_token 失效
         json['errcode'].present?
        WechatsAccessToken.get_or_update
        @access_token = $redis.access_token
        get_ticket_from_wechat(@access_token)
      elsif json['ticket'].present?
        @ticket = json['ticket']
      end
    end
  end

  def ticket_params
    {
      "expire_seconds": 604800,
      "action_name": "QR_SCENE",
      "action_info": {
        "scene": {
          "scene_id": generate_scene_id
        }
      }

    }
  end

  def generate_scene_id

    while true
      r = Random.rand(1..100_000_000_000)
      unless $redis.get r
        @scene_id = r
        @secret = SecureRandom.uuid
        $redis.set r, @secret
      end
    end

    @scene_id
  end

end