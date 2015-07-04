class Users::PasswordsController < ApplicationController

  before_action :require_login?, only: [:edit, :update]

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
    current_user.forget_me(cookies) if current_user
    #reset_session

    from = [root_path, pms_path, testers_path, stores_root_path]
    path = URI.parse(request.referer || root_url).path
    referer = from.include?(path) ? path : root_path
    session[:redirect_path] = referer

    render 'stores/password/send_email', layout: 'stores/layouts/stores_application' if(referer == stores_root_path)
  end

  def callback_reset
    @user = User.find_by(reset_password_token: params[:reset_password_token])
    if @user
      if @user.reset_password_sent_at + 1.days >= Time.now
        cookies.signed[:reset_password_token] = params[:reset_password_token]
        redirect_to edit_reset_users_passwords_path
      else
        flash[:info] = 'token已经过期'
        redirect_to reset_users_passwords_path
      end
    else
      redirect_to root_path
    end
  end

 def edit_reset
    @user = User.new
  end

  def update_reset
    json = { msg: '密码修改成功', status: 0, code: 1, redirect_to: '' }
    json[:redirect_to] = session[:redirect_path] ? session[:redirect_path] : root_path

    @user = current_user || User.find_by(reset_password_token: cookies.signed[:reset_password_token])
    encrypted_password = params[:user][:encrypted_password]
    if encrypted_password.size < 6 ||
        encrypted_password.size > 20
      json[:msg] = '密码长度不符合要求'
      json[:code] = 0
      render :edit_reset
    elsif @user
      @user.password_digest(encrypted_password)
      @user.reset_password_sent_at = Time.now - 1.year
      @user.save(validate: false)
      cookies.delete(:reset_password_token) if cookies.signed[:reset_password_token]
      render json: json
    else
      flash[:info] = '不存在此用户'
      redirect_to reset_users_passwords_path
    end
  end
end
