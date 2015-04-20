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

  def reset_password
    @user = current_user
    unless @user
      redirect_to new_users_session_path
    end
  end

  def update_reset_password
    @user = current_user
    encrypted_password = params[:user][:encrypted_password]
    if encrypted_password.size < 6 or encrypted_password > 20
      render :reset_password
    elsif @user
      @user.password_digest(encrypted_password)
      @user.save(validate: false)
    else
      redirect_to new_users_session_path
    end
  end
end
