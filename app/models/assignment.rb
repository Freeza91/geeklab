class Assignment < ActiveRecord::Base

  scope :expired,      -> { joins(:project).where("projects.expired_at < ?", Time.now - 1.minutes) }
  scope :not_expired,  -> { joins(:project).where("projects.expired_at > ?", Time.now + 1.minutes) }
  scope :not_view,     -> (last_view){ joins(:project).where("projects.expired_at > ?", last_view) }

  scope :not_take_part,-> { where(status: "new") }
  scope :ing,          -> { where('status in (?)', ['wait_check', 'checking', 'not_accept']) }
  scope :done,         -> { where(status: "success") }

  belongs_to :tester
  belongs_to :project

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

  end
end
