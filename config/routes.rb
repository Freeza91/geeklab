 Rails.application.routes.draw do

  #root 'pages#home'
  root 'testers#index'

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
  resources :projects do
    collection do
      get 'web/new', to: 'projects#web'
      get 'app/new', to: 'projects#app'
      get 'video', to: 'projects#video'
    end

    member do
      get 'video/:assignments_id', to: 'projects#video'
    end

    resources :assignments, only: :show do
      resources :comments, only: :create
    end
  end

  resources :testers do
    collection do
      get 'help'
    end
  end
  resources :assignments do
    collection do
      get 'miss'
      get 'join'
      get 'not_interest'
      get 'ing'
      get 'done'
      get 'upload'
      get 'qr_token'
      get 'upload_token'
      get 'get_video'
      delete 'delete_video'
    end

     member do
      post 'callback_from_qiniu'
      post 'callback_from_qiniu_transfer'
      post 'callback_from_qiniu_video_images'
    end

  end

  namespace :stores do
    root to: "base#index"
    get 'help', to: 'base#help'
    resources :goods do
      collection do
        post 'new',  to: 'goods#save_picture'
      end
      member do
        get 'lookup', to: 'goods#lookup'
        post 'edit',  to: 'goods#save_picture'
      end

      resources :skus
    end
    resources :orders
    resources :pictures, only: :create
  end

  # admin
  mount RailsAdmin::Engine => '/manage', as: 'rails_admin'
  namespace :dashboard, path: '/admin' do
    root 'base#index'
    resources :videos, controller: :assignments do
      member do
        get 'check'
      end
    end
    resources :users
    resources :projects
    resources :goods
    resources :orders
  end

  require 'sidekiq/web'
  Sidekiq::Web.use Rack::Auth::Basic do |username, password|
      username == Settings.sidekiq_username && password == Settings.sidekiq_password
  end if Rails.env.production?
  mount Sidekiq::Web, at: '/sidekiq'

  resources :errors, only: [] do
    get 'file_not_found'
    get 'unprocessable'
    get 'internal_server_error'
  end

  match '/404', to: 'errors#file_not_found', via: :all
  match '/422', to: 'errors#unprocessable', via: :all
  match '/500', to: 'errors#internal_server_error', via: :all
  match "*path", to: "errors#file_not_found", via: :all

end
