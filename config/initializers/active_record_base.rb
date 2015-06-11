$hashids = Hashids.new Settings.hashids_secret_token, 4

class ActiveRecord::Base

  # 加密id做参数
  def to_param
    encode_id
  end

  # 加密id
  def encode_id
    $hashids.encode(id)
  end

  # 解密id
  def decode_id
    $hashids.decode(id)[0]
  end

  def self.find_by_encode_id(encode_id)
    id = $hashids.decode(encode_id)[0]
    find_by(id: id)
  end

end