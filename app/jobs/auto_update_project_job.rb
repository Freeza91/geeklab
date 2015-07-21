class AutoUpdateProjectJob < ActiveJob::Base
  queue_as :update_project

  def perform(project_id)
    project = Project.find_by(id: $hashids.encode(project_id))
    project.update_attribute(:status, 'checking') if project && project.status == 'wait_check'
  end

end
