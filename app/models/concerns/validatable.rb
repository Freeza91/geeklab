require 'active_support/concern'

module Validatable
  extend ActiveSupport::Concern

  included do
    validates_uniqueness_of :email, case_sensitive: false, message: "邮箱已经存在"
    validates_format_of :email, with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i,
                        message: '邮箱格式不正确'
    validates :email, presence: {message: '邮箱不能为空'}

    validates_length_of :encrypted_password, within: 6..20,
                        too_short: '密码长度不能低于6位',
                        too_long: '密码长度不要超过20位'

    validates_inclusion_of :role, in: ['tester', 'pm', 'both'],
                           message: '用户角色不正确'

    before_save :email_downcase
  end

  def email_downcase
    self.email = email.downcase
  end

  class_methods do

  end
end