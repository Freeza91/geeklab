require 'active_support/concern'

module AddressVirtualAttr
  extend ActiveSupport::Concern

  attr_accessor :deliver_company, :deliver_id

  included do
    before_save :combine
  end

  def deliver_company
    addition.split('&').first if addition
  end

  def deliver_id
    addition.split('&').last if addition
  end

  def combine
    self.addition = @deliver_company.to_s + '&' + @deliver_id.to_s
  end

end