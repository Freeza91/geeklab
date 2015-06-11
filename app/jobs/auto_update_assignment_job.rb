class AutoUpdateAssignmentJob < ActiveJob::Base
  queue_as :update_assignment

  def perform(assignment_id)
    a = Assignment.find_by(id: assignment_id)
    a.update_attribute(:status, 'checking') if a.status == 'new' || a.status == 'test'
  end

end
