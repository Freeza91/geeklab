class AddBonusCreditJob < ActiveJob::Base
  queue_as :add_bonus_credit

  def perform(record_id)
    record = CreditRecord.where(id: record_id).first

    if record && !record.used
      tester = record.tester
      assignment = record.assignment
      rating = record.rating || 5
      bonus_credits = record.bonus_credits || 0
      num = bonus_credits * rating

      origin_credis = tester.credits || 0
      tester.update_column(credits: num + origin_credis)
      record.update_column(used: true)
    end
  end
end
