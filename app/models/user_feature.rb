class UserFeature < ActiveRecord::Base

  belongs_to :project, inverse_of: :user_feature

  validates :age, :income, :sex, :city_level,
            :education, :emotional_status,
            :sex_orientation,
            # :interest, 这里为空，则代表无限制！
            presence: true

  include UserFeatureVirtualAttr

end
