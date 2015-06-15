class Project < ActiveRecord::Base

  validates :name, :profile, :platform, :desc,
            :requirement, :device,
            # :expired_at
            :contact_name, :phone, :email, :company,
            presence: true

  validates_presence_of :qr_code, :if => Proc.new { |qr| not device == 'web' }

  has_many :assignments,   inverse_of: :project
  has_many :tasks,         inverse_of: :project
  has_one  :user_feature,  inverse_of: :project
  belongs_to :pm

  accepts_nested_attributes_for :tasks, allow_destroy: true
  accepts_nested_attributes_for :user_feature, allow_destroy: true

  before_save { self.email = email.to_s.downcase }
  before_update :prepare_assign

  mount_uploader :qr_code, QrCodeUploader

  def to_json_with_tasks
    {
      name: name,
      profile: profile,
      device: device,
      requirement: requirement,
      qr_code: qr_code,
      platform: platform,
      desc: desc,
      tasks: self.tasks
    }
  end

  def prepare_assign
    StartAssignJob.perform_later(id) if approved && id != Project.first.id
  end

end
