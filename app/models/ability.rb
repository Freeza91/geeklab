class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new
    ability = user.try(:admin)
    if ability >= 1
        can :manage, :all
    end
  end
end
