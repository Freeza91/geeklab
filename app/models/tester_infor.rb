class TesterInfor < ActiveRecord::Base

  validates :tester_id, :username, :sex, :birthday,
            :birthplace, :livingplace, :device,
            :emotional_status, :sex_orientation,
            :education, :profession, :income,
            :email_contract,:mobile_phone,
            # :personality, :interest,
            presence: true

  belongs_to :tester, inverse_of: :tester_infor

  before_save { self.email_contract = email_contract.to_s.downcase }

  include TesterInforVirtualAttr
  include ::Jsons::TesterInfor

end
