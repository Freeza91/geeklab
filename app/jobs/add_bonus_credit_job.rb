class AddBonusCreditJob < ActiveJob::Base
  queue_as :add_bonus_credit

  def perform(assignment_id, tester_id)
    assignment = Assignment.where(id: assignment_id).first
    if assignment && tester = assignment.tester

      record = CreditRecord.where(assignment_id: assignment_id, tester_id: tester_id).first
      unless record
        project = assignment_id.project
        rating = assignment.rating_from_admin || 5
        basic_bonus = project.basic_bonus || 0
        bonus = rating * basic_bonus
        origin_credis = tester.credits || 0

        record = CreditRecord.new(tester_id: tester.id,
                                  project_id: project.id,
                                  assignment_id: assignment_id,
                                  credits: project.credit || 0,
                                  bonus_credits: basic_bonus,
                                  used: true,
                                  rating_type: 'admin',
                                  rating: rating)

        record.save && tester.update_column(credits: bonus + origin_credis)
      end
    end

  end
end
