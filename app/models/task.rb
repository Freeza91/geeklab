class Task < ActiveRecord::Base

  validates :content, :project_id, presence: true

  belongs_to :project,  inverse_of: :tasks
end
