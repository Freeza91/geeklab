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
    get 'mailer/reset_password'
    get 'mailer/confirmation'
    get 'confirmations/new'
  end

  root 'pages#home'

end
