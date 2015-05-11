class UserMailer < ApplicationMailer

  def welcome(email, code)
    @code = code
    @email = email
    sendgrid_category "Welcome"
    mail to: email, subject: "注册验证码"
    render 'user_mailer/welcome', layout: false
  end

  def reset_password(user, url)
    @url = url
    @email = user.email
    sendgrid_category "Reset Password "
    mail to: user.email, subject: "重置密码"

    render 'user_mailer/reset_password', layout: false
  end
end
