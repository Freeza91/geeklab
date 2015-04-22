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
        get 'reset_password'
        put 'update_reset_password'
      end
    end

    resources :mailers, only: [] do
      collection do
        # get 'confirmation'
        get 'send_confirmation'
        get 'callback_confirmation'

        get 'reset_password'
        post 'send_reset_password'
        get 'callback_reset_password'
      end
    end

  end

  require 'sidekiq/web'
  mount Sidekiq::Web, at: '/sidekiq'

  get 'pm' => 'pages#pm'
  get 'tester' => 'pages#tester'

end
