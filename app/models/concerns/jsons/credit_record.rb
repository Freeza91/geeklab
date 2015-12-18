require 'active_support/concern'

module Jsons

  module CreditRecord
    extend ActiveSupport::Concern

    def to_json
    {
      bonus_credits: bonus_credits,
      rating: rating
    }
    end

  end

end
