require 'active_support/concern'

module WechatsRewardable
  extend ActiveSupport::Concern

  URL = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack'

  private

  def send_reward(openid, amount, sceret, scene_id)
    params = build_params(openid, amount * 100, 1)
    xml = build_xml_body(params)
    http = build_cert_http

    reply_text = ""

    http.start do

      http.request_post(@uri.path, xml.to_xml) do |res|
        doc = Hash.from_xml(res.body)['xml']
        if doc['return_code'] == 'SUCCESS'

          @record.update_attributes(status: 'SENT', mch_billno: params[:mch_billno], openid: openid, amount: amount)

          # 在24小时候查询这个红包状态
          t = Time.now + 24.hours + 5.minutes
          CheckRewardFromWechatsJob.set(wait_until: t).perform_later(@record.id)

          reply_text =  '请在24小时之内领取红包，过期作废！'
        else
          # 1. 余额不足
          # 2. API发送受限
          # 3. .......
          UserMailer.send_reward_error(doc)
          reply_text = '红包没有发送成功，请稍后再试或者联系管理员'
        end
      end

    end

    reply_text
  end

  def build_params(openid, amount, num)
    options = {
      nonce_str: nonce_str ,#随机字符串
      mch_billno: order_num, # 商户订单号
      mch_id: Settings.wechats_mch_id,#商户编号
      wxappid: Settings.wechats_appid, # 公众账号appid
      send_name: '极客实验室', # 提供方名称
      re_openid: openid, # 用户openid
      total_amount: amount, # 付款金额
      total_num: num, # 红包发放总人数
      wishing: '恭喜发财，大吉大利', # 红包祝福语
      client_ip: Settings.domain_ip, # Ip地址
      act_name: '现金红包', # 活动名称
      remark: '红包奖励' # 备注
    }
    options[:sign] = md5_with_partner_key(options)

    options
  end

  def nonce_str
    SecureRandom.hex
  end

  def order_num
    Settings.wechats_mch_id.to_s + Time.now.strftime('%Y%-m%-d') + Time.now.to_i.to_s
  end

  def md5_with_partner_key(params)
    str = params.sort.map { |item| item.join('=') }.join('&')
    str << "&key=#{Settings.wechats_pay_secret}"
    Digest::MD5.hexdigest(str).upcase
  end

  def build_cert_http
    cert = File.read("#{Settings.cert_path}/cert/apiclient_cert.pem")
    key = File.read("#{Settings.cert_path}/cert/apiclient_key.pem")
    @uri = URI.parse URL
    http = Net::HTTP.new(@uri.host, @uri.port)
    http.use_ssl = true if @uri.scheme == 'https'
    http.cert = OpenSSL::X509::Certificate.new(cert)
    http.key = OpenSSL::PKey::RSA.new(key, '商户编号')
    http.ca_file = File.join("#{Settings.cert_path}/cert/rootca.pem")
    http.verify_mode = OpenSSL::SSL::VERIFY_PEER

    http
  end

  def build_xml_body(options)
    xml = <<-XML.strip_heredoc
      <xml>
      <sign><![CDATA[#{options[:sign]}]]></sign>
      <mch_billno><![CDATA[#{options[:mch_billno]}]]></mch_billno>
      <mch_id><![CDATA[#{options[:mch_id]}]]></mch_id>
      <wxappid><![CDATA[#{options[:wxappid]}]]></wxappid>
      <send_name><![CDATA[#{options[:send_name]}]]></send_name>
      <re_openid><![CDATA[#{options[:re_openid]}]]></re_openid>
      <total_amount><![CDATA[#{options[:total_amount]}]]></total_amount>
      <total_num><![CDATA[#{options[:total_num]}]]></total_num>
      <wishing><![CDATA[#{options[:wishing]}]]></wishing>
      <client_ip><![CDATA[#{options[:client_ip]}]]></client_ip>
      <act_name><![CDATA[#{options[:act_name]}]]></act_name>
      <remark><![CDATA[#{options[:remark]}]]></remark>
      <nonce_str><![CDATA[#{options[:nonce_str]}]]></nonce_str>
      </xml>
    XML

    Nokogiri::XML xml
  end

end
