class MailWorker
  include Sidekiq::Worker
  sidekiq_options queue: "mailer"
  def perform
    p "this is sidekiq"
  end

end