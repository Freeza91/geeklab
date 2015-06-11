class Assignment < ActiveRecord::Base

  scope :expired,      -> { joins(:project).where("projects.expired_at < ?", Time.now - 1.minutes) }
  scope :not_expired,  -> { joins(:project).where("projects.expired_at > ?", Time.now + 1.minutes) }
  scope :not_view,     -> (last_view){ joins(:project).where("projects.expired_at > ?", last_view) }

  scope :test,         -> { where(status: 'test') }
  scope :not_take_part,-> { where(status: "new") }
  scope :ing,          -> { where('status in (?)', ['wait_check', 'checking', 'not_accept', 'delete']) }
  scope :done,         -> { where(status: "success") }

  belongs_to :tester,  inverse_of: :assignments
  belongs_to :project, inverse_of: :assignments

  after_update :video_notice_to_tester
  after_commit :auto_update_assignment_status

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

    def not_view_num(last_view_time)
      expired.not_take_part.not_view(last_view_time).size
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


  def video_notice_to_tester
    if status == 'not_accept' || status == "success"
      task_url = "#{Settings.domain}/testers/#{tester_id}/assignments/join"
      name = self.project.name
      email_to = self.tester.tester_infors.first.email_contract || email
      UserMailer.video_check_failed(email_to, name, task_url + "#ing").deliver_later if status == "not_accept"
      UserMailer.video_check_success(email_to, name, task_url + "#done").deliver_later if status == "success"
    end
  end

  def auto_update_assignment_status
    if status == 'new' || status == 'test'
      AutoUpdateAssignmentJob.set(wait: (1.day / 2)).perform_later(id)
    end
  end
end
