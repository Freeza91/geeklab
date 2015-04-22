class Users::SessionsController < ApplicationController

  before_action :logined?

  def new
    @user = User.new
  end

  def auth
    email = params[:email]
    @user = User.find_by(email: email)
    if @user && @user.valid_password?(params[:encrypted_password])
      session[:id] = @user.id
      @user.remember_me(cookies) if params[:remember_me] == 'true'
      flash.now[:info] = '登录成功'
      render new_users_session_path
    else
      @user = User.new(email: email)
      flash[:info] = '用户名或者密码错误'
      render :new
    end
  end

end
