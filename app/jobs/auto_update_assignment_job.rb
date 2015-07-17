class AutoUpdateAssignmentJob < ActiveJob::Base
  queue_as :update_assignment

  def perform(assignment_id)
    a = Assignment.find_by(id: $hashids.encode(assignment_id))
    a.update_attribute(:status, 'checking') if a.try(:status) == 'new' || a.try.(:status) == 'test'
  end

end
