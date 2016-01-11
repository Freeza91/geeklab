class IntegralRecord < ActiveRecord::Base

  validates :cost, :describe, :assignemnt_id, :user_id, presence: true

  belongs_to :assignment
  belongs_to :user

end
