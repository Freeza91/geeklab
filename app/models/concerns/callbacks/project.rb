require 'active_support/concern'

module Callbacks

  module Project
    extend ActiveSupport::Concern

    included do
      after_update :prepare_assign
      after_save :auto_update_status
    end

    def prepare_assign
    StartAssignJob.perform_later(id) if status == 'success' &&
                                        status_was != 'success' &&
                                        is_beigner?
    end

    def is_beigner?
      !beginner
    end

    def auto_update_status
      if status == 'wait_check' && status_was != 'wait_check'
        AutoUpdateProjectJob.set(wait: (1.day / 2)).perform_later(id)
      end
    end

  end
end