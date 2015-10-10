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

  before_save { self.email = email.to_s.downcase }

end