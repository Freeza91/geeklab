$hashids = Hashids.new Settings.hashids_secret_token, 8

def decode_id(hash_id)
  $hashids.decode(hash_id)[0]
end

class ActiveRecord::Base

    def to_params
      encode_id
    end

    # 加密id
    def encode_id
      $hashids.encode(id)
    end

    def self.find_by(opt = {})
      hash_id = opt[:id]
      opt[:id] = $hashids.decode(hash_id.to_s)[0] unless hash_id.to_s.empty?

      where(opt).take
    end

end

class ActiveRecord::Relation

  def find_by(opt = {})
    hash_id = opt[:id]
    opt[:id] = $hashids.decode(hash_id.to_s)[0] unless hash_id.to_s.empty?

    where(opt).take
  end
end
