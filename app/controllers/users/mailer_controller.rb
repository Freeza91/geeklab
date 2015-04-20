class Users::MailerController < ApplicationController

  def send_confirmation
    user = User.find_by(email: params[:email])
    if user
      flash[:info] = '邮件已经发送，请查收'
    else
      flash[:info] = '不存在此邮箱，请先注册后在验证'
    end
    render users_mailer_confirmation_path
  end

  def send_reset_password
    @user = current_user
    unless !@user
      @user.generate_reset_password_token
      #send_mail
    end
    render users_mailer_reset_password_path
  end

  def callback_confirmation
    token = params[:confirmation_token]
    @user = User.find_by
  end

  def callback_reset_password
    token = params[:reset_password_token]
    @user = User.find_by(reset_password_token: token)
    if @user
      if @user.reset_password_sent_at + 1.days < Time.now
        #set cookie for this user
        redirect_to users_passwords_reset_password_path
      else
        flash[:info] = 'token已经过期'
        render users_passwords_reset_password_path
      end
    else
      redirect_to users_sessions_new_path
    end
  end
end
