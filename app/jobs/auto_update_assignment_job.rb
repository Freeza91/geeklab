class AutoUpdateAssignmentJob < ActiveJob::Base
  queue_as :update_assignment

  # Enqueue a job to be performed 1 week from now.
  # AutoUpdateAssignmentJob.set(wait: 1.minute).perform_later(Time.now.to_s)

  def perform(from_time)
    p "this will execute at 1 mitutes"
    p "define time at #{from_time}"
    p "execute at #{Time.now}"
    # Do something later
  end
end
