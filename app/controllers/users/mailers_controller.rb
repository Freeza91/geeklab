class Users::MailersController < ApplicationController

  def send_confirmation
    json = { status: 0, code: 1, email: '' }
    email = params[:email].to_s.downcase
    code = generate_code
    $redis.set(email, code)
    $redis.expire(email, 1800) # set 30 mintues
    UserMailer.welcome(email, code).deliver_later
    json[:email] = email_target(email)
    render json: json
  end

  def send_reset_password
    json = {msg: '', code: 1, status: 0 }

    email = params[:email].to_s.downcase
    user = User.find_by(email: email) || current_user
    if user
      user.generate_reset_password_token
      user.save(validate: false)

      url = if Rails.env.production?
              "#{Settings.domain}/users/passwords/callback_reset"
            else Rails.env.development? || Rails.env.test?
              "http://localhost:3000/users/passwords/callback_reset"
            end
      url += "?reset_password_token=#{user.reset_password_token}"
      UserMailer.reset_password(user.id, url).deliver_later
      json[:msg] = email_target email

      render json: json
    else
      json[:code] = 0
      json[:msg] = '邮箱不存在，请注册后在重置'

      render json: json
    end
  end

private

  def generate_code
    p (('a'..'z').to_a + ('0'..'9').to_a).shuffle[1..6].join
  end

end
