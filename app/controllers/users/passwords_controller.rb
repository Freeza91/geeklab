class Users::PasswordsController < ApplicationController
  def edit
    @user = User.find_by(email: 'useyes91@gmail.com')
    # 123456
  end

  def update
    @user = User.find_by(email: 'useyes91@gmail.com')
    if @user && @user.update_password(params[:old_password], params[:new_password])
      render text: @user.to_json
    else
      render text: '旧密码不正确'
    end
  end
end
