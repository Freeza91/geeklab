require 'active_support/concern'

module Confirmable
  extend ActiveSupport::Concern

  included do
    before_save :generate_confirm_token
  end


private
  def generate_confirm_token

  end

end