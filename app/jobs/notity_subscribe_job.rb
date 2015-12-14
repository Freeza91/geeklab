class NotitySubscribeJob < ActiveJob::Base
  queue_as :notity_subscribe

  def perform(assignment_id)

    assignment = Assignment.where(id: assignment_id).first
    return unless assignment # 如果被删除了就不做处理
    project = assignment.project

    unless assignment.status == 'success' # 自己的任务没完成

      if assignment.expired?  # 已经过期
        if project.get_status != 'finish' # 可以继续做，重新可以抢
          send_notity_email(project.id, assignment)
          delete_qiniu_resource(assignment) if assignment.status == 'not_accept' # 任务不成功
          assignment.update_columns(status: 'new', video: '') unless assignment.status == 'delete'  # 只要任务不被删除，新任务重新可以抢
          $redis.incr("available-#{project.id}")   # 总量增加
        end
      else # 还在进行中
        # pass 没有操作
      end

    end

    free_redis_data(project.id) unless project.available? # 任务结束释放

  end

  def send_notity_email(project_id, assignment)
    users = $redis.smembers("subscribe-#{project_id}")
    if users.present?
      users.each do |u_id|

        next if $redis.get("notify-#{u_id}") # 如果已经通知过则直接跳过

        # must be first set
        $redis.set "notify-#{u_id}", true
        $redis.expire "notify-#{u_id}", 180

        tester = Tester.where(id: u_id).first
        info = tester.tester_infor

        email =
          if info.email_contract.present?
            info.email_contract
          else
            tester.email
          end

        name = assignment.project.name

        task_url =
          if assignment.flag # 已经抢到
            "#{Settings.domain}/assignments/join"
          else
            "#{Settings.domain}/assignments"
          end

        UserMailer.subscribe_notify(email, name, task_url).deliver_later

      end
    end
  end

  def free_redis_data(project_id)
    $redis.del("available-#{project_id}") # 删除总量标记
    $redis.del("subscribe-#{project_id}") # 删除订阅标记
  end

  def delete_qiniu_resource(assignment)
    begin
      code, result, response_headers = Qiniu::Storage.delete(
          Settings.qiniu_bucket,
          URI.parse(assignment.video.to_s).path.to_s[1..-1].to_s
      )
      puts '没有找到资源' unless code == 200
    rescue
      puts "网络异常"
    end
  end

end
