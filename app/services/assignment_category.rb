module AssignmentCategory
  class << self

    def assignment_to_tester(project_id)
      project = Project.find_by(id: $hashids.encode(project_id))
      return unless project
      @user_feature = project.user_feature

      TesterInfor.find_each(batch_size: 100) do |infor|
        # select tester
        if select_tester(infor, get_device(project.platform, project.device))
          # send assignment
          tester = infor.tester
          if tester.assignments.map(&:project_id).include?(project_id) ||
             tester.approved_time < project.assign_time
            # 之前已经有被分发 || 没在设定的测试分发之间之内
            next
          end

          Assignment.create(tester_id: infor.tester_id, project_id: project.id, status: 'new')
          # deliver email to tester
          task_url = "#{Settings.domain}/assignments"
          mail_to = infor.tyr(:email_contract) || infor.tester.email
          UserMailer.new_task_notice(mail_to, project.name, task_url).deliver_later
        end
      end
    end

    def select_tester(infor, device)
      begin
        #处理部分用户删除个人信息
        return false unless infor && infor.tester
        # 成为正式的测试用户
        return false unless infor.tester.approved

        # 硬性条件
        return false if device != "web" && !infor.device.include?(device)        #设备限制
        return false unless infor.age.between?(@user_feature.age_low, @user_feature.age_high) #年龄限制
        return false unless @user_feature.sex.include?(infor.sex) # 性别限制
        return false unless @user_feature.city_level.include?(infor.city_level) #城市级别限制
        return false unless @user_feature.education.include?(infor.education) #学历限制
        return false unless @user_feature.sex_orientation.include?(infor.sex_orientation) #性取向限制
        # 符合条件之一即可
        return false if (@user_feature.income_arr & infor.income_arr).size.zero? #收入限制

        # 如果@user_feature.interest 是空的话，无限制
        return true  if @user_feature.interest.size.zero?
        return false if (@user_feature.interest & infor.interest).size.zero?     #兴趣限制
      rescue => e
        return false
      end

      true
    end

    def get_device(platform, device)
      # web 测试的设备要求是什么? 暂定无设备要求
      platform = platform.downcase
      device = device.downcase

      if platform == "ios"
        return "iPhone" if device.include?"phone"
        return "iPad" if device.include?"pad"
      elsif platform == 'android'
        return "Android Phone" if device.include?"phone"
        return "Android Pad" if  device.include?"pad"
      else
        "web"
      end
    end

  end
end