class CreditRecord < ActiveRecord::Base

  validates :tester_id, :project_id, :assignment_id, presence: true

  belongs_to :tester
  belongs_to :assignment
  belongs_to :project

  include ::Jsons::CreditRecord

end
