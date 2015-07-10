class StartAssignJob < ActiveJob::Base
  queue_as :start_assign

  def perform(project_id)
    AssignmentCategory.assignment_to_tester(project_id)
    project = Project.find_by(id: project_id)
    project.update_column(:status, 'underway') if project && project.try(:status) == 'success'
  end
end
