class TestersController < ApplicationController

  before_action :require_login?, except: :index

  def index
  end

  def new
    @devices = ['Andoriod', 'IOS']
    @personality = [1, 2, 3, 4, 5]
    @interests = [1, 2, 3, 4, 5]
    render '/testers/new'
  end

  def create
    json = { status: 0, code: 1, msg: '创建成功', url: testers_path }
    @tester_infor = TesterInfor.new.tap &new_model_block

    if @tester_infor.save
      @tester = current_user
      @tester.update_attribute(:approved, true)
    else
      json['code'] = 0
      json['msg'] = @tester_infor.errors.full_messages
    end

    render json: json
  end

  def edit
  end

  def update
  end

private

  def new_model_block
    Proc.new do |infor|
      infor.tester_id = current_user.id
      infor.username = params['username']
      infor.birthday = parse_birthday(params['birthday'])
      infor.birthplace = params['birthplace']
      infor.livingplace = params['livingplace']
      infor.device = params['device']
      infor.sex = params['sex']
      infor.emotional_status = params['emotional_status']
      infor.sex_orientation = params['sex_orientation']
      infor.education = params['education']
      infor.profession = params['profession']
      infor.income = params['income']
      infor.personality = params['personality']
      infor.interest = params['interest']
      infor.email_contract = params['email_contract']
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
