class Tester < User
  default_scope { where(role: ['tester', 'both']) }

  has_many :tester_infors,  inverse_of: :tester
  has_many :assignments,    inverse_of: :tester

  attr_accessor :credits

  def credits
    self.assignments.done.includes(:project).collect{ |a| a.project.try(:credit).to_i }.inject(:+)
  end
end
