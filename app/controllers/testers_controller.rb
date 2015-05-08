class TestersController < ApplicationController

  before_action :require_login?

  def new
  end

  def create
    json = { status: 0, code: 1, msg: '创建成功' }
    @tester_infor = TesterInfor.new.tap(&:new_model_block)
    json['code'] == 0 unless @tester_infor.save

    render json: json
  end

  def edit
  end

  def update
  end

private

  def new_model_block
    Pro.new do |infor|
      pry
      infor.tester_id = current_user.id
      infor.username = params['username']
      infor.birthday = parse_birthday(params['birthday'])
      infor.birthplace = params['birthplace']
      infor.livingplace = params['livingplace']
      infor.device = params['device']
      infor.sex = params['sex']
      infor.emotional_status = params['emotional_status']
      infor.sex_orientation = params['sex_orientation']
      infor.eduction = params['eduction']
      infor.profession = params['profession']
      infor.income = params['income']
      infor.personality = params['personality']
      infor.interest = params['interest']
      info.email_contract = params['email_contract']
      infor.mobile_phone = params['mobile_phone']
      infor.wechat = params['wechat']
      infor.ali_pay = params['ali_pay']
    end
  end

  def parse_birthday(time)
    begin
      DateTime.parse(time)
    rescue
      DateTime.parse('1991-10-04')
    end
  end
end
