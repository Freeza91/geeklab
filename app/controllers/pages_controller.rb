class PagesController < ApplicationController
  def home
    MailWorker.perform_async
  end
  
  def pm
  end

  def tester
  end
end
