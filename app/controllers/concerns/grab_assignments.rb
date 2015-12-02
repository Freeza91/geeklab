require 'active_support/concern'

module QiniuAbout
  extend ActiveSupport::Concern

  included do
    before_action :require_access, only: [:got_it, :subscribe, :unsubscribe]
  end

  def got_it
    json = { status: 0, code: 1, msg: '成功抢到' }

    @project = @assignment.project
    if @project.available? && @assignment.status == 'new'
      set_assignment
      NotitySubscribe.set(wait_until: @t).perform_later(@assignment.id)
    else
      json[:code], json[:msg] = -1, '已经被抢光'
    end

    render json: json
  end

  def subscribe
    json = { status: 0, code: 1, msg: '订阅成功' }
  end

  def unsubscribe
    json = { status: 0, code: 1, msg: '取消订阅成功' }
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
  end

end