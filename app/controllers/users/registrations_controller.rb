class Users::RegistrationsController < ApplicationController

  before_action :logined?, only: [:new, :create]
  before_action :require_login?, only: [:edit, :update]

  def new
    @user = User.new
  end

  def create
    json = { status: 0, code: 1, msg: [], url: ''}
    email = params[:user][:email].to_s.downcase
    if limit_ip?("register:#{email}")
      json[:code], json[:msg] = -1, "休息会在注册吧"
      return render json: json
    end
    value = $redis.get(email) if $redis.exists email
    @user = User.new(user_params)
    if value && value == params[:user][:code]
      if @user.save
        session[:id] = @user.to_params
        @user.remember_me(cookies)

        json[:url] =
          if @user.role == 'tester'
            new_tester_path
          else
            new_pm_path
          end
      else
        json[:code] = 2
        json[:msg] += @user.errors.full_messages.map { |msg| msg.split.last }
      end
    else
      json[:code] = 3
      json[:msg] << '验证码不正确或者已经过期,请重试'
    end

    render json: json
  end

  def edit
  end

  def update
  end

  def is_emails_exist
    json = { code: 1, status: 0, msg: "" }
    email = params[:email].to_s.downcase
    unless User.find_by(email: email)
      json[:code], json[:msg] = 0, "已经注册过了"
    end

    render json: json
  end

private
  def user_params
    params.require(:user).permit(:email, :encrypted_password, :role) #can add other collum
  end
end
