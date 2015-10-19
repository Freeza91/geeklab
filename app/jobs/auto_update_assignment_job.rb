class AutoUpdateAssignmentJob < ActiveJob::Base
  queue_as :update_assignment

  def perform(assignment_id)
    a = Assignment.find_by(id: $hashids.encode(assignment_id))
    if a && (a.status == 'new' || a.status == 'test')
      a.update_attribute(:status, 'checking')
    end
  end

end
