class Assignment < ActiveRecord::Base

  scope :expired,      -> { joins(:project).where("projects.expired_at < ?", Time.now - 1.minutes) }
  scope :not_expired,  -> { joins(:project).where("projects.expired_at > ?", Time.now + 1.minutes) }
  scope :test,         -> { where("assignments.status = ?", 'test') }
  scope :not_take_part,-> { where("assignments.status = ?",  "new") }
  scope :ing,          -> { where('assignments.status in (?)', ['wait_check', 'checking', 'not_accept', 'delete']) }
  scope :done,         -> { where("assignments.status = ?", "success") }

  belongs_to :tester,  inverse_of: :assignments
  belongs_to :project, inverse_of: :assignments
  has_one    :comment, dependent: :destroy

  after_update :video_notice_to_tester
  after_update :auto_update_assignment_status
  after_update :add_credit_to_user

  class << self

    def take_part_ing
      not_expired.ing
    end

    def take_part_done
      not_expired.done + take_part_ing.expired
    end

    def new_tasks
      not_expired.not_take_part
    end

    def missing
      expired.not_take_part
    end

    def test_task
      test
    end

  end

  def to_json_with_project
    {
      status: status,
      video: video,
      id: id,
      project: self.project
    }
  end

  def to_json_for_project_index
    {
      id: id,
      video: video,
      is_read: is_read
    }
  end

  def video_notice_to_tester
    if (status == 'not_accept' && status_was != 'not_accept') ||
       (status_was != 'success' && status == "success")
      hash_tester_id = self.to_params(tester_id)
      task_url = "#{Settings.domain}/assignments/join"
      name = self.project.name
      tester_infor = self.tester.try(:tester_infor)
      return unless tester_infor # user deleted by admin
      email_to = tester_infor.email_contract || email
      UserMailer.video_check_failed(email_to, name, task_url + "#ing").deliver_later if status == "not_accept"
      UserMailer.video_check_success(email_to, name, task_url + "#done").deliver_later if status == "success"
    end
  end

  def auto_update_assignment_status
    if status == 'new' || status == 'test'
      AutoUpdateAssignmentJob.set(wait: (1.day / 2)).perform_later(id)
    end
  end

  def add_credit_to_user
    if status == "success" && status_was != "success"
      hash_tester_id = self.to_params(tester_id)
      tester = Tester.find_by(id: hash_tester_id)
      if tester
        credits = tester.try(:credits) + self.project.credit.to_i
        tester.update_column(:credits, credits)
      else
        "已经添加过积分了！"
      end
    end
  end
end
