class NotitySubscribeJob < ActiveJob::Base
  queue_as :notity_subscribe

  def perform(assignment_id)

  end

end
