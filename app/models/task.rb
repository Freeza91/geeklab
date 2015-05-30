class Task < ActiveRecord::Base

  belongs_to :project,  inverse_of: :tasks
end
