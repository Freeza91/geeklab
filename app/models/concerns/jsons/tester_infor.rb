require 'active_support/concern'

module Jsons

  module TesterInfor
    extend ActiveSupport::Concern

    def to_json
      if try(:already_finish)
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

end
