require 'rest-client'
require 'json'

class WechatsAccessToken

  URL = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=#{Settings.wechats_appid}&secret=#{Settings.wechats_secret}"

  def self.get_or_update

    begin
      response = RestClient.get URL
      if response.code == 200
        json = JSON.parse(response.body)
        $redis.set "wechats_access_token", json['access_token']
        # $redis.expire "wechats_access_token", json['expires_in']
      end

    rescue => e
      e.response
      return false
    end

    true
  end


end