require 'active_support/concern'

module Mobileable
  extend ActiveSupport::Concern

  def gerenate_auth_token
    self.auth_token = SecureRandom.uuid + Time.now.to_i.to_s + '-' + SecureRandom.hex(rand(10))
  end
end