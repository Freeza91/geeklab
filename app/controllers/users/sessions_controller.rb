class Users::SessionsController < ApplicationController

  before_action :logined?, only: [:new, :auth]

  def new
    @user = User.new
  end

  def auth
    json = { status: 0, code: 1, msg: '', url: '' }
    email = params[:email]
    @user = User.find_by(email: email)
    if @user && @user.valid_password?(params[:encrypted_password])
      session[:id] = @user.id
      @user.remember_me(cookies) if params[:remember_me] == 'true'
      json[:msg] = '登陆成功'
      json[:url] =
        if @user.role == 'tester'
          new_tester_path
        else
          new_pm_path
        end

      render json: json
    else
      @user = User.new(email: email)
      json[:code] = 0
      json[:msg] = '用户名或密码错误，请重试！'
      render json: json
    end
  end

  def destroy
    reset_session
    current_user.forget(cookies) if current_user
    flash[:info] = '登出成功'
    redirect_to new_users_session_path
  end

end
