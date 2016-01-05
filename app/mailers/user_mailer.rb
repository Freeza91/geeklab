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
    user = User.find_by(id: $hashids.encode(user_id))
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
    mail to: email, subject: "新任务到达通知"
    render 'user_mailer/new_task_notice', layout: false
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

  def subscribe_notify(email, name, task_url)
    @email = email
    @name = name
    @task_url = task_url

    sendgrid_category "subscribe notify"
    mail to: email, subject: '你有新任务可以做啦'
    render 'user_mailer/subscribe_notify'
  end

  def project_error
    email = "yuanyegreat@163.com"
    mail to: email, subject: "新手任务添加错误"
    render "user_mailer/project_error"
  end

  def send_reward_error(doc)
    @content = doc

    @email = 'yuanyegreat@163.com'
    mail to: @email, subject: '红包发送错误'

    render "user_mailer/send_reward_error.html.slim"
  end

end
