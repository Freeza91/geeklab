class PagesController < ApplicationController
  def home
    UserMailer.welcome.deliver_later
  end

  def pm
  end

  def tester
  end
end
