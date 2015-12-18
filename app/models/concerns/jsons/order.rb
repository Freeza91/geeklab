require 'active_support/concern'

module Jsons

  module Order
    extend ActiveSupport::Concern

    def to_json
      json = {
        id: self.to_params,
        created_at: created_at.strftime('%F'),
        order_num: order_id,
        virtual: self.virtual?,
        cost: self.good.cost,
        good_id: self.to_params(self.good_id),
        good_name: self.good.name,
        good_pic: self.good.pictures.first.url.try(:url),
        detail: self.get_order_detail
      }
      unless self.virtual?
        json[:express_status] = self.address.parse_status
      end
      json
    end

  end

end