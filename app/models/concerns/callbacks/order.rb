require 'active_support/concern'

module Callbacks

  module Order
    extend ActiveSupport::Concern

    included do
      after_create :set_order_id
    end

    def set_order_id
      self.order_id = generate_order_id
      save(validate: false)
    end

    def generate_order_id
      "%.10s" % SecureRandom.uuid
    end

  end

end