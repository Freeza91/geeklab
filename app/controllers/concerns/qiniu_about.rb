require 'active_support/concern'

module QiniuAbout
  extend ActiveSupport::Concern

  included do
    before_action :require_login?, except: [:callback_from_qiniu,
                                            :callback_from_qiniu_transfer,
                                            :callback_from_qiniu_video_images]

    skip_before_filter :verify_authenticity_token, :only => [:callback_from_qiniu,                                                       :callback_from_qiniu_transfer,
                                                             :callback_from_qiniu_video_images]
  end

  def upload_token
    json = { status: 0, code: 1, msg: "生成token成功", token: '' }
    if params[:name].blank?
      json[:code], json[:msg] = 0, '文件名不能为空'
    elsif current_user
      token = generate_token(params[:assignment_id], params[:name])
      json[:token] = token
    else
      json[:code], json[:msg] = 0, '你没有权限'
    end

    render json: json
  end

  def callback_from_qiniu
    json = { status: 0, code: 0, msg: '上传文件不成功' }
    id = $redis.get(params[:auth_token])
    if id && tester = Tester.find_by(id: id)
      assignment = Assignment.find_by(id: params[:assignment_id])
      if assignment.try(:tester_id) == tester.id
        video = "http://" + Settings.qiniu_bucket_domain + "/" + params[:key_name].to_s
        assignment.update_attributes(video: video, status: "wait_check")
        json[:code] = 1
        json[:video] = video
        json[:msg] = '上传文件成功'
      end
    end

    render json: json
  end

  def callback_from_qiniu_transfer
    tester = Tester.find_by(id: params[:tester_id])
    video = "http://" + Settings.qiniu_bucket_domain + "/" + params[:inputKey]
    if tester
      assignment = tester.assignments.find_by(id: params[:assignment_id])
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

private

  def generate_token(id, file_name)
    auth_token = generate_qiniu_auth_token
    $redis.set(auth_token, current_user.id)
    $redis.expire(auth_token, 1.days)

    key_name = generate_key_name(file_name)
    callback_path = "/testers/#{params[:tester_id]}/assignments/#{params[:assignment_id]}/callback_from_qiniu"
    persistentNotify_path = "/testers/#{params[:tester_id]}/assignments/#{params[:assignment_id]}/callback_from_qiniu_transfer"

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
      callbackBody: "auth_token=#{auth_token}&key_name=#{key_name}&assignment_id=#{id}",
      deadline: 1.days.from_now.to_i,
      persistentOps: "avthumb/mp4/vb/256k/wmImage/" + qiniu_encode("#{Settings.water_picture}") + "|saveas/" + qiniu_encode("#{Settings.qiniu_bucket}:copy-#{key_name}") ,
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