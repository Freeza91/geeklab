 'active_support/concern'

module Callbacks

  module Assignment
    extend ActiveSupport::Concern

    included do
      after_update :video_notice_to_tester
      after_update :auto_update_assignment_status
      after_update :add_credit_to_user
    end

    def video_notice_to_tester
      if (status == 'not_accept' && status_was != 'not_accept') ||
         (status_was != 'success' && status == "success")
        hash_tester_id = self.to_params(tester_id)
        task_url = "#{Settings.domain}/assignments/join"
        name = self.project.name
        tester_infor = self.tester.try(:tester_infor)

        email_to =
          if tester_infor && tester_infor.email_contract.present?
            tester_infor.email_contract
          else
            tester.email
          end

        UserMailer.video_check_failed(email_to, name, task_url + "#ing").deliver_later if status == "not_accept"
        UserMailer.video_check_success(email_to, name, task_url + "#done").deliver_later if status == "success"

        # 让时间暂停结束
        # 重新设置过期时间
        if stop_time
          new_expired_at = expired_at + (Time.now - stop_time_at) # expired_at 必须在前，弱类型的数据类型按照第一个来得到最终的数据类型
          update_columns(stop_time: false, expired_at: new_expired_at)
          NotitySubscribeJob.set(wait_until: new_expired_at).perform_later(id)
        end

      end
    end

    def auto_update_assignment_status
      if status == 'new' || status == 'test'
        AutoUpdateAssignmentJob.set(wait: (1.day / 2)).perform_later(id)
      end
    end

    def add_credit_to_user
      if status == "success" && status_was != "success"
        tester = self.tester
        if tester
          record = CreditRecord.where(assignment_id: id,
                                      tester_id: tester.id).first
          unless record
            project = self.project
            record = CreditRecord.new(tester_id: tester.id,
                                      project_id: project.id,
                                      assignment_id: id,
                                      credits: project.credit || 0,
                                      bonus_credits: project.basic_bonus || 0)

            # 记录积分
            integral_record = IntegralRecord.new(cost: project.credit,
                                                 describe: "#{project.name}审核通过",
                                                 user_id: tester.id,
                                                 assignment_id: id,
                                                 kind_of: 'basic')
            if project.beginner # 新手任务
                record.rating_type = 'new'
                record.used = true
                credits = tester.credits || 0
                project_credit = project.credit || 0
                credits += project_credit



                record.save && integral_record.save && tester.update_column(:credits, credits)
            else # 不是新手任务

              # 基础分累加
              credits = tester.credits || 0
              project_credit = project.credit || 0
              credits += project_credit

              if rating_from_pm #项目经理有评分
                record.rating = rating_from_pm.to_i
                record.rating_type = 'pm'
                record.used = true

                bonus_credits = rating_from_pm * project.basic_bonus

                record.save && integral_record.save && tester.update_column(:credits, credits + bonus_credits)
              else
                # 累加基础分
                tester.update_column(:credits, credits)
                # 设置过期自动评分
                time = Time.now + project.rating_duration * 3600
                AddBonusCreditJob.set(wait_until: time).perform_later(id, tester.id)

                integral_record.save
              end
            end
          end
        else
          "没有找到用户"
        end
      end
    end

  end

end
