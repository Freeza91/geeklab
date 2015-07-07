class Good < ActiveRecord::Base

  has_many :orders
  has_many :pictures, as: :pictureable
  has_many :skus, dependent: :destroy

  validates :name, :stock, :cost, presence: true

  scope :show, -> { where(is_publish: true, is_limit: false).where.not(status: 'off_shelves') }

  accepts_nested_attributes_for :pictures, allow_destroy: true

end
