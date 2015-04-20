class Users::RegistrationsController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render text: @user.to_json
    else
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

private
  def user_params
    params.require(:user).permit(:email, :encrypted_password, :username) #can add other collum
  end
end
