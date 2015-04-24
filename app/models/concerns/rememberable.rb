require 'active_support/concern'

module Rememberable
  extend ActiveSupport::Concern

  included do
  end

  def remember_me(cookies)
    cookies.signed[:id] = {
      value: self.id,
      expires: 1.month.from_now
    }
  end

  def forget_me(cookies)
    cookies.delete(:id) if cookies.signed[:id]
  end

end