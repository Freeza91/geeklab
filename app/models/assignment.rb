class Assignment < ActiveRecord::Base

  scope :my_task, -> { joins(:tester).where("users.email = ? and status = ?", 'rudy@geekpark.net', 'hello') }     # testers is not table, this just a example

  # scope :expired,      -> { joins(:project).where("projects.expired_at > ?", Time.now - 10.minutes) }
  # scope :not_expired,  -> { joins(:project).where("projects.expired_at > ?", Time.now - 10.minutes) }

  scope :not_take_part,-> { where(status: "new") }
  scope :ing,  -> { where('status in (?)', ['wait_check', 'checking', 'not_accept']) }
  scope :done, -> { where(status: "success") }

  belongs_to :tester

  class << self

    def take_part_ing
      # not_expired.ing
    end

    def take_part_done
      # not_expired.done + take_part_ing.expired
    end

    def missing
      # expired.not_take_part
    end

    def new_tasks
      # not_expired.not_take_part
    end

    def test
      assignments = User.find(1).to_tester.assignments
      assignments.ing + assignments.done + assignments.not_take_part
    end

  end
end
