class UserMailer < ApplicationMailer

  def welcome(email, code)
    @code = code
    sendgrid_category "Welcome"
    mail to: email, subject: "Welcome :-)"
    render 'user_mailer/welcome', layout: false
  end

  def reset_password(user, url)
    @url = url
    sendgrid_category "Reset Password "
    mail to: user.email, subject: "GeekLabs Reset Password"

    render 'user_mailer/reset_password', layout: false
  end
end
