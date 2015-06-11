class UserFeature < ActiveRecord::Base

  belongs_to :project

  validates :age, :income, :sex, :city_level,
            :education, :emotional_status,
            :sex_orientation, :interest,
            :project_id, presence: true

  include UserFeatureVirtualAttr

end
