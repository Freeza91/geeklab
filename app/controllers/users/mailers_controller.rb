class Users::MailersController < ApplicationController

  def send_confirmation
    email = params[:email]
    code = generate_code
    $redis.set(email, code)
    $redis.expire(email, 1800) # set 30 mintues
    UserMailer.welcome(email, code).deliver_later

    render template: "/users/registrations/code"
  end

  def send_reset_password
    json = {msg: '', code: 1, status: 0 }

    email = params[:email]
    user = User.find_by(email: email) || current_user
    if user
      user.generate_reset_password_token
      user.save(validate: false)

      url = if Rails.env.production?
              'http://50.116.16.150/users/passwords/callback_reset'
            else Rails.env.development? || Rails.env.test?
              'http://localhost:3000/users/passwords/callback_reset'
            end
      url += "?reset_password_token=#{user.reset_password_token}"
      UserMailer.reset_password(user, url).deliver_later
      json[:msg] = email_target email

      render json: json
    else
      json[:code] = 0
      json[:msg] = '邮箱不存在，请注册后在重置'

      render json: json
    end
  end

  def send_novice_task
    json = { status: 0, code: 0 }
    if current_user
      tester_infor = current_user.to_tester.tester_infors.last
      UserMailer.novice_task(tester_infor.try(:email_contract) || current_user.email).deliver_later
      json[:code] = 1
    end

    render json: json
  end

private

  def generate_code
    p (('a'..'z').to_a + ('0'..'9').to_a).shuffle[1..6].join
  end

  def email_target(email)
    _, domain = email.match(/\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i).captures
    domains = %w(qq.com 163.com 126.com sohu.com sina.com gmail.com 21cn.com)
    if domains.include? domain
      "http://mail.#{domain}/"
    else
      ""
    end
  end
end
