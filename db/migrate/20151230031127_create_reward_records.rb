class CreateRewardRecords < ActiveRecord::Migration
  def change
    create_table :reward_records do |t|

      t.string :mch_billno # 自定义订单号
      t.string :detail_id # 红包单号
      t.string :status   # 红包状态
      t.datetime :send_time # 发送时间
      t.datetime :refund_time # 退款时间
      t.integer  :refund_amount # 红包退款金额
      t.string :openid # 领取用户的openid
      t.integer :amount # 领取的金额
      t.string :rcv_time # 领取红包的时间

      t.integer :user_id
      t.string :secret
      t.string :id_num
      t.string :name

      t.timestamps null: false

    end
  end
end