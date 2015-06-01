class PfopVideoImagesJob < ActiveJob::Base
  queue_as :pfop_video_images

  def perform(id)
    assignment = Assignment.find_by(id)
    if assignment && assignment.is_transfer
      duration = get_video_info(assignment.video, duration)
      unless duration.zero?
        # 每个视频维持30张截图
        start = (duration % 30) / 2
        step = duration / 30

        (start..duration).step(step).each do |n|
          capture_and_save_picture(assignment.video, n, assignment.id, assignment.tester_id)
        end
      end
    end
  end

  def get_video_info(video_url, duration)
    res = RestClient.get(video_url + '?avinfo')
    if res.code == 200
      json = JSON.parse res.body
      duration = json['streams'].first['duration'].to_i
      return 0 if duration < 35
    else
      0
    end

  end

  def capture_and_save_picture(video_url, n, assignments_id, tester_id)
    video = (URI.parse video_url).path.to_s[1..-1].to_s
    callback = if Rails.env.development?
      "#{Settings.ngork_domain}/testers/#{tester_id}/assignments/#{assignments_id}/callback_from_qiniu_video_images"
    else
      "#{Settings.domain}/testers/#{tester_id}/assignments/#{assignments_id}/callback_from_qiniu_video_images"
    end
    pfop_policy = Qiniu::Fop::Persistance::PfopPolicy.new('video-images', video,
                                                        'vframe/jpg/offset/#{n}|saveas/' + qiniu_encode, callback
                                                        )
    Qiniu::Fop::Persistance.pfop(pfop_policy)
  end

  def qiniu_encode
    name = Time.now.to_i.to_s + [*'a'..'z',*'0'..'9',*'A'..'Z'].sample(8).join + ".png"
    Qiniu::Utils.urlsafe_base64_encode("video-images:#{name}")
  end
end
