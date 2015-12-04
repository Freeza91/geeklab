require 'active_support/concern'

module JSONS

  module Feedback
    extend ActiveSupport::Concern

    def to_json_for_video
      {
        id: self.to_params,
        timeline: timeline.to_i,
        desc: desc
      }
    end

  end

end
