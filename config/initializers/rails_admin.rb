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
      only ['TesterInfor']
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
    end
  end

  config.model "Pm" do
    edit do
      field :role
      field :username
      field :email
      field :approved
    end
  end

  config.model "Tester" do
    edit do
      field :role
      field :username
      field :email
      field :approved
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
      field :comment, :pg_int_array
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
      field :contact_name
      field :phone
      field :email
      field :company
      field :credit
      field :demand
      field :approved
      field :qr_code

      field :tasks do
        orderable true
      end

      field :assignments do
        orderable true
      end

      field :user_feature do
      end

    end
  end

end