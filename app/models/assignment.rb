class Assignment < ActiveRecord::Base

  scope :all_task,      -> { where.not(status: "delete") }
  scope :wait_upload,   -> { where(status: "wait_upload") }
  scope :wait_check,    -> { where(status: "wait_check") }
  scope :checking,      -> { where(status: "checking") }
  scope :success,       -> { where(status: "success") }
  scope :failed,        -> { where(status: "failed") }

  belongs_to :tester
end
