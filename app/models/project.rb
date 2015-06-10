class Project < ActiveRecord::Base
  validates :name, :profile, :platform, :desc, :expired_at,
            #:requirement, :device, :qr_code,
            :contact_name, :phone, :email, :company,
            presence: true

  has_many :assignments,  inverse_of: :project
  has_many :tasks,        inverse_of: :project
  has_one  :user_feature

  accepts_nested_attributes_for :tasks, allow_destroy: true
  accepts_nested_attributes_for :user_feature, allow_destroy: true

  before_save { self.email = email.to_s.downcase }

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
end
