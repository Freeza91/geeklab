class Users::MailerController < ApplicationController

  def send_confirmation
  end

  def reset_password
    #reset_password_token
  end

  def callback_confirmation
    params[:confirmation_token]
  end
end
