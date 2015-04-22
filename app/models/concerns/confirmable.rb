require 'active_support/concern'

module Confirmable
  extend ActiveSupport::Concern

  included do
    # before_save :generate_confirm_token
  end

private
  # def generate_confirm_token
  #   self.confirmation_sent_at = Time.now
  #   self.confirmation_token = SecureRandom.uuid + '-' + SecureRandom.hex(rand(10))
  # end
end