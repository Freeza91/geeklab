class Users::MailersController < ApplicationController

  def send_confirmation
    email = params[:email]
    code = generate_code
    $redis.set(email, code)
    $redis.expire(email, 3000) # set 10 mintues
    UserMailer.welcome(email, code).deliver_later

    render template: "/users/registrations/code"
  end

  def send_reset_password
    json = {msg: '修改密码邮件已经发送', code: 1, status: 0 }

    email = params[:email]
    user = User.find_by(email: email) || current_user
    if user
      user.generate_reset_password_token
      user.save(validate: false)

      url = 'http://localhost:3000/users/passwords/callback_reset'
      url += "?reset_password_token=#{user.reset_password_token}"

      UserMailer.reset_password(user, url).deliver_later

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
