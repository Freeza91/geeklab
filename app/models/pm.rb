class Pm < User
  default_scope { where(role: ['pm', 'both']) }

  has_many :projects, inverse_of: :pm
end
