Rails.application.routes.draw do

  namespace :users do
    get 'sessions/new'
    post 'sessions/auth'
    get 'registrations/new'
    get 'registrations/edit'
    post 'registrations/create'
    put 'registrations/update'
    get 'passwords/edit'
    put 'passwords/update'
    get 'passwords/reset_password'
    post 'passwords/update_reset_password'
    get 'mailer/confirmation'
    post 'mailer/send_confirmation'
    get 'mailer/callback_confirmation'
    get 'mailer/reset_password'
    post 'mailer/send_reset_password'
    get 'mailer/callback_reset_password'
  end

  root 'pages#home'

end
