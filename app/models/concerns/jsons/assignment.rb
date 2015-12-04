require 'active_support/concern'

module JSONS

  module Assignment
    extend ActiveSupport::Concern

    def to_json_for_index
      {
        id: self.to_params,
        name: project.name,
        type: type,
        profile: project.profile,
        credit: project.credit,
        bonus: project.basic_bonus,
        beginner: project.beginner,
        available_count: project.available,
        available: project.available?,
        subscribe: subscribe?
      }
    end

    def to_json_for_ing
      {
        id: self.to_params,
        name: project.name,
        type: type,
        profile: project.profile,
        status: status,
        extra_status: extra_status,
        reasons: reasons,
        video: video,
        credit: project.credit,
        bonus: project.basic_bonus,
        credit_record: credit_record.try(to_json),
        beginner: project.beginner,
        available_count: project.available,
        available: project.available?,
        subscribe: subscribe?
      }
    end

    def to_json_for_done
      {
        id: self.to_params,
        name: project.name,
        type: type,
        profile: project.profile,
        status: status,
        reasons: reasons,
        video: video,
        credit: project.credit,
        bonus: project.basic_bonus,
        credit_record: credit_record.try(to_json),
        beginner: project.beginner,
      }
    end

    def to_json_with_project
      relation_project = self.project
      {
        status: status,
        video: video,
        id: self.to_params,
        name: relation_project.name,
        credit: relation_project.credit,
        bonus: relation_project.basic_bonus,
        available: relation_project.available,
        credit_record: credit_record
      }
    end

    def to_json_for_project_index
      relation_project = self.project
      available_num = relation_project.available? ? relation_project.available : 0
      {
        status: status,
        id: self.to_params,
        name: relation_project.name,
        credit: relation_project.credit,
        available: available_num,
        bonus: relation_project.basic_bonus
      }
    end

  end

end
