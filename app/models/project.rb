class Project < ActiveRecord::Base

  validates :name, :profile, :platform, :desc,
            :requirement, :device,
            :contact_name, :phone, :email, :company,
            presence: true

  validates_presence_of :qr_code, :if => Proc.new { |qr| not device == 'web' }

  scope :show, -> { where.not(status: 'delete') }

  has_many :assignments,   inverse_of: :project
  has_many :tasks,         inverse_of: :project, dependent: :destroy
  has_one  :user_feature,  inverse_of: :project, dependent: :destroy
  belongs_to :pm
  has_many :credit_records, inverse_of: :project

  accepts_nested_attributes_for :tasks, allow_destroy: true
  accepts_nested_attributes_for :user_feature, allow_destroy: true, update_only: true

  before_save { self.email = email.to_s.downcase }
  after_update :prepare_assign
  after_save :auto_update_status

  mount_uploader :qr_code, QrCodeUploader

  scope :success,           -> { where(status: 'success') }
  scope :collect_beigning,  -> { order("updated_at desc").where(beginner: true) }

  include JSONS::Project

  def available
    value = $redis.get("available-#{id}")
    unless value
      value = demand - self.assignments.done.show_pm.try(:size).to_i
      value > 0 ? value : 0
      $redis.set("available-#{id}", value)
    end

    value.to_i
  end

  def available?
    return false if get_status == 'finish'
    available > 0 ? true : false
  end

  def get_status

    return status unless status == 'underway' # 审核流程：success -> underway(进行中)

    num = self.assignments.done.show_pm.try(:size)
    if num >= demand
      self.update_column(:status, 'finish')
    end

    status
  end

  def prepare_assign
    StartAssignJob.perform_later(id) if status == 'success' &&
                                        status_was != 'success' &&
                                        is_beigner?
  end

  def is_beigner?
    !beginner
  end

  def auto_update_status
    if status == 'wait_check' && status_was != 'wait_check'
      AutoUpdateProjectJob.set(wait: (1.day / 2)).perform_later(id)
    end
  end

end
