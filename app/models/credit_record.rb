class CreditRecord < ActiveRecord::Base

  validates :tester_id, :project_id, :assingment_id, presence: true

  belongs_to :tester
  belongs_to :assingment
  belongs_to :project

end
