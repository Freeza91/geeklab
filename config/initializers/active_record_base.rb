$hashids = Hashids.new Settings.hashids_secret_token, 8

class ActiveRecord::Base

  # 加密id做参数
  def to_params
    encode_id
  end

  # 加密id
  def encode_id
    $hashids.encode(id)
  end

  # 解密id
  def decode_id(hash_id)
    $hashids.decode(hash_id)[0]
  end

  def self.find_by(opt = {})
    hash_id = opt[:id]
    p opt
    opt[:id] = $hashids.decode(hash_id.to_s)[0] unless hash_id.to_s.empty?
    p opt
    where(opt).take
  end

end