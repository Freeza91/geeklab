class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def current_user
    @current_user ||= User.find_by(id: cookies.signed[:id]) if cookies.signed[:id]
  end

  def login?
    unless current_user
      flash[:info] = 'you should login first'
      redirect_to new_users_session_path
    end
  end
end
