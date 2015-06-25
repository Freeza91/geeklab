class Project < ActiveRecord::Base

  validates :name, :profile, :platform, :desc,
            :requirement, :device,
            # :expired_at
            :contact_name, :phone, :email, :company,
            presence: true

  validates_presence_of :qr_code, :if => Proc.new { |qr| not device == 'web' }

  scope :show, -> { where.not(status: 'delete') }

  has_many :assignments,   inverse_of: :project
  has_many :tasks,         inverse_of: :project
  has_one  :user_feature,  inverse_of: :project
  belongs_to :pm

  accepts_nested_attributes_for :tasks, allow_destroy: true
  accepts_nested_attributes_for :user_feature, allow_destroy: true, update_only: true

  before_save { self.email = email.to_s.downcase }
  after_update :prepare_assign
  after_save :auto_update_status

  mount_uploader :qr_code, QrCodeUploader

  scope :success, -> { where(status: 'success') }

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
      id: id,
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
      id: id,
      name: name,
      status: status,
      demand: demand,
      expired_at: expired_at
    }
  end

  def prepare_assign
    StartAssignJob.perform_later(id) if status == 'success' &&
                                        expired_at.to_i > Time.now.to_i &&
                                        id != Project.first.id
  end

  def auto_update_status
     AutoUpdateProjectJob.set(wait: (1.day / 2)).perform_later(id) if status == 'wait_check'
  end

end
