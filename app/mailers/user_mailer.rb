class UserMailer < ApplicationMailer

  def welcome(email, code)
    @code = code
    @email = email
    sendgrid_category "Welcome"
    mail to: email, subject: "注册验证码"
    render 'user_mailer/welcome', layout: false
  end

  def reset_password(user_id, url)
    @url = url
    user = User.find_by(id: user_id)
    return unless user
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

  def novice_task_approved(email)
    @email = email
    sendgrid_category "novice task approved send"
    mail to: email, subject: "新手任务通过通知"
    render 'user_mailer/novice_task_approved', layout: false
  end

  def new_task_notice(email, task_url)
    @email = email
    @task_url = content
    sendgrid_category "new task novice"
    mail to: email, subject: "新手任务到达通知"
    render 'user_mailer/new_task_notice', layout: false
  end
end
