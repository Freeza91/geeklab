require 'user.rb'

class Tester < User
  default_scope { where(role: ['tester', 'both']) }

  has_many :tester_infors
end