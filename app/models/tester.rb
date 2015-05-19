class Tester < User
  default_scope { where(role: ['tester', 'both']) }

  has_many :tester_infors
  has_many :assignments
end
