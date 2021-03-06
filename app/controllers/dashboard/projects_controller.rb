class Dashboard::ProjectsController < Dashboard::BaseController

  load_and_authorize_resource

  def index
    @projects = Project.order('id desc').page(params[:page]).per(10)
    @q = Project.order('id desc').ransack(params[:q])
  end

  def edit
    respond_to do |format|
      format.html
      format.json do
        json = { code: 0, msg: '', project: {} }
        @project = Project.includes(:tasks).includes(:user_feature).find(params[:id])

        if @project
          json[:project] = @project.to_json_for_admin_edit
        end

        render json: json
      end
    end
  end

  def update
    json = { status: 0, code: 1, msg: 'success' }
    @project = Project.find params[:id]
    unless @project && @project.update_attributes(project_params)
      json[:code], json[:msg] = 0, 'failed'
    end

    render json: json
  end

  def select
    @user_infos = []
    project = Project.find params[:id]
    if project
      tester_ids = load_info_from_redis(project)
      ids = JSON.parse tester_ids

      ids.each do |id|
        json = JSON.parse($redis.get("assignment-tester_#{id}"))
        @user_infos << json
      end
    else
      return redirect_to dashboard_projects_path
    end

    @user_infos = Kaminari.paginate_array(@user_infos).page(params[:page]).per(10)
  end

  def deliver
    project = Project.find params[:id]
    ids = load_info_from_redis(project)
    ids &= params[:tester_ids]

    ids.each do |id|
      Assignment.create(tester_id: id, project_id: project.id, status: 'new')
      # deliver email to tester
      task_url = "#{Settings.domain}/assignments"
      mail_to = infor.try(:email_contract) || infor.tester.email
      UserMailer.new_task_notice(mail_to, project.name, task_url).deliver_later

      json = JSON.parse($redis.set "assignment-tester_#{id}")
      json[:status] = true
      $redis.set "assignment-tester_#{id}", json.to_json
      $redis.expire "assignment-tester_#{id}", 1.day / 2
    end

    redirect_to dashboard_projects_path

  end

  def destroy
    @project = Project.find params[:id]
    @project && @project.destroy

    redirect_to dashboard_projects_path
  end

  def search
    @projects = Project.order('id desc').ransack(params[:q])
                       .result.page(params[:page]).per(10)
    @q = Project.order('id desc').ransack(params[:q])

    render :index
  end

private

  def project_params
    params.require(:project).permit(:credit, :beginner, :basic_bonus, :status, :expired_duration, :rating_duration, reasons: [])
  end

  def load_info_from_redis(project)
    ids = $redis.get("project-user-#{project.id}")
    tester_array = []
    assignment_info = []

    unless ids
      TesterInfor.find_each(batch_size: 100) do |infor|
        if AssignmentCategory.select_tester(infor,
            AssignmentCategory.get_device(project.platform, project.device))
          tester_array << infor.tester_id
        end
      end

      if project.assignments
        ids = project.assignments.collect { |a| a.tester_id }
        tester_array += ids
      end

      tester_array.uniq!
    end

    save_data_on_redis(tester_array, project.id)

    if tester_array.present?
      $redis.set("project-user-#{project.id}", tester_array.to_json)
      $redis.expire("project-user-#{project.id}", 1.day / 2 - 1.hour / 2)
    end

    $redis.get("project-user-#{project.id}") || [].to_json
  end


  def save_data_on_redis(tester_array = [], project_id)
    tester_array.each do |tester_id|
      infor = TesterInfor.find_by(tester_id: tester_id)
      email = infor.try(:email_contract) || infor.tester.email
      tester = infor.tester
      assignments = tester.assignments
      finish_demand = assignments.done.try(:size) || 0

      sum = CreditRecord.where(tester_id: tester_id).inject { |sum, item| sum + item }
      ave = sum ? sum / finish_demand.to_f : 0
      status = assignments.map(&:project_id).include?(project_id)

      json = { status: status, email: email, last_login: tester.try(:last_login),
               tester_id: tester_id ,finish_demand: finish_demand, ave: ave.round(1),
               username: infor.try(:username) }

      $redis.set "assignment-tester_#{tester_id}", json.to_json
      $redis.expire "assignment-tester_#{tester_id}", 1.day / 2
    end
  end

end

