require 'mina/unicorn'
require 'mina/bundler'
require 'mina/rails'
require 'mina/git'
require 'mina/rvm' #rbenv
require 'mina/whenever'
require 'mina_sidekiq/tasks'

set :user, 'deploy'
set :forward_agent, true
set :port, 9527

set :deploy_to, '/home/deploy/geek-lab'
set :current_path, 'current'
set :app_path,  "#{deploy_to}/#{current_path}"

set :repository, 'git@github.com:GeekPark/GeekLab.git'
set :keep_releases, 5

set :unicorn_pid, lambda { "#{deploy_to}/#{shared_path}/tmp/pids/unicorn.pid" }
set :unicorn_env, 'production'
set :sidekiq_pid, lambda { "#{deploy_to}/#{shared_path}/tmp/pids/sidekiq.pid" }

set :shared_paths, [
  'config/database.yml',
  'config/secrets.yml',
  'config/application.yml',
  'config/newrelic.yml',
  'tmp',
  'log'
]

case ENV['on']
when 'release'
  set :branch, 'release'
  set :domain, '119.254.100.115'
  set :unicorn_config, lambda { "#{app_path}/config/unicorn_#{branch}.rb" }
when 'master'
  set :domain, '119.254.101.120'
  set :branch, 'master'
  set :unicorn_config, lambda { "#{app_path}/config/unicorn_#{branch}.rb" }
when 'stg'
  set :domain, '119.254.101.120'
  set :branch, 'master'
  set :unicorn_config, lambda { "#{app_path}/config/unicorn_#{branch}.rb" }
else
  set :domain, '119.254.101.120'
  set :branch, 'develop'
  set :unicorn_config, lambda { "#{app_path}/config/unicorn_master.rb" }
end

task :environment do
  queue! 'source ~/.bashrc'
  invoke :'rvm:use[ruby-2.2.0]'
end

task setup: :environment do
  queue! %[mkdir -p "#{deploy_to}/shared/log"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/log"]

  queue! %[mkdir -p "#{deploy_to}/shared/config"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/config"]

  queue! %[mkdir -p "#{deploy_to}/shared/tmp"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/tmp"]

  queue! %[mkdir -p "#{deploy_to}/shared/public/uploads"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/public/uploads"]

  queue! %[touch "#{deploy_to}/shared/config/database.yml"]
  queue! %[touch "#{deploy_to}/shared/config/secrets.yml"]
  queue! %[touch "#{deploy_to}/shared/config/application.yml"]
  queue! %[touch "#{deploy_to}/shared/config/newrelic.yml"]
end

desc "Deploys the current version to the server."
task deploy: :environment do

  p "将要部署到：#{branch}"

  deploy do

    invoke :'git:clone'
    invoke :'deploy:link_shared_paths'
    invoke :'bundle:install'
    invoke :'rails:db_migrate'
    invoke :'rails:assets_precompile'
    invoke :'whenever:update'
    invoke :'deploy:cleanup'

    to :launch do
      invoke :'sidekiq:quiet'
      invoke :'sidekiq:restart'
      invoke :'unicorn:restart'
      queue "touch #{deploy_to}/tmp/restart.txt"
    end
  end
end

# mina log default

task debug: :environment do
  queue! "cd #{app_path}"
  queue! "bundle exec rails c production"
end