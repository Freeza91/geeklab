class IntegralRecord < ActiveRecord::Base

  validates :cost, :describe, presence: true

end
