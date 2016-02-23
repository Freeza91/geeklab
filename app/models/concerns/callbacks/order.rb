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
      Time.now.strftime('%Y%-m%-d') + Time.now.to_i.to_s + ( "%.8s" % SecureRandom.uuid )
    end

  end

end