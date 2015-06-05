class UserFeature < ActiveRecord::Base

  belongs_to :project, inverse_of: :project

  # validates :sex, presence: true

  include UserFeatureVirtualAttr

end
