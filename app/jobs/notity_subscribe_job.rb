class NotitySubscribeJob < ActiveJob::Base
  queue_as :notity_subscribe

  def perform(assignment_id)
    assignment = Assignment.where(id: assignment_id).first

    if assignment.expired? # 过期
      # 检测是否任务结束
      project = assignment.project
      if project.available? # 可以继续做，重新可以抢
        assignment.update_column(:status, 'new') # 新任务重新可以抢
        $redis.incr("available-#{project.id}")   # 总量增加
        send_notity_email(project.id, assignment)
      else # 任务已经结束
        free_redis_data(project.id)
      end
    end

  end

  def send_notity_email(project_id)
    users = $redis.smembers("subscribe-#{project_id}")
    if users.present?
      users.each do |u_id|

        next if $redis.get("notify-#{u_id}") # 如果已经通知过则直接跳过

        u = User.where(id: u_id).first
        tester = u.to_tester

        email =
          if info = tester.tester_info && info.email_contract.present?
            info.email_contract
          else
            u.email
          end

        task_url =
          if assignment.assigned # 已经抢到
            "#{Settings.domain}/assignments/join"
          else
            "#{Settings.domain}/assignments"
          end

        UserMailer.subscribe_notify(email, "现在有可以做的任务啦", task_url).deliver_later

        $redis.set "notify-#{u_id}", true
        $redis.expire "notify-#{u_id}", 180

      end
    end
  end

  def free_redis_data(project_id)
    $redis.del("available-#{project_id}") # 删除总量标记
    $redis.del("subscribe-#{project_id}") # 删除订阅标记
  end

end
