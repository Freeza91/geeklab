class CheckRewardFromWechatsJob < ActiveJob::Base
  queue_as :check_reward_from_wechats_job

  URL = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/gethbinfo'

  def perform(record_id)
    @record = RewardRecord.where(id: record_id).last
    return unless @record

    params = build_params(@record.mch_billno)
    xml = build_xml_body(params)
    http = build_cert_http
    http.start do
      http.request_post(@uri.path, xml.to_xml) do |res|
        @doc = Hash.from_xml(res.body)['xml']
        @record.update_columns(record_params) if @doc['return_code'] == "SUCCESS"
      end
    end

  end

  def build_params(mch_billno)
    options = {
      nonce_str: nonce_str ,#随机字符串
      mch_billno: mch_billno, # 商户订单号
      mch_id: Settings.wechats_mch_id,#商户编号
      appid: Settings.wechats_appid, # 公众账号appid
      bill_type: 'MCHT'
    }
    options[:sign] = md5_with_partner_key(options)
    options
  end

  def nonce_str
    SecureRandom.hex
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
      <appid><![CDATA[#{options[:appid]}]]></appid>
      <bill_type><![CDATA[#{options[:bill_type]}]]></bill_type>
      <nonce_str><![CDATA[#{options[:nonce_str]}]]></nonce_str>
      </xml>
    XML

    Nokogiri::XML xml
  end

  def record_params
    # 此处并没有涉及到裂变红包，故hblist只有一个
    hbinfo = @doc['hblist']['hbinfo']
    {
      mch_billno: @doc['mch_billno'],
      detail_id: @doc['detail_id'],
      status: @doc['status'],
      send_time: @doc['send_time'],
      refund_time: @doc['refund_time'],
      refund_amount: @doc['refund_amount'].to_i,
      openid: hbinfo['openid'],
      rcv_time: hbinfo['rcv_time']
    }
  end

end