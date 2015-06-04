if Rails.env.development?
  class UserMailerPreview < ActionMailer::Preview
    def welcome
      UserMailer.welcome('rudy@geekpark.net', '123456')
    end

    def reset_password
      UserMailer.reset_password( User.first.id, "http://geeklab.cc")
    end

    def new_task_notice
      name = "xxx新任务"
      task_url = "#{Settings.domain}/testers/1/assignments"
      UserMailer.new_task_notice('rudy@geekpark.net', name, task_url)
    end

    def novice_task_approved
      task_url = "#{Settings.domain}/testers/1/assignments"
      title = "你已经通过审核，正是成为一个测试用户"
      UserMailer.novice_task_approved('rudy@geekpark.net', title, task_url)
    end

    def video_check_failed
      task_url = "#{Settings.domain}/testers/1/assignments/join"
      name = 'xxx新任务'
      UserMailer.video_check_failed('rudy@geekpark.net', name, task_url)
    end

    def video_check_success
      name = "xxx任务"
      task_url = "#{Settings.domain}/testers/1/assignments/join"
      UserMailer.video_check_success('rudy@geekpark.net', name, task_url)
    end
  end
end