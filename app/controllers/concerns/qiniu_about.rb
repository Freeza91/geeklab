require 'active_support/concern'

module QiniuAbout
  extend ActiveSupport::Concern

  included do
    before_action :require_login?, except: [:callback_from_qiniu,
                                            :callback_from_qiniu_transfer,
                                            :callback_from_qiniu_video_images,
                                            :upload_token, :upload]

    before_action :detect_browser, only: :upload
    layout false, only: :upload
  end

  def qr_token
    json = { status: 0, code: 1, msg: "生成token成功" }
    if !current_user
      json[:code], json[:msg] = 0, "你没有登录"
    else
      assignment_id = params[:assignment_id]
      if assignment_id && Assignment.find_by(id: assignment_id)
        json[:auth_token] = generate_qr_auth_token(assignment_id)
      else
        json[:code], json[:msg] = 0, '没有找到这个上传任务'
      end
    end

    render json: json

  end

  def upload_token
    json = { status: 0, code: 1, msg: "生成token成功", token: '' }
    if params[:name].blank?
      json[:code], json[:msg] = 0, '文件名不能为空'
    elsif current_user || auth_user_token(params[:auth_token])
      assignment_id = params[:assignment_id]
      if assignment_id && Assignment.find_by(id: assignment_id)
        json[:token] = generate_token(params[:assignment_id], params[:name])
      else
        json[:code], json[:msg] = 0, '当前账户没有此任务信息'
      end
    else
      json[:code], json[:msg] = 0, '你没有权限!'
    end

    render json: json
  end

  def upload
    respond_to do |format|
      format.html { render 'assignments/mobiles/upload' }

      @token = params[:auth_token]
      #@auth = auth_user_token(@token) &&
              #@assignment = Assignment.includes(:project).find_by(id: params[:id])
      if auth_user_token(@token)
        if @assignment = Assignment.includes(:project).find_by(id: params[:id])
          @auth = true
        else
          @auth = false
        end
      end

      format.html do |html|
        html.android { render 'assignments/mobiles/upload' }
        html.ios     { render 'assignments/mobiles/upload' }
        html.windows { render 'assignments/mobiles/upload' }
      end
    end
  end

  def callback_from_qiniu
    json = { status: 0, code: 0, msg: '上传文件不成功' }
    id = $redis.get(params[:auth_token])

    if id && tester = Tester.find_by(id: id)
      assignment = Assignment.find_by(id: params[:id])
      if assignment.try(:tester_id) == tester.id
        video = "http://" + Settings.qiniu_bucket_domain + "/" + params[:key_name].to_s
        assignment.update_attributes(video: video, status: "wait_check", is_transfer: false)
        json[:code] = 1
        json[:video] = video
        json[:msg] = '上传文件成功'
      end
    end

    render json: json
  end

  def callback_from_qiniu_transfer
    id = $redis.get(params[:auth_token])
    video = "http://" + Settings.qiniu_bucket_domain + "/" + params[:inputKey]
    if id && tester = Tester.find_by(id: id)
      assignment = tester.assignments.find_by(id: params[:id])
      if assignment && assignment.video == video
        video_url = "http://" + Settings.qiniu_bucket_domain + "/" + params[:items].first[:key].to_s
        assignment.video, assignment.is_transfer = video_url, true
        code, result, response_headers = Qiniu::Storage.delete(
          Settings.qiniu_bucket,
          params[:inputKey].to_s
        )
        assignment.save
        # 将video进行分解
        PfopVideoImagesJob.perform_later(assignment.id)
      end
    end

    render text: 'hello qiniu transfer'
  end

  def callback_from_qiniu_video_images
    if params[:code] == 0 && tester = Tester.find_by(id: params[:tester_id])
      if assignment = tester.assignments.find_by(id: params[:assignment_id])
        key = params[:items].first[:key]
        assignment.update_attribute(:is_sexy, true) if SoraAoi(key)
        code, result, response_headers = Qiniu::Storage.delete(
          'video-images',
          key
        )
      end
    end

    render text: 'Thanks SoraAoi'
  end

  def auth_user_token(token)
    hash_user_id = $redis.get(token)
    return true if hash_user_id && @current_user ||= User.find_by(id: hash_user_id)
    false
  end

private

  def detect_browser
    case request.user_agent
      when /iPad/i
        request.variant = :ios
      when /iPhone/i
        request.variant = :ios
      when /Android/i && /mobile/i
        request.variant = :android
      when /Android/i
        request.variant = :android
      when /Windows Phone/i
        request.variant = :windows
    end
  end

  def generate_qr_auth_token(key)
    user_id = current_user.id
    token = SecureRandom.uuid + key + (0...2).map { (65 + rand(26)).chr }.join
    $redis.set(token, $hashids.encode(user_id))
    $redis.expire(token, 2.hour) # set 2 hour

    token
  end

  def generate_token(id, file_name)
    auth_token = generate_qiniu_auth_token
    hash_id = $hashids.encode(current_user.id)
    $redis.set(auth_token, hash_id)
    $redis.expire(auth_token, 1.days)


    key_name = generate_key_name(file_name)
    callback_path = "/assignments/#{id}/callback_from_qiniu"
    persistentNotify_path = "/assignments/#{id}/callback_from_qiniu_transfer?auth_token=#{auth_token}"

    callbackUrl = if Rails.env.development?
      "#{Settings.ngork_domain}#{callback_path}"
    else
      "#{Settings.domain}#{callback_path}"
    end
    persistentNotifyUrl = if Rails.env.development?
      "#{Settings.ngork_domain}#{persistentNotify_path}"
      else
      "#{Settings.domain}#{persistentNotify_path}"
    end

    put_policy = {
      scope: "#{Settings.qiniu_bucket}",
      saveKey: "#{key_name}",
      callbackUrl: callbackUrl,
      callbackBody: "auth_token=#{auth_token}&key_name=#{key_name}",
      deadline: 1.days.from_now.to_i,
      persistentPipeline: 'transfervideos',
      fsizeMin: 524288,
      fsizeLimit: 3221225472,
      persistentOps: "avthumb/mp4/stripmeta/1/rotate/auto/vb/512k/s/800x480/autoscale/1/wmImage/" + qiniu_encode("#{Settings.water_picture}") + "/wmGravity/SouthWest" + "|saveas/" + qiniu_encode("#{Settings.qiniu_bucket}:copy-#{key_name}") ,
      persistentNotifyUrl: persistentNotifyUrl
    }
    Qiniu::Auth.generate_uptoken(put_policy)
  end

  def generate_qiniu_auth_token
    SecureRandom.uuid + Time.now.to_i.to_s
  end

  def generate_key_name(key_name)
    Time.now.to_i.to_s + [*'a'..'z',*'0'..'9',*'A'..'Z'].sample(8).join + ".mp4"
  end

  def qiniu_encode(content)
    Qiniu::Utils.urlsafe_base64_encode content
  end

  def SoraAoi(image)
    image_url = "http://#{Settings.qiniu_video_images_domain}/" + image
    res = RestClient.get(image_url + '?nrop')
    body = JSON.parse res.body
    return true if body['code'] == 0 && body['fileList'].first['label'] == 0
    false
  end

end
