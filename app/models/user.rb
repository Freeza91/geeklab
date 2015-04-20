class User < ActiveRecord::Base
  include Authenticatable
  include DatabaseAuthenticatable
  include Validatable
  include Rememberable
  include Confirmable


end
