class Users::MailersController < ApplicationController

  def send_confirmation
    user = User.find_by(email: params[:email])
    if user
      flash[:info] = '邮件已经发送，请查收'
    else
      flash[:info] = '不存在此邮箱，请先注册后在验证'
    end
    render confirmation_users_mailers_path
  end

  def send_reset_password
    @user = current_user
    unless !@user
      @user.generate_reset_password_token
      #send_mail
    end
    render reset_password_users_mailers_path
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
      else
        flash[:info] = 'token已经过期'
      end
      redirect_to reset_password_users_mailers_path
    else
      redirect_to new_users_session
    end
  end
end
