class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new
    ability = user.try(:admin)
    if ability == 1
        can :manage, [Address, Assignment, Comment, Good,
                      Order, Picture, Project, Sku, Task,
                      TesterInfor, UserFeature]

        can :read [Pm, Tester]
    else ability == 2
        can :manage, :all
    end

  end
end
