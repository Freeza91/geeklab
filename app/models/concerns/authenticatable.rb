require 'active_support/concern'

module Authenticatable
  extend ActiveSupport::Concern

  included do

  end

  # http://apidock.com/rails/ActiveSupport/MessageVerifier/secure_compare
  # 重放时间攻击
  def secure_compare(a, b)
    return false unless a.bytesize == b.bytesize

    l = a.unpack "C#{a.bytesize}"

    res = 0
    b.each_byte { |byte| res |= byte ^ l.shift }
    res == 0
  end

end