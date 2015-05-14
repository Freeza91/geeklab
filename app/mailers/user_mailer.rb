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

  def novice_task(email)
    attachments['新手任务.pdf'] = File.read("#{Rails.root.to_s}/public/新手任务.pdf")
    @email = email
    sendgrid_category "novice task send"
    mail to: email, subject: "新手任务"
    render 'user_mailer/novice_task', layout: false
  end
end
