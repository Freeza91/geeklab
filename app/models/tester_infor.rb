class TesterInfor < ActiveRecord::Base

  validates :tester_id, :username, :sex, :birthday,
            :birthplace, :livingplace, :device,
            :emotional_status, :sex_orientation,
            :eduction, :profession, :income,
            :personality, :interest, :email_contract,
            :mobile_phone,
            presence: true

  belongs_to :tester
end