require 'active_support/concern'

module GrabAssignments
  extend ActiveSupport::Concern

  included do
    before_action :require_access, only: [:got_it, :subscribe, :unsubscribe]
  end

  def got_it
    json = { status: 0, code: 1, msg: '成功抢到' }

    if @project.available? && @assignment.status == 'new'
      $redis.decr("available-#{@project.id}")
      set_assignment
    else
      json[:code], json[:msg] = 2, '被抢光或者任务结束'
    end

    render json: json
  end

  def subscribe
    json = { status: 0, code: 1, msg: '订阅成功' }

    if @project.available?
      unless $redis.sadd("subscribe-#{@assignment.project_id}", current_user.id)
        json[:code], json[:msg] = 2, '已经订阅了！'
      end
    else
      json[:code], json[:msg] = 3, '任务已经结束'
    end

    render json: json
  end

  def unsubscribe
    json = { status: 0, code: 1, msg: '取消订阅成功' }

    unless $redis.srem("subscribe-#{@assignment.project_id}", current_user.id)
      json[:code], json[:msg] = 2, '已经取消订阅了！'
    end

    render json: json
  end


private

  def set_assignment # 标记抢到 && 设置过期时间
    @t = Time.now + @project.duration || 84600
    @assignment.update_columns(flag: true, expired_at: @t)
  end

  def require_access
    @assignment = Assignment.find_by(id: params[:id])
    unless @assignment && @assignment.tester_id == current_user.id
      return render json: {
        code: 0,
        msg: '项目为空',
        status: 0
      }
    end
    @project = @assignment.project
  end

end
