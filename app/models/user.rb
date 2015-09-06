class User < ActiveRecord::Base
  include Authenticatable
  include DatabaseAuthenticatable
  include Validatable
  include Rememberable
  include Recoverable
  include Mobileable

  def to_tester
    @tester ||= Tester.find_by(id: self.to_params)
  end

  def to_pm
    @pm ||= Pm.find_by(id: self.to_params)
  end

  has_many :orders,   dependent: :destroy
  has_many :addresses,dependent: :destroy

  after_update :deliver_approved_email
  before_save { self.email = email.to_s.downcase }

  def deliver_approved_email
    task_url = "#{Settings.domain}/assignments"
    title = "你已经通过审核，正是成为一个测试用户"
    if approved && !approved_was
      update_column(:approved_time, Time.now)
      UserMailer.novice_task_approved(email, title, task_url).deliver_later
    end
  end

end