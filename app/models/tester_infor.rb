class TesterInfor < ActiveRecord::Base

  validates :tester_id, :username, :sex, :birthday,
            :birthplace, :livingplace, :device,
            :emotional_status, :sex_orientation,
            :education, :profession, :income,
            :personality, :interest, :email_contract,
            :mobile_phone,
            presence: true

  belongs_to :tester, inverse_of: :tester_infors

  before_save { self.email_contract = email_contract.to_s.downcase }

  include TesterInforVirtualAttr

  def to_json
    time = birthday.to_datetime
    {
      username: username,
      birthday: [time.year, time.month, time.day],
      livingplace: livingplace.split('-'),
      birthplace: birthplace.split('-'),
      device: device,
      sex: sex,
      sex_orientation: sex_orientation,
      emotional_status: emotional_status,
      education: education,
      profession: profession.split('-'),
      income: income,
      personality: personality,
      interest: interest,
      email_contract: email_contract,
      mobile_phone: mobile_phone,
      wechat: wechat,
      ali_pay: ali_pay
    }
  end
end