Rails.application.routes.draw do

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
      end
    end
  end

  resources :pms
  resources :testers

  require 'sidekiq/web'
  Sidekiq::Web.use Rack::Auth::Basic do |username, password|
      username == Settings.sidekiq_username && password == Settings.sidekiq_password
  end if Rails.env.production?
  mount Sidekiq::Web, at: '/sidekiq'

  get 'pm' => 'pages#pm'
  get 'tester' => 'pages#tester'

end
