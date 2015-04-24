class Users::SessionsController < ApplicationController

  before_action :logined?

  def new
    @user = User.new
  end

  def auth
    json = { status: 0, code: 1, msg: '' }
    email = params[:email]
    @user = User.find_by(email: email)
    if @user && @user.valid_password?(params[:encrypted_password])
      session[:id] = @user.id
      @user.remember_me(cookies) if params[:remember_me] == 'true'
      json[:msg] = '登陆成功'
      render json: json
    else
      @user = User.new(email: email)
      json[:code] = 0
      json[:msg] = '用户名或密码错误，请重试！'
      render json: json
    end
  end

end
