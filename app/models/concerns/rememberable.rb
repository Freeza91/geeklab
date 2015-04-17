require 'active_support/concern'

module Rememberable
  extend ActiveSupport::Concern

  included do
  end

  # def serialize_into_session

  # end

  # def serialize_from_session
  # end

  def remeber_me
    cookies.signed[:id] = {
      value: self.id,
      expires: 10.days.from_now,
      domain: 'localhost.com'
    }
  end

  def forget_me
    cookies.delete(:id, domain: 'localhost') if cookies[:id]
  end

  # def remember_token
  # end

end