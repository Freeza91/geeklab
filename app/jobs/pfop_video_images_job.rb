class PfopVideoImagesJob < ActiveJob::Base
  queue_as :pfop_video_images

  def perform(id)
    # 此处会比较大耗损服务器资源
    # 暂时会将其暂停， 后面在将其转出到微服务中！！
    # assignment = Assignment.find_by(id: $hashids.encode(id))
    # if assignment && assignment.is_transfer
    #   duration = get_video_info(assignment.video, duration)
    #   # 每个视频维持30张截图
    #   start = (duration % 30) / 2
    #   step = duration / 30
    #   (start..duration).step(step).each do |n|
    #     capture_and_save_picture(assignment.video, n, assignment.id, assignment.tester_id)
    #   end
    # end
  end

  def get_video_info(video_url, duration)
    res = RestClient.get(video_url + '?avinfo')
    duration = 0
    if res.code == 200
      json = JSON.parse res.body
      duration = json['streams'].first['duration'].to_i
    end
    duration
  end

  def capture_and_save_picture(video_url, n, assignment_id, tester_id)
    video = (URI.parse video_url).path.to_s[1..-1].to_s
    hash_tester_id = $hashids.encode(tester_id)
    hash_assignment_id = $hashids.encode(assignment_id)
    callback = if Rails.env.development?
      "#{Settings.ngork_domain}/testers/#{hash_tester_id}/assignments/#{hash_assignment_id}/callback_from_qiniu_video_images"
    else
      "#{Settings.domain}/testers/#{hash_tester_id}/assignments/#{hash_assignment_id}/callback_from_qiniu_video_images"
    end

    pfop_policy = Qiniu::Fop::Persistance::PfopPolicy.new("#{Settings.qiniu_bucket}", video,
                                                          "vframe/jpg/offset/#{n}|saveas/" + qiniu_encode, callback
                                                         )
    Qiniu::Fop::Persistance.pfop(pfop_policy)
  end

  def qiniu_encode
    name = Time.now.to_i.to_s + [*'a'..'z',*'0'..'9',*'A'..'Z'].sample(8).join + ".jpeg"
    Qiniu::Utils.urlsafe_base64_encode("video-images:#{name}")
  end
end
