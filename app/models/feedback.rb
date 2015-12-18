class Feedback < ActiveRecord::Base

  belongs_to :assignment

  include JSONS::Feedback

end
