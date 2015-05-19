Rails.application.routes.draw do

  get 'errors/file_not_found'

  get 'errors/unprocessable'

  get 'errors/internal_server_error'

  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  root 'pages#home'

  namespace :users do

    resources :registrations, except: :destroy do
      collection do
        get 'is_emails_exist'
      end
    end

    resources :sessions, only: [:new, :destroy] do
      collection do
        post 'auth'
      end
    end

    resources :passwords, only: [:edit, :update] do
      collection do
        get 'reset'
        get 'callback_reset'
        get 'edit_reset'
        put 'update_reset'
      end
    end

    resources :mailers, only: [] do
      collection do
        get 'send_confirmation'
        post 'send_reset_password'
        get 'send_novice_task'
      end
    end
  end

  resources :pms

  resources :testers do
    resources :assignments do
      post 'callback_from_qiniu'
      get 'upload_token'
    end
  end

  require 'sidekiq/web'
  Sidekiq::Web.use Rack::Auth::Basic do |username, password|
      username == Settings.sidekiq_username && password == Settings.sidekiq_password
  end if Rails.env.production?
  mount Sidekiq::Web, at: '/sidekiq'

  match '/404', to: 'errors#file_not_found', via: :all
  match '/422', to: 'errors#unprocessable', via: :all
  match '/500', to: 'errors#internal_server_error', via: :all

end
