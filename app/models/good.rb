class Good < ActiveRecord::Base

  default_scope { order('created_at desc') }

  has_many :orders
  has_many :pictures, as: :pictureable, dependent: :destroy
  has_many :skus, dependent: :destroy

  validates :name, :stock, :cost, :label, :describle, :status, presence: true

  scope :publish, -> { where(is_publish: true ) }
  scope :display, -> { publish.where.not(status: 'off_shelves') }


  accepts_nested_attributes_for :pictures, allow_destroy: true
  accepts_nested_attributes_for :skus, allow_destroy: true

  attr_reader :available

  include JSONS::Good

  def available
    if status == "on_sell"
      if stock == 0 || is_limit == true
        false
      else
        true
      end
    else
      true
    end
  end

  def virtual?
    return true if label == '0'
    false
  end

end
