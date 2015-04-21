class MailWorker
  include Sidekiq::Worker
  sidekiq_options queue: "test"
  def perform
    p "this is sidekiq"
  end

end