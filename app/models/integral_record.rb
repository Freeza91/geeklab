class IntegralRecord < ActiveRecord::Base

  default_scope -> { order('id desc') }

  validates :cost, :describe, :user_id, presence: true

  belongs_to :assignment
  belongs_to :order
  belongs_to :user

  scope :earing, -> { where(kind_of: ['basic', 'rating']) }
  scope :pay,    -> { where(kind_of: 'order') }

  def income
    return "-#{cost.to_i}" if kind_of == 'order'
    "+#{cost.to_i}"
  end

  def to_json_for_index
    {
      created_at: created_at.strftime('%F %T'),
      type: describe,
      income: income
    }
  end

end
