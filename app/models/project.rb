class Project < ActiveRecord::Base
  validates :name, :profile, :platform, :desc, :expired_at,
            #:requirement, :device, :qr_code,
            :contact_name, :phone, :email, :company,
            presence: true

  has_many :assignments
end
