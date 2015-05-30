require 'active_support/concern'

module Recoverable
  extend ActiveSupport::Concern

  included do

  end

  def generate_reset_password_token
    self.reset_password_sent_at = Time.now
    self.reset_password_token = SecureRandom.uuid + '-' + SecureRandom.hex(rand(10))
  end

end