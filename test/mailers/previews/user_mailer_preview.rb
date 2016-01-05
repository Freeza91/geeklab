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

    def subscribe_notify
      UserMailer.subscribe_notify('yuanyegreat@163.com', 'hello', "http://test.geeklab.cc/assignments/join")
    end

    def send_reward_error
      doc =<<-EOF
        <xml>
          <return_code><![CDATA[FAIL]]></return_code>
          <return_msg><![CDATA[系统繁忙,请稍后再试.]]></return_msg>
          <result_code><![CDATA[FAIL]]></result_code>
          <err_code><![CDATA[268458547]]></err_code>
          <err_code_des><![CDATA[系统繁忙,请稍后再试.]]></err_code_des>
          <mch_billno><![CDATA[0010010404201411170000046542]]></mch_billno>
          <mch_id>10010404</mch_id>
          <wxappid><![CDATA[wx6fa7e3bab7e15415]]></wxappid>
          <re_openid><![CDATA[onqOjjmM1tad-3ROpncN-yUfa6uI]]></re_openid>
          <total_amount>1</total_amount>
        </xml>
      EOF

      UserMailer.send_reward_error(doc)

    end

  end
end