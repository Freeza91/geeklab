class UserMailerPreview < ActionMailer::Preview
  def welcome
    UserMailer.welcome('rudy@geekpark.net', '123456')
  end

  def reset_password
    UserMailer.reset_password( User.first.id, "http://geeklab.cc")
  end

  def novice_task
    UserMailer.novice_task('rudy@geekpark.net')
  end

  def novice_task_approved
    UserMailer.novice_task_approved('rudy@geekpark.net')
  end

  def new_task_notice
    UserMailer.new_task_notice('rudy@geekpark.net', '新手任务通知')
  end
end