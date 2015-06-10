class StartAssignJob < ActiveJob::Base
  queue_as :start_assign

  def perform(project_id)
    AssignmentCategory.assignment_to_tester(project_id)
  end
end
