class Feedback < ActiveRecord::Base

  belongs_to :assignment

  include ::Jsons::Feedback

end
