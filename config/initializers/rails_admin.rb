RailsAdmin.config do |config|

  ### Popular gems integration

  ## == Devise ==
  # config.authenticate_with do
  #   warden.authenticate! scope: :user
  # end
  # config.current_user_method(&:current_user)

  ## == Cancan ==
  # config.authorize_with :cancan

  ## == PaperTrail ==
  # config.audit_with :paper_trail, 'User', 'PaperTrail::Version' # PaperTrail >= 3.0.0

  config.authorize_with do
    if Rails.env.production?
      authenticate_or_request_with_http_basic('GeekLabs Admin Systems') do |username, password|
        username == Settings.admin_username && password == Settings.admin_password
      end
    end
  end
  ### More at https://github.com/sferik/rails_admin/wiki/Base-configuration

  config.actions do
    dashboard                     # mandatory
    index                         # mandatory
    new do
      only ['Project', 'Task', 'Good', 'Sku', 'Picture']
    end
    export
    bulk_delete
    show
    edit
    delete
    # show_in_app

    ## With an audit adapter, you can add:
    history_index
    history_show
  end


  config.model "User" do
    edit do
      field :role
      field :username
      field :email
      field :approved
      field :admin
      field :credits
      field :created_at
    end
  end

  config.model "Pm" do
    edit do
      field :username
      field :email
      field :created_at
    end
  end

  config.model "Tester" do
    edit do
      field :username
      field :email
      field :credits
      field :approved
      field :created_at
    end
  end

  config.model "Assignment" do
    edit do
      field :project_id
      field :tester_id
      field :status
      field :video
      field :is_transfer
      field :is_sexy
      field :reasons, :pg_int_array
      field :is_read
      field :created_at

      field :comment

    end
  end

  config.model "TesterInfor" do
    edit do
      field :tester
      field :username
      field :sex
      field :birthday
      field :birthplace
      field :livingplace
      field :device,                :pg_int_array
      field :emotional_status
      field :sex_orientation
      field :education
      field :profession
      field :income
      field :personality,           :pg_int_array
      field :interest,              :pg_int_array
      field :email_contract
      field :mobile_phone
      field :wechat
      field :ali_pay

      field :created_at
    end
  end

  config.model "Project" do
    edit do
      field :name
      field :profile
      field :device
      field :requirement
      field :platform
      field :expired_at
      field :desc
      field :contact_name
      field :phone
      field :email
      field :company
      field :credit
      field :demand
      field :status
      field :qr_code
      field :reasons,           :pg_int_array
      field :assign_time
      field :beginner

      field :tasks do
        orderable true
      end

      field :assignments do
        orderable true
      end

      field :user_feature

      field :created_at

    end
  end

  config.model "UserFeature" do
    edit do
      field :project_id

      field :age
      field :income
      field :sex,                 :pg_int_array
      field :city_level,          :pg_int_array
      field :education,           :pg_int_array
      field :emotional_status,    :pg_int_array
      field :sex_orientation,     :pg_int_array
      field :interest,            :pg_int_array
      field :profession,          :pg_int_array
      field :personality,         :pg_int_array

      field :created_at
    end

  end

  config.model "Good" do
    edit do
      field :name
      field :describle
      field :cost
      field :status
      field :is_publish
      field :is_limit
      field :stock
      field :used_num
      field :label

      field :pictures do
        orderable true
      end

    end
  end

  config.model "Sku" do
    edit do
      field :attr
      field :addition
      field :num

      field :good
    end
  end

  config.model "Order" do
    edit do
      field :order_id

      field :good
      field :user
      field :sku

      field :created_at
    end
  end
end
