class Dashboard::ProjectsController < Dashboard::BaseController

  load_and_authorize_resource

  def index
    @projects = Project.order(:id).page(params[:page]).per(10)
  end

  def edit
    respond_to do |format|
      format.html
      format.json do
        json = { code: 0, msg: '', project: {} }
        @project = Project.includes(:tasks).includes(:user_feature).find(params[:id])

        if @project
          json[:project] = {
            id: @project.id,
            expired_at: @project.expired_at,
            credit: @project.credit,
            status: @project.status,
            reasons: @project.reasons,
            basic_bonus: @project.basic_bonus,
          }
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
    @projects = []
    project = Project.find params[:id]
    if project
      tester_ids = load_info_from_redis(project)
      ids = JSON.parse tester_ids

      ids.each do |id|
        json = $redis.get("assignment-tester_#{id}")
        @projects << json
      end
    else
      return redirect_to dashboard_projects_path
    end

    @projects = Kaminari.paginate_array(@projects).page(params[:page]).per(10)
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

private

  def project_params
    params.require(:project).permit(:expired_at, :credit, :basic_bonus, :status, :reasons)
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

    save_data_on_redis(tester_array)

    if tester_array.present?
      $redis.set("project-user-#{project.id}", tester_array.to_json)
      $redis.expire("project-user-#{project.id}", 1.day / 2 - 1.hour / 2)
    end

    $redis.get("project-user-#{project.id}") || [].to_json
  end


  def save_data_on_redis(tester_array = [])
    tester_array.each do |tester_id|
      infor = TesterInfor.find_by(tester_id: tester_id)
      email = infor.try(:email_contract) || infor.tester.email
      tester = infor.tester
      finish_demand = tester.assignments.try(:size) || 0
      status = tester.assignments.map(&:project_id).include?(project_id)

      json = { status: status, email: email, last_login: tester.try(:last_login),
               finish_demand: finish_demand, ave: "" }

      $redis.set "assignment-tester_#{tester_id}", json.to_json
      $redis.expire "assignment-tester_#{tester_id}", 1.day / 2
    end
  end

end

