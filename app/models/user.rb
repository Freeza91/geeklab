class User < ActiveRecord::Base
  include Authenticatable
  include DatabaseAuthenticatable
  include Validatable
  include Rememberable
  include Recoverable
  include Mobileable

  def to_tester
    Tester.find_by(id: id)
  end

  def to_pm
    Pm.find_by(id: id)
  end

  after_update :deliver_approved_email

  def deliver_approved_email
    UserMailer.novice_task_approved(email).deliver_later if approved
  end

end