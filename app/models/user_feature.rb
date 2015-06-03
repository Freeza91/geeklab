class UserFeature < ActiveRecord::Base

  belongs_to :project, inverse_of: :project

  include user_feature_virtual_attr

end
