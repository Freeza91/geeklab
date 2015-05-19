module ApplicationHelper

  def get_qiniu_source(path)
    "http://" + Settings.qiniu_bucket_domain + "/" + path
  end
end
