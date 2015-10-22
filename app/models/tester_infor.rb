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

  def to_json
    if sex
      time = birthday.to_datetime
      {
        name: username,
        birthday: [time.year, time.month, time.day],
        livingplace: livingplace.split('-'),
        birthplace: birthplace.split('-'),
        device: device,
        sex: sex,
        orientation: sex_orientation,
        emotion: emotional_status,
        education: education,
        profession: profession.split('-'),
        income: income,
        personality: personality,
        interest: interest,
        email: email_contract,
        cellphone: mobile_phone,
      }
    else
      {
        device: device
      }
    end
  end
end
