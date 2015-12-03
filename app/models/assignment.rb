class Assignment < ActiveRecord::Base

  scope :test,         -> { where("assignments.status = ?", 'test') } # 新手测试任务
  scope :not_take_part,-> { where("assignments.status = ?",  "new") }
  scope :assigned,     -> { where(flag: true) }
  scope :not_assigned, -> { where(flag: false) }
  scope :finish,       -> { joins(:project).where("projects.status = ?", 'finish') }
  scope :not_finish,   -> { joins(:project).where("projects.status != ?", 'finish') }
  scope :ing,          -> { where('assignments.status in (?)', ['wait_check', 'checking', 'not_accept']) }
  scope :done,         -> { where("assignments.status = ?", "success") }
  scope :show_pm,      -> { where("public = ?", true) }

  belongs_to :tester,  inverse_of: :assignments
  belongs_to :project, inverse_of: :assignments
  has_one    :comment, dependent: :destroy
  has_many   :feedbacks
  has_one    :credit_record

  accepts_nested_attributes_for :feedbacks, allow_destroy: true

  after_update :video_notice_to_tester
  after_update :auto_update_assignment_status
  after_update :add_credit_to_user

  class << self

    def test_task
      test
    end

    def new_tasks
      not_assigned.not_finish
    end

    def finish_project
      not_assigned.finish
    end

    def take_part_ing
      test #测试用数据
      #assigned.not_finish #真实数据逻辑
      # assigned.not_expired.ing + assigned.not_finish.expired
    end

    def finish_task
      assigned.finish + done
    end

  end

  def expired?
    Time.now >= expired_at
  end

  def subscribe?
    $redis.smembers("subscribe-#{project_id}").include?(tester_id)
  end

  def can_do?
    assigned && !expired?
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
    if expired?
      if project.available?
        extra_status = 'can_get'
      else
        extra_status ='can_subscribe'
      end
    else
      extra_status = 'normal'
    end
  end

  def to_json_for_index
    {
      id: self.to_params,
      name: project.name,
      type: type,
      profile: project.profile,
      credit: project.credit,
      bonus: project.basic_bonus,
      beginner: project.beginner,
      available_count: project.available,
      available: project.available?,
      subscribe: subscribe?
    }
  end

  def to_json_for_join
    if credit_record
      cur_credit_record = {
        bonus_credits: credit_record.bonus_credits,
        rating: credit_record.rating
      }
    else
      cur_credit_record = credit_record
    end

    {
      id: self.to_params,
      name: project.name,
      type: type,
      profile: project.profile,
      status: status,
      extra_status: extra_status,
      credit: project.credit,
      bonus: project.basic_bonus,
      credit_record: cur_credit_record,
      beginner: project.beginner,
      available_count: project.available,
      available: project.available?,
      subscribe: subscribe?
    }
  end

  def to_json_with_project
    relation_project = self.project
    {
      status: status,
      video: video,
      id: self.to_params,
      name: relation_project.name,
      credit: relation_project.credit,
      bonus: relation_project.basic_bonus,
      available: relation_project.available,
      credit_record: credit_record
    }
  end

  def to_json_for_project_index
    relation_project = self.project
    available_num = relation_project.available? ? relation_project.available : 0
    {
      status: status,
      id: self.to_params,
      name: relation_project.name,
      credit: relation_project.credit,
      available: available_num,
      bonus: relation_project.basic_bonus
    }
  end

  def video_notice_to_tester
    if (status == 'not_accept' && status_was != 'not_accept') ||
       (status_was != 'success' && status == "success")
      hash_tester_id = self.to_params(tester_id)
      task_url = "#{Settings.domain}/assignments/join"
      name = self.project.name
      tester_infor = self.tester.try(:tester_infor)

      email_to =
        if tester_infor && tester_infor.email_contract.present?
          tester_infor.email_contract
        else
          tester.email
        end

      UserMailer.video_check_failed(email_to, name, task_url + "#ing").deliver_later if status == "not_accept"
      UserMailer.video_check_success(email_to, name, task_url + "#done").deliver_later if status == "success"

      # 让时间暂停结束
      # 重新设置过期时间
      if stop_time
        new_expired_at = Time.now - stop_time_at + expired_at
        update_columns(stop_time: false, expired_at: new_expired_at)
        NotitySubscribeJob.set(wait_until: (new_expired_at + 3.minutes)).perform_later(id)
      end

    end
  end

  def auto_update_assignment_status
    if status == 'new' || status == 'test'
      AutoUpdateAssignmentJob.set(wait: (1.day / 2)).perform_later(id)
    end
  end

  def add_credit_to_user
    if status == "success" && status_was != "success"
      tester = self.tester
      if tester
        record = CreditRecord.where(assignment_id: id,
                                    tester_id: tester.id).first
        unless record
          project = self.project
          record = CreditRecord.new(tester_id: tester.id,
                                    project_id: project.id,
                                    assignment_id: id,
                                    credits: project.credit || 0,
                                    bonus_credits: project.basic_bonus || 0)

          if project.beginner # 新手任务
              record.rating_type = 'new'
              record.used = true
              credits = tester.credits || 0
              project_credit = project.credit || 0
              credits += project_credit

              record.save && tester.update_column(:credits, credits)
          else # 不是新手任务

            # 基础分累加
            credits = tester.credits || 0
            project_credit = project.credit || 0
            credits += project_credit

            if rating_from_pm #项目经理有评分
              record.rating = rating_from_pm.to_i
              record.rating_type = 'pm'
              record.used = true

              bonus_credits = rating_from_pm * project.basic_bonus

              record.save && tester.update_column(:credits, credits + bonus_credits)
            else
              # 累加基础分
              tester.update_column(:credits, credits)
              # 设置过期自动评分
              AddBonusCreditJob.set(wait_until: expired_at || Time.now).perform_later(id, tester.id)
            end
          end
        end
      else
        "没有找到用户"
      end
    end
  end
end
