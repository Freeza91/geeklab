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
    end

    member do
      get 'video/:assignment_id', to: 'projects#video'
    end
  end

  resources :testers do
    collection do
      get 'help'
      get 'how-to-get-five-star', to: 'testers#rating_help'
      get 'choose-device', to: 'testers#choose'
    end
  end

  resources :assignments do
    resources :feedbacks

    collection do
      get 'got_it'
      get 'subscribe'
      get 'unsubscribe'
      get 'get_new_task'
      get 'get_finish_project'
      get 'join'
      get 'get_ing_task'
      get 'get_done_task'
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
      post 'rating'
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
    root 'charts#index'
    resources :charts, only: [] do
      get 'select', to: 'charts#select', on: :collection
    end
    resources :videos, controller: :assignments do
      get 'search', to: 'assignments#search', on: :collection
    end
    resources :users do
      get 'search', to: 'users#search', on: :collection
    end
    resources :projects do
      get 'search', to: 'projects#search', on: :collection
      member do
        get 'select'
        post 'deliver'
      end
    end
    resources :goods do
      post 'search', to: "goods#search", on: :collection
      resources :skus do
        collection do
          put 'create_or_update', to: 'skus#create_or_update'
        end
      end
    end
    resources :orders, only: [:index, :edit, :destroy] do
      get 'search', to: "orders#search", on: :collection
      member do
        get 'virtual'
        get 'real'
      end

      resources :skus, only: :update
      resources :addresses, only: :update
    end
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
  if Rails.env.production?
    match "*path", to: "errors#file_not_found", via: :all
  end

end
