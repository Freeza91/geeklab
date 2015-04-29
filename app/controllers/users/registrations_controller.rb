class Users::RegistrationsController < ApplicationController

  before_action :logined?, only: [:new, :create]
  before_action :require_login?, only: [:edit, :update, :destroy]

  def new
    @user = User.new
  end

  def create
    json = { status: 0, code: 1, msg: [] }

    value = $redis.get(params[:user][:email])
    @user = User.new(user_params)
    if value && value == params[:user][:code]
      if @user.save
        session[:id] = @user.id
        @user.remember_me(cookies)
        render json: json
      else
        json[:code] = 2
        json[:msg] += @user.errors.full_messages.map { |msg| msg.split.last }
        render json: json
      end
    else
      json[:code] = 3
      json[:msg] << '验证码不正确或者已经过期,请重试'
      render json: json
    end

  end

  def edit
    @user = User.find_by(email: '1@qq.com')
  end

  def update
    @user = User.find_by(email: '1@qq.com')
    user_params.map do |key, value|
      @user.update_attribute(key, value)
    end
    render text: @user.to_json
  end

  def destroy
    reset_session
    flash[:info] = '登出成功'
    redirect_to new_users_session_path
  end

private
  def user_params
    params.require(:user).permit(:email, :encrypted_password, :role) #can add other collum
  end
end
