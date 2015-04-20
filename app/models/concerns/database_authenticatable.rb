require 'active_support/concern'

module DatabaseAuthenticatable
  extend ActiveSupport::Concern

  included do
    before_save :password_digest
  end

  def password_digest(password=nil)
    password = password.blank? ? encrypted_password : password
    self.encrypted_password = BCrypt::Password.create(password)
  end

  def valid_password?(password)
    secure_compare(encrypted_password,
                   BCrypt::Engine.hash_secret(password, password_salt))
  end

  def password_salt
    BCrypt::Password.new(encrypted_password).salt
  end

  def update_password(old_password, new_password)
    return false if new_password.size < 6 or new_password.size > 20
    result = if valid_password?(old_password)
      self.encrypted_password = password_digest(new_password)
      save(validate: false)
    else
      false
    end
    result
  end

end