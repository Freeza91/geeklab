class Task < ActiveRecord::Base

  validates :content,  presence: true

  belongs_to :project,  inverse_of: :tasks
end
