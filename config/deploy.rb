require 'mina/bundler'
require 'mina/rails'
require 'mina/git'
require 'mina/rvm' #rbenv
require 'mina_sidekiq/tasks'


case ENV['on']
when 'release'
  set :branch, 'release'
when 'master'
  set :domain, '123.59.40.194'
  set :branch, 'master'
when 'stg'
  set :domain, '50.116.16.150'
  set :branch, 'develop'
else
  set :domain, '50.116.16.150'
  set :branch, 'develop'
end

p "将要部署到：#{branch}"

set :user, 'deploy'
set :forward_agent, true
set :port, 9527

set :deploy_to, '/home/deploy/geek-lab'
set :current_path, 'current'
set :app_path,  "#{deploy_to}/#{current_path}"

set :repository, 'git@github.com:GeekPark/GeekLab.git'
set :keep_releases, 5

set :unicorn_pid, lambda { "#{deploy_to}/#{shared_path}/tmp/pids/unicorn.pid" }
set :sidekiq_pid, lambda { "#{deploy_to}/#{shared_path}/tmp/pids/sidekiq.pid" }

set :shared_paths, [
  'config/database.yml',
  'config/secrets.yml',
  'config/application.yml',
  'config/newrelic.yml',
  'tmp',
  'log'
]

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
  deploy do
    invoke :'sidekiq:quiet'
    invoke :'git:clone'
    invoke :'deploy:cleanup'
    invoke :'deploy:link_shared_paths'
    invoke :'bundle:install'
    invoke :'rails:db_migrate'
    invoke :'rails:assets_precompile'

    to :launch do
      invoke :'unicorn:restart'
      queue "touch #{deploy_to}/tmp/restart.txt"
      invoke :'sidekiq:restart'
    end
  end
end

namespace :unicorn do
  desc "Start Unicorn"
  task start: :environment do
    queue 'echo "-----> Start Unicorn"'
    if branch == 'develop'
      queue! %{
        cd #{app_path}
        bundle exec unicorn_rails -E production -c config/unicorn_test.rb -D
      }
    elsif branch == 'master'
      queue! %{
        cd #{app_path}
        bundle exec unicorn_rails -E production -c config/unicorn_master.rb -D
      }
    end
  end

  desc "Stop Unicorn"
  task stop: :environment do
    queue 'echo "-----> Stop Unicorn"'
    queue! %{
      test -s "#{unicorn_pid}" && kill -QUIT `cat "#{unicorn_pid}"` && echo "Stop Ok" && exit 0
      echo >&2 "Not running"
    }
  end

  desc "Restart Unicorn"
  task restart: :environment do
    invoke :'unicorn:stop'
    invoke :'unicorn:start'
  end

end
