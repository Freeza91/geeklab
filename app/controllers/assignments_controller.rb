class AssignmentsController < ApplicationController

  before_action :require_login?, except: :callback
  skip_before_filter :verify_authenticity_token, :only => [:callback]

  def index
    @assignments = Assignment.all
  end

  def show
    @assignment = Assignment.find_by(id: params[:id])
  end

  def edit
    @assignment = Assignment.find_by(id: params[:id])
  end

  def update
    @assignment = Assignment.find_by(id: params[:id])
  end

  def destroy
    @assignment = Assignment.find_by(id: params[:id])
  end

  def upload_token
    token = generate_token(params[:assignment_id])

    render json: { status: 0, code: 1, token: token }
  end

  def callback_from_qiniu
    json = { status: 0, code: 0, msg: '上传文件不成功' }
    id = $redis.get(params[:autu_token])
    if id && tester = Tester.find_by(id: id)
      assignment = Assignment.find_by(id: params[:assignment_id])
      if assignment.try(:tester_id) == tester.id
        assignment.update_attribute(:video, params[:key_name])
        json[:code] = 1
        json[:msg] = '上传文件成功'
      end
    end

    render json: json
  end

private

  def generate_token(id)
    autu_token = generate_qiniu_auth_token
    $redis.set(autu_token, current_user.id)
    $redis.expire(autu_token, 1.days)

    key_name = generate_key_name
    callback_path = "/testers/0/assignments/0/callback_from_qiniu"

    callbackUrl = if Rails.env.development?
      "#{Settings.ngork_domain}#{callback_path}"
    else
      "my domain "
    end

    put_policy = {
      scope: "#{Settings.qiniu_bucket}:#{key_name}",
      callbackUrl: callbackUrl,
      callbackBody: "auth_token=#{auth_token}&key_name=#{key_name}&assignment_id=#{id}",
      deadline: 1.days.from_now
    }
    Qiniu::Auth.generate_uptoken(put_policy)
  end

  def generate_qiniu_auth_token
    SecureRandom.uuid + Time.now.to_i.to_s
  end

  def generate_key_name
    Time.now.to_i.to_s + [*'a'..'z',*'0'..'9',*'A'..'Z'].sample(8).join
  end
end
