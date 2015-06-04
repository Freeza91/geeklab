if Rails.env.development?
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
      task_url = "#{Settings.domain}/testers/1/assignments"
      UserMailer.new_task_notice('rudy@geekpark.net', task_url)
    end

    def video_check_failed
      task_url = "#{Settings.domain}/testers/1/assignments/join"
      UserMailer.video_check_failed('rudy@geekpark.net', task_url)
    end
  end
end