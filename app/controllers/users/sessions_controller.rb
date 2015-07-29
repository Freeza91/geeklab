class Users::SessionsController < ApplicationController

  before_action :logined?, only: [:new, :auth]

  def new
    @user = User.new
  end

  def auth
    json = { status: 0, code: 1, msg: '', url: '' }
    email = params[:email].to_s.downcase
    if limit_ip?("auth:#{email}")
      json[:code], json[:url] = -1, root_path
      return render json: json
    end
    email = params[:email].to_s.downcase
    @user = User.find_by(email: email)
    if @user && @user.valid_password?(params[:encrypted_password])
      session[:id] = @user.to_params
      @user.remember_me(cookies) if params[:remember_me] == 'true'
      json[:msg] = '登陆成功'
      json[:url] =
        if @user.role == 'tester'
          new_tester_path
        else
          new_pm_path
        end

      render json: json
    else
      @user = User.new(email: email)
      json[:code] = 0
      json[:msg] = '用户名或密码错误，请重试！'
      render json: json
    end
  end

  def destroy
    current_user.forget_me(cookies) if current_user
    reset_session   # reset session must behide delete cookies

    flash[:info] = '登出成功'

    redirect_to direct_to_url
  end


private

  def direct_to_url
    refer_url =
      begin
        URI.parse(request.referer).path
      rescue
        '/'
      end
    if refer_url.include? "testers"
      testers_url
    elsif refer_url.include? "pms"
      pms_url
    elsif refer_url.include? 'stores'
      stores_root_path
    else
      root_url
    end
  end

end
