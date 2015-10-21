class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

  helper_method :current_user

  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

  def current_user
    @current_user ||= (from_session || from_cookies)
  end

  def require_login?

    unless current_user
      flash[:info] = 'you should login first'

      respond_to do |format|
        format.html { redirect_to root_path }
        format.any do
          json = {status: 0, code: 1, msg: '哥们，登陆后再试！' }
          render json: json
        end
      end
    end

  end

  def logined?
    return render text: '已经登录过了' if current_user
  end

  def email_target(email)
    _, domain = email.match(/\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i).captures
    domains = %w(qq.com 163.com 126.com sohu.com sina.com gmail.com 21cn.com)
    if domains.include? domain
      if domain == 'gmail.com'
        "https://mail.google.com"
      else
        "http://mail.#{domain}/"
      end
    else
      ""
    end
  end

  def limit_ip?(from)
    ip = (request.remote_ip || request.ip) + "-" + from
    counter = $redis.get(ip).to_i
    return true if counter > 50
    $redis.incr(ip)
    $redis.expire(ip, 15 * 1.minute) if counter == 1

    false
  end

  def is_pm?
    @is_pm ||= ['both', 'pm'].include?(current_user.role)
    redirect_to pms_path unless @is_pm
  end

private

  def from_session
    User.find_by(id: session[:id]) if session[:id]
  end

  def from_cookies
    User.find_by(id: cookies.signed[:id]).tap do |user|
      user && session[:id] = user.to_params
    end if cookies.signed[:id]
  end

  def record_not_found
    render 'errors/record_not_found', layout: false
  end

end
