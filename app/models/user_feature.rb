class UserFeature < ActiveRecord::Base

  belongs_to :project, inverse_of: :project

  include UserFeatureVirtualAttr

end
