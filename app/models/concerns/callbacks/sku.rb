require 'active_support/concern'

module Callbacks

  module Sku
    extend ActiveSupport::Concern

    included do
      before_create :set_uuid, :inc_good_stock
    end

    def set_uuid
      self.uuid = SecureRandom.uuid
    end

    def inc_good_stock
      inc_num = num
      IncGoodStockJob.perform_later(good_id, inc_num)
    end

  end

end