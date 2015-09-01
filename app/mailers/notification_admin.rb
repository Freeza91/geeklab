class NotificationAdmin < ApplicationMailer

  def project_error
    email = "yuanyegreat@163.com"
    mail to: email, subject: "新手任务添加错误"
    render 'user_mailer/project_error', layout: false
  end

end