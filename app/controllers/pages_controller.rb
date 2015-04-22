class PagesController < ApplicationController
  def home
    MailWorker.perform_async
  end
end
