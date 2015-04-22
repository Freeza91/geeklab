class Users::RegistrationsController < ApplicationController

  before_action :logined?, only: [:new, :create]
  before_action :require_login?, only: [:edit, :update, :destroy]

  def new
    @user = User.new
  end

  def create
    value = $redis.get(params[:user][:email])
    @user = User.new(user_params)
    if value && value == params[:code]
      if @user.save
        session[:id] = @user.id
        @user.remember_me(cookies)
        render text: @user.to_json
      else
        flash[:info] = '输入信息有误，请重新输入'
        render :new
      end
    else
      flash[:info] = '验证码不正确或者已经过期,请重试'
      render :new
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
    params.require(:user).permit(:email, :encrypted_password, :username) #can add other collum
  end
end
