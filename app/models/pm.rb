require 'user.rb'

class Pm < User
  default_scope { where(role: ['pm', 'both']) }
end