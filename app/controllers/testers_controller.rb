class TestersController < ApplicationController

  before_action :require_login?, except: :index
  before_action :already_create?, only: [:create, :new]

  def index
    current_user.update_attribute(:role, 'both') if current_user.try(:role) == 'pm'
  end

  def new
    @devices = ['iPhone', 'iPad', 'Android Phone', 'Android Pad']
    @personality = ['温柔', '粗犷', '活泼', '老成', '内向', '开朗', '豪爽', '沉默', '急躁', '稳重']
    @interests = ['足球', '健身', '旅游', '二次元', '音乐', '看书', '电影', '星座']
    render '/testers/new'
  end

  def create
    json = { status: 0, code: 1, msg: '创建成功', url: testers_path }
    @tester_infor = TesterInfor.new.tap &model_block

    if @tester_infor.save
      if current_user.role == 'pm'
        current_user.update_attribute(:role, 'both')
      end
      # default: project.first is new tester task
      a = Assignment.create(project_id: Project.first.try(:id), tester_id: current_user.id,  status: 'test')

      task_url = "#{Settings.domain}/testers/#{current_user.id}/assignments"
      UserMailer.new_task_notice(@tester_infor.email_contract || current_user.email,
                                 a.project.name, task_url).deliver_later
    else
      json['code'] = 0
      json['msg'] = @tester_infor.errors.full_messages
    end

    render json: json
  end

  def edit
    @devices = ['iPhone', 'iPad', 'Android Phone', 'Android Pad']
    @personality = ['温柔', '粗犷', '活泼', '老成', '内向', '开朗', '豪爽', '沉默', '急躁', '稳重']
    @interests = ['足球', '健身', '旅游', '二次元', '音乐', '看书', '电影', '星座']
    @tester_infor = @current_user.to_tester.tester_infors[0]
    render 'testers/edit'
  end

  def update
    json = { status: 0, code: 1, msg: '创建成功', url: testers_path }

    tester = current_user.to_tester.tester_infors.find_by(id: params[:id])
    if tester && tester_infors = tester.tester_infors
      @tester_infor = tester_infors.last.tap &model_block
      unless @tester_infor.save
        json[:code] = 0
        json[:msg] = @tester_infor.errors.full_messages
      end
    else
      json[:code] = 0
      json[:msg] = '没有找到相关的testerinfors'
    end

    render json: json
  end

private

  def model_block
    Proc.new do |infor|
      infor.tester_id = current_user.id unless infor.tester_id
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

private

  def already_create?
    redirect_to edit_tester_path(current_user) if current_user.to_tester.tester_infors.size >= 1
  end
end
