class UserMailer < ApplicationMailer

  def welcome(email, code)
    @code = code
    sendgrid_category "Welcome"
    mail :to => email, :subject => "Welcome :-)"
    render 'user_mailer/welcome', layout: false
  end
end
