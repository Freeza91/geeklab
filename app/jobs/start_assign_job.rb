class StartAssignJob < ActiveJob::Base
  queue_as :start_assign

  def perform(project_id)
    project = Project.find_by(id: $hashids.encode(project_id))
    if project && project.status == 'success'
      project.update_column(:status, 'underway')
      AssignmentCategory.assignment_to_tester(project_id)
    end
  end
end
