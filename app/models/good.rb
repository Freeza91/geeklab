class Good < ActiveRecord::Base

  default_scope { order('created_at desc') }

  has_many :orders
  has_many :pictures, as: :pictureable
  has_many :skus, dependent: :destroy

  validates :name, :stock, :cost, :label, :describle, :status, presence: true

  scope :publish, -> { where(is_publish: true ) }
  scope :display, -> { publish.where.not(status: 'off_shelves') }


  accepts_nested_attributes_for :pictures, allow_destroy: true

  attr_reader :available

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
    return true if label == '充值卡'
    false
  end

  def to_json_with_pictures
    {
      id: self.to_params,
      name: name,
      cost: cost,
      pictures: self.pictures.collect {|picture| picture.url.try(:url) }
    }
  end

end
