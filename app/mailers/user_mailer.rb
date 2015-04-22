class UserMailer < ApplicationMailer

  def welcome
    sendgrid_category "Welcome"
    mail :to => '347212291@qq.com', :subject => "Welcome :-)"
    render 'user_mailer/welcome', layout: false
  end
end
