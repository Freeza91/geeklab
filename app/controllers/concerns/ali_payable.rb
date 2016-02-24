# encoding: utf-8
# alipay doc
# https://doc.open.alipay.com/doc2/detail.htm?spm=0.0.0.0.xqRZcU&treeId=62&articleId=103566&docType=1

module AliPayable
  extend ActiveSupport::Concern

  def alipay
    # https://doc.open.alipay.com/doc2/detail.htm?spm=0.0.0.0.A9K7Q9&treeId=62&articleId=103740&docType=1
    p pay_url = Alipay::Service.create_direct_pay_by_user_url({
                  out_trade_no: out_trade_no,
                  subject: '付款测试',
                  total_fee: '0.01',
                  return_url: 'https://www.baidu.com/',
                  notify_url: 'http://test.geeklab.cc/users/reward_records'
                })
    # return_url
    # referer
    # https://doc.open.alipay.com/doc2/detail.htm?spm=0.0.0.0.ptO3kC&treeId=62&articleId=103742&docType=1
    # example
    # https://www.baidu.com/?buyer_email=useyes91@gmail.com&buyer_id=2088502994882065&exterface=create_direct_pay_by_user&is_success=T&notify_id=RqPnCoPT3K9%2Fvwbh3InUEJALhu6D3PGQujsjWYQsAslYl6XZqUcIDIbJAcBaYLQgzP%2BR&notify_time=2016-02-24 14:36:49&notify_type=trade_status_sync&out_trade_no=1456295770-bcf0ead0f9c2&payment_type=1&seller_email=gifpay@geekpark.net&seller_id=2088111206197228&subject=付款测试&total_fee=0.01&trade_no=2016022421001004060287094797&trade_status=TRADE_SUCCESS&sign=6e11d3245666f069a5c089c2960b13c0&sign_type=MD5

    redirect_to pay_url
  end

  def alipay_callback

    if ali_notify_verify?
      if out_trade_no_verify?
      else
        render text: '此项付款发生了异常！！！'
      end

    else
      render text: '不是阿里的支付回调！！！'
    end
    # notify_url
    # referer
    #
    #  POST "xxxxxxxxx" for 110.75.225.236
    # Parameters: {"discount"=>"0.00", "payment_type"=>"1", "subject"=>"付款测试", "trade_no"=>"2016022421001004060287094797", "buyer_email"=>"useyes91@gmail.com", "gmt_create"=>"2016-02-24 14:36:38", "notify_type"=>"trade_status_sync", "quantity"=>"1", "out_trade_no"=>"1456295770-bcf0ead0f9c2", "seller_id"=>"2088111206197228", "notify_time"=>"2016-02-24 14:36:47", "trade_status"=>"TRADE_SUCCESS", "is_total_fee_adjust"=>"N", "total_fee"=>"0.01", "gmt_payment"=>"2016-02-24 14:36:46", "seller_email"=>"gifpay@geekpark.net", "price"=>"0.01", "buyer_id"=>"2088502994882065", "notify_id"=>"b89e53f43c71dd97a0dad2481777191ggq", "use_coupon"=>"N", "sign_type"=>"MD5", "sign"=>"d5e8d856db485f600f3178aa5c388fc6"}
  end

  def alipay_exception_callback
    # https://doc.open.alipay.com/doc2/detail.htm?spm=0.0.0.0.ptO3kC&treeId=62&articleId=103743&docType=1
  end

  private

    def out_trade_no
      Time.now.to_i.to_s + '-' + (SecureRandom.hex 6)
    end

    def ali_notify_verify?
      # https://doc.open.alipay.com/doc2/detail.htm?spm=0.0.0.0.ptO3kC&treeId=62&articleId=103745&docType=1
      Alipay::Sign.verify?(params)
    end

    def ali_out_trade_no_verify?
      # 商户需要验证该通知数据中的out_trade_no是否为商户系统中创建的订单号，并判断total_fee是否确实为该订单的实际金额（即商户订单创建时的金额），同时需要校验通知中的seller_id（或者seller_email) 是否为out_trade_no这笔单据的对应的操作方（有的时候，一个商户可能有多个seller_id/seller_email），上述有任何一个验证不通过，则表明本次通知是异常通知，务必忽略。在上述验证通过后商户必须根据支付宝不同类型的业务通知，正确的进行不同的业务处理，并且过滤重复的通知结果数据。在支付宝的业务通知中，只有交易通知状态为TRADE_SUCCESS或TRADE_FINISHED时，支付宝才会认定为买家付款成功。 如果商户需要对同步返回的数据做验签，必须通过服务端的签名验签代码逻辑来实现。如果商户未正确处理业务通知，存在潜在的风险，商户自行承担因此而产生的所有损失。

      # 交易状态TRADE_SUCCESS的通知触发条件是商户签约的产品支持退款功能的前提下，买家付款成功；
      # 交易状态TRADE_FINISHED的通知触发条件是商户签约的产品不支持退款功能的前提下，买家付款成功；或者，商户签约的产品支持退款功能的前提下，交易已经成功并且已经超过可退款期限；
      # 交易成功之后，商户（高级即时到账或机票平台商）可调用批量退款接口，系统会发送退款通知给商户，具体内容请参见批量退款接口文档；
      # 当商户使用站内退款时，系统会发送包含refund_status和gmt_refund字段的通知给商户。
    end

end