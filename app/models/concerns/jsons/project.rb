require 'active_support/concern'

module JSONS

  module Project
    extend ActiveSupport::Concern

    def to_json_for_admin_edit
      {
        id: id,
        credit: credit,
        status: status,
        reasons: reasons || [],
        basic_bonus: basic_bonus,
        beginner: beginner,
        expired_duration: expired_duration,
        rating_duration: rating_duration
      }
    end

    def to_json_with_tasks
      {
        name: name,
        profile: profile,
        device: device,
        requirement: requirement,
        qr_code: qr_code.try(:url),
        platform: platform,
        desc: desc,
        tasks: self.tasks
      }
    end

    def to_json_to_pm
      {
        id: self.to_params,
        name: name,
        profile: profile,
        device: device,
        demand: demand,
        requirement: requirement,
        qr_code: qr_code.try(:url),
        platform: platform,
        desc: desc,
        contact_name: contact_name,
        phone: phone,
        email: email,
        company: company,
        user_feature: self.user_feature,
        tasks: self.tasks
      }
    end

    def to_json_for_index
      {
        id: self.to_params,
        name: name,
        status: get_status,
        profile: profile,
        device: device,
        demand: demand,
        requirement: requirement,
        qr_code: qr_code.try(:url),
        platform: platform,
        desc: desc,
        contact_name: contact_name,
        phone: phone,
        email: email,
        company: company,
        user_feature: self.user_feature,
        tasks: self.tasks,
        reasons: reasons,
        assignments: self.assignments.done
                         .show_pm.order("updated_at desc")
                         .limit(demand)
                         .map{|a| {id: a.to_params, video: a.video, is_read: a.is_read}}
      }
    end

  end

end