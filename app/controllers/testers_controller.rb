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
      project_id = select_prject(Project.collect_beigning, tester_infor.device)
      if project_id
        a = Assignment.create(project_id: project_id, tester_id: current_user.id,  status: 'test')

        task_url = "#{Settings.domain}/assignments"
        UserMailer.new_task_notice(@tester_infor.email_contract || current_user.email,
                                   a.project.name, task_url).deliver_later
      else
        NotificationAdmin.project_error.deliver_later
      end
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
    @tester_infor = current_user.to_tester.tester_infor

    if @tester_infor
      render 'testers/edit'
    else
      redirect_to new_tester_path
    end

  end

  def update
    json = { status: 0, code: 1, msg: '创建成功', url: testers_path }
    tester = current_user.to_tester
    if tester && tester_infor = tester.tester_infor
      @tester_infor = tester_infor.tap &model_block
      unless @tester_infor.save
        json[:code] = 0
        json[:msg] = @tester_infor.errors.full_messages
      end
    else
      json[:code] = 0
      json[:msg] = '没有找到相关的tester信息'
    end

    render json: json
  end

  def help
    if params[:q] == 'web'
      @target
      case request.user_agent
        when /Mac OS/i
          @target = 'mac'
        when /Windows NT/i
          @target = 'window'
      end
    end
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

  def select_project(projects, devices)
    avaliable_devices = ["iPhone,", "Android Phone,", "iPad,", "Android Pad"] & devices
    return projects.first.try(:id) if avaliable_devices.blank?
    avaliable_devices.each do |device|
      projects.each do |project|
        return project.id if device == get_device(project.platform, project.device)
      end
    end

    return projects.first.try(:id)
  end

  def get_device(platform, device)
      # web 测试的设备要求是什么? 暂定无设备要求
      platform = platform.downcase
      device = device.downcase

      if platform == "ios"
        return "iPhone" if device.include?"phone"
        return "iPad" if device.include?"pad"
      elsif platform == 'android'
        return "Android Phone" if device.include?"phone"
        return "Android Pad" if  device.include?"pad"
      else
        "web"
      end
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
    redirect_to edit_tester_path(current_user.to_params) if current_user.to_tester.tester_infor
  end
end
