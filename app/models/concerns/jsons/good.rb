require 'active_support/concern'

module Jsons

  module Good
    extend ActiveSupport::Concern

    def to_json_with_pictures
      {
        id: self.to_params,
        name: name,
        cost: cost,
        pictures: self.pictures.collect {|picture| picture.url.try(:url) }
      }
    end

  end

end