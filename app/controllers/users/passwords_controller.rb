class Users::PasswordsController < ApplicationController

  before_action :require_login?, except: [:callback_reset, :reset]

  def edit
    @user = User.find_by(email: 'useyes91@gmail.com')
  end

  def update
    @user = User.find_by(email: 'useyes91@gmail.com')
    if @user && @user.update_password(params[:old_password], params[:new_password])
      render text: @user.to_json
    else
      render text: '旧密码不正确'
    end
  end

  def reset
    if current_user
      current_user.forget_me(cookies)
      reset_session
    end
  end

  def callback_reset
    @user = User.find_by(reset_password_token: params[:reset_password_token])

    if @user
      if @user.reset_password_sent_at + 1.days >= Time.now
        session[:id] = @user.id
        flash.now[:info] = '请重置密码'
        redirect_to edit_reset_users_passwords_path
      else
        flash[:info] = 'token已经过期'
        redirect_to reset_users_passwords_path
      end
    else
      redirect_to new_users_session_path
    end
  end

  def edit_reset
    @user = current_user
  end

  def update_reset
    @user = current_user
    encrypted_password = params[:user][:encrypted_password]
    if encrypted_password.size < 6 or encrypted_password.size > 20
      flash.now[:info] = '密码长度不符合要求'
      render :edit_reset
    else
      @user.password_digest(encrypted_password)
      @user.reset_password_sent_at = Time.now - 1.year
      @user.save(validate: false)
      flash.now[:info] = '修改密码成功'
      render text: 'successful'
    end
  end
end
