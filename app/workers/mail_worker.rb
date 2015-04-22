class MailWorker
  include Sidekiq::Worker
  sidekiq_options queue: "test mailer"
  def perform
  end

end