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

  def new_task_notice(email, name, task_url)
    @email = email
    @name = name
    @task_url = task_url

    sendgrid_category "new task novice"
    mail to: email, subject: "新手任务到达通知"
    render 'user_mailer/new_task_notice', layout: false
  end

  def novice_task_approved(email, title, task_url)
    @email = email
    @title = title
    @task_url = task_url

    sendgrid_category "novice task approved send"
    mail to: email, subject: "新手任务通过通知"
    render 'user_mailer/novice_task_approved', layout: false
  end

  def video_check_failed(email, name, task_url)
    @email = email
    @name = name
    @task_url = task_url

    sendgrid_category "video check failed"
    mail to: email, subject: '视频审核未通过'
    render 'user_mailer/video_check_failed', layout: false
  end

  def video_check_success(email, name, task_url)
    @email = email
    @name = name
    @task_url = task_url

    sendgrid_category "video check success"
    mail to: email, subject: '视频审核通过'
    render 'user_mailer/video_check_success', layout: false
  end

end
