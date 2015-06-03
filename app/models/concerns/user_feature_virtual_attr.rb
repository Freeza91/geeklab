module UserFeatureVirtualAttr
  extend ActiveSupport::Concern

  attr_accessor :income_low, :income_high

  def income_low
    income.split('-').first
  end

  def income_high
    income.split('-').last
  end

end