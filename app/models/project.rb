class Project < ActiveRecord::Base
  validates :name, :profile, :platform, :desc, :expired_at,
            #:requirement, :device, :qr_code,
            :contact_name, :phone, :email, :company,
            presence: true

  has_many :assignments,  inverse_of: :project
  has_many :tasks,        inverse_of: :project

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
