class Tester < User
  default_scope { where(role: ['tester', 'both']) }

  has_many :tester_infors,  inverse_of: :tester
  has_many :assignments,    inverse_of: :tester
end
