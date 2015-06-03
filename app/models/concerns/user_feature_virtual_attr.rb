module UserFeatureVirtualAttr
  extend ActiveSupport::Concern

  attr_reader :income_arr, :age_low, :age_high

  def income_low
    income.split('-').first.to_i
  end

  def income_high
    income.split('-').last.to_i
  end

  def income_arr
    (income_low..income_high).to_a
  end

  def age_low
    age.split('-').first.to_i
  end

  def age_high
    age.split('-').last.to_i
  end

end