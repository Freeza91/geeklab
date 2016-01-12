class IntegralRecord < ActiveRecord::Base

  validates :cost, :describe, :user_id, presence: true

  belongs_to :assignment
  belongs_to :order
  belongs_to :user

  scope :earing, -> { where(kind_of: ['basic', 'rating']) }
  scope :pay,    -> { where(kind_of: 'order') }

  def income
    return "-#{cost}" if kind_of == 'order'
    "+#{cost}"
  end

end
