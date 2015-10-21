require 'active_support/concern'

module SkuVartualAttr
  extend ActiveSupport::Concern

  attr_accessor :account, :secret

  included do
    before_save :combine
  end

  def account
    addition.split('&').first if addition
  end

  def secret
    addition.split('&').last if addition
  end

  def combine
    self.addition = @account.to_s + '&' + @secret.to_s
  end

end