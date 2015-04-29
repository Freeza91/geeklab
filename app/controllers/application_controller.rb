class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def current_user
    if session[:id]
      @current_user ||= User.find_by(id: session[:id])
    elsif !@current_user && cookies.signed[:id]
      @current_user ||= User.find_by(id: cookies.signed[:id])
      session[:id] = @current_user.id if @current_user
    end
    @current_user
  end

  def require_login?
    unless current_user
      flash[:info] = 'you should login first'
      redirect_to root_path
    end
  end

  def logined?
    return render text: '已经登录过了' if current_user
  end

end
