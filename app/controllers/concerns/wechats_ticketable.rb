require 'active_support/concern'

module WechatsTicketable
  extend ActiveSupport::Concern

  URL = "https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token="

  def get_ticket
    return get_ticket_from_wechat if check_access_token!
    false
  end

  private

  def check_access_token!
    @access_token = $redis.get "wechats_access_token"

    unless @access_token
      if WechatsAccessToken.get_or_update
        @access_token = $redis.get("wechats_access_token")
      end
    end

    return true if @access_token

    false
  end

  def get_ticket_from_wechat
    begin
      response = RestClient.post URL + @access_token, ticket_params,
                                 content_type: :json, accept: :json
      if response.code == 200
        json = JSON.parse(response.body)
        if json['ticket'].present?
          @ticket = json['ticket']
        else
          return false
        end
      end
    rescue => e
      e.response
      return false
    end

    true
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
    }.to_json
  end

  def generate_scene_id

    while true
      r = Random.rand(1..100_000_000_000)
      unless $redis.get r
        @scene_id = r
        @secret = SecureRandom.uuid
        $redis.set r, @secret

        break
      end
    end

    @scene_id
  end

end