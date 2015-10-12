class Project < ActiveRecord::Base

  validates :name, :profile, :platform, :desc,
            :requirement, :device,
            # :expired_at
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
  after_save :set_expired_at

  mount_uploader :qr_code, QrCodeUploader

  scope :success,           -> { where(status: 'success') }
  scope :collect_beigning,  -> { order("updated_at desc").where(beginner: true) }

  def to_json_with_tasks
    {
      name: name,
      profile: profile,
      device: device,
      requirement: requirement,
      qr_code: qr_code.try(:url),
      platform: platform,
      desc: desc,
      tasks: self.tasks
    }
  end

  def to_json_to_pm
    {
      id: self.to_params,
      name: name,
      profile: profile,
      device: device,
      demand: demand,
      requirement: requirement,
      qr_code: qr_code.try(:url),
      platform: platform,
      desc: desc,
      contact_name: contact_name,
      phone: phone,
      email: email,
      company: company,
      user_feature: self.user_feature,
      tasks: self.tasks
    }
  end

  def to_json_for_index
    {
      id: self.to_params,
      name: name,
      status: get_status,
      demand: demand,
      expired_at: expired_at
    }
  end

  def get_status

    return status unless status == 'underway'

    num = self.assignments.done.try(:size)
    if !expired? && num < demand
      self.update_column(:status, 'failed')
    elsif num >= demand
      self.update_column(:status, 'finish')
    end
    status
  end

  def expired?
    expired_at.to_i > Time.now.to_i
  end

  def prepare_assign
    StartAssignJob.perform_later(id) if status == 'success' &&
                                        expired? && is_beigner?
  end

  def is_beigner?
    !beginner
  end

  def set_expired_at
    if beginner
      update_column(:expired_at, Time.now + 100.years)
    elsif beginner_was && !beginner
      update_column(:expired_at, DateTime.new(2015,3,2))
    end
  end

  def auto_update_status
    self.update_column(:status, 'wait_check') if status_was == 'not_accept'
    if status == 'wait_check' && status_was != 'wait_check'
      AutoUpdateProjectJob.set(wait: (1.day / 2)).perform_later(id)
    end
  end

end
