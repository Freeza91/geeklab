class UserFeature < ActiveRecord::Base

  belongs_to :project

  # validates :sex, presence: true

  include UserFeatureVirtualAttr

end
