Rails.application.routes.draw do

  root 'pages#home'

  namespace :users do

    resources :registrations

    resources :sessions, only: :new do
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

  resources :pms, only: :new
  resources :testers, only: :new

  require 'sidekiq/web'
  mount Sidekiq::Web, at: '/sidekiq'

  get 'pm' => 'pages#pm'
  get 'tester' => 'pages#tester'

end
