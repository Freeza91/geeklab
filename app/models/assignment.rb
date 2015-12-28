class Assignment < ActiveRecord::Base

  scope :new_assign,   -> { where("assignments.created_at > ?", Time.new(2015, 12, 20))}
  scope :test,         -> { where("assignments.status = ?", 'test') } # 新手测试任务
  scope :not_take_part,-> { where("assignments.status = ?",  "new") }
  scope :not_delete,   -> { where.not(status: 'delete') }
  scope :assigned,     -> { where(flag: true) }
  scope :not_assigned, -> { where(flag: false) }
  scope :finish,       -> { joins(:project).where("projects.status = ?", 'finish') }
  scope :not_finish,   -> { joins(:project).where("projects.status != ?", 'finish') }
  scope :ing,          -> { where('assignments.status in (?)', ['wait_check', 'checking', 'not_accept']) }
  scope :done,         -> { where("assignments.status = ?", "success") }
  scope :not_done,     -> { where("assignments.status != ?", "success") }
  scope :show_pm,      -> { where("public = ?", true) }

  belongs_to :tester,  inverse_of: :assignments
  belongs_to :project, inverse_of: :assignments
  has_one    :comment, dependent: :destroy
  has_many   :feedbacks
  has_one    :credit_record

  accepts_nested_attributes_for :feedbacks, allow_destroy: true

  include ::Jsons::Assignment
  include ::Callbacks::Assignment

  class << self

    def test_task
      test # 新手测试任务
    end

    def new_tasks
      new_assign.not_assigned.not_finish
    end

    def finish_project
      not_assigned.finish.not_delete # 没有抢到但是任务已经结束
    end

    def take_part_ing
      assigned.not_finish.not_done.not_delete
    end

    def finish_task
      assigned.finish.not_delete + done
    end

  end

  def expired?
    Time.now >= expired_at && !stop_time
  end

  def expired_upload?
    return stop_time_at >= expired_at if stop_time
    false
  end

  def subscribe?
    $redis.smembers("subscribe-#{project_id}").include?(tester_id.to_s)
  end

  def can_do?
    flag && !expired?
  end

  def type
    type = ''
    if(project.device == 'web')
      type = 'web'
    else
      type = 'mobile'
    end
  end

  def extra_status
    extra_status = ''

    if project.beginner || status != 'new' || !expired?
      extra_status = 'normal'
    else
      if project.available?
        extra_status = 'can_get'
      else
        extra_status = 'can_subscribe'
      end
    end
  end

  def expired_time
    if stop_time
      return (expired_at - stop_time_at).to_i;
    end
    (expired_at - Time.now).to_i
  end

end
