class Users::SessionsController < ApplicationController
  def new
    @user = User.new
  end

  def auth
    email = params[:user][:email]
    @user = User.find_by(email: email)
    if @user && @user.valid_password?(params[:user][:encrypted_password])
      render text: 'successful'
    else
      @user = User.new(email: email)
      flash[:info] = '用户名或者密码错误'
      render :new
    end
  end

end
