$hashids = Hashids.new Settings.hashids_secret_token, 2

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

  # def self.find_by(opt = {})
  #   hash_id = opt[:id]
  #   opt[:id] = $hashids.decode(hash_id)[0] if hash_id
  #   where(opt).take
  # end

end