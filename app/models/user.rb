class User < ActiveRecord::Base
  include Authenticatable
  include DatabaseAuthenticatable
  include Validatable
  include Rememberable
  include Recoverable
  include Mobileable

  def to_tester
    @tester ||= Tester.find_by(id: id)
  end

  def to_pm
    @pm ||= Pm.find_by(id: id)
  end

  has_many :orders

  after_update :deliver_approved_email
  before_save { self.email = email.to_s.downcase }

  def deliver_approved_email
    task_url = "#{Settings.domain}/testers/#{id}/assignments"
    title = "你已经通过审核，正是成为一个测试用户"
    UserMailer.novice_task_approved(email, title, task_url).deliver_later if approved && !approved_was
  end

end