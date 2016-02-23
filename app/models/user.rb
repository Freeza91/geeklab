class User < ActiveRecord::Base
  include Authenticatable
  include DatabaseAuthenticatable
  include Validatable
  include Rememberable
  include Recoverable
  include Mobileable

  scope :order_by_created, -> { order('created_at desc') }
  scope :during_time, ->(start_at, end_at) { where('created_at >= ? and created_at <= ?', start_at, end_at) }

  has_one :id_card
  has_many :reward_records
  has_many :integral_records

  def to_tester
    @tester ||= Tester.find_by(id: self.to_params)
  end

  def to_pm
    @pm ||= Pm.find_by(id: self.to_params)
  end

  has_many :orders,   dependent: :destroy
  has_many :addresses,dependent: :destroy

  before_save { self.email = email.to_s.downcase }

end