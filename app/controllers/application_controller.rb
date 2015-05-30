class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  helper_method :current_user

  def current_user
    @current_user ||= (from_session || from_cookies)
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

  def email_target(email)
    _, domain = email.match(/\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i).captures
    domains = %w(qq.com 163.com 126.com sohu.com sina.com gmail.com 21cn.com)
    if domains.include? domain
      "http://mail.#{domain}/"
    else
      ""
    end
  end

private

  def from_session
    User.find_by(id: session[:id]) if session[:id]
  end

  def from_cookies
    User.find_by(id: cookies.signed[:id]).tap do |user|
      session[:id] = user.try(:id)
    end if cookies.signed[:id]
  end

end
