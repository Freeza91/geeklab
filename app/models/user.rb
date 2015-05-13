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
end