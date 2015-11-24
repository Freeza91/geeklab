class Feedback < ActiveRecord::Base

  belongs_to :assignment

  def to_json_for_video
    {
      id: self.to_params,
      timeline: timeline.to_i,
      desc: desc
    }
  end

end
