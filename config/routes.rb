Rails.application.routes.draw do

  namespace :users do

    resources :registrations, except: :destroy

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
        get 'confirmation'
        post 'send_confirmation'
        get 'callback_confirmation'

        get 'reset_password'
        post 'send_reset_password'
        get 'callback_reset_password'
      end
    end

  end

  root 'pages#home'
  get 'pm' => 'pages#pm'
  get 'tester' => 'pages#tester'
end
