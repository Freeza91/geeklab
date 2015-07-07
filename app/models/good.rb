class Good < ActiveRecord::Base

  has_many :orders
  has_many :pictures, as: :pictureable
  has_many :skus, dependent: :destroy

  validates :name, :stock, :cost, presence: true

  scope :show, -> { where(is_publish: true).where.not(status: 'off_shelves') }

  accepts_nested_attributes_for :pictures, allow_destroy: true

  attr_accessor :available

  def available
    if num == 0 || is_limit == true
      false
    else
      true
    end
  end

end
