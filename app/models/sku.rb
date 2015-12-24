class Sku < ActiveRecord::Base

  include SkuVartualAttr


  belongs_to :good
  has_many   :orders

  scope :can_sell,  -> { where('num > ?', 0) }

  validates :good_id, presence: true

  include ::Callbacks::Sku

end
