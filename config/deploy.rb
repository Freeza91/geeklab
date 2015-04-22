require 'mina/bundler'
require 'mina/rails'
require 'mina/git'
require 'mina/rvm' #rbenv

set :domain, '50.116.16.150'
set :branch, 'develop'

set :user, 'deploy'
set :forward_agent, true
set :port, 9527

set :deploy_to, '/home/deploy/geek-lab'
set :current_path, 'current'
set :app_path,  "#{deploy_to}/#{current_path}"

set :repository, 'git@github.com:GeekPark/GeekLab.git'
set :keep_releases, 20

set :unicorn_pid, lambda { "#{deploy_to}/#{shared_path}/tmp/pids/unicorn.pid" }

set :shared_paths, [
  'config/database.yml',
  'config/secrets.yml',
  'config/application.yml',
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
end

desc "Deploys the current version to the server."
task deploy: :environment do
  deploy do
    invoke :'git:clone'
    invoke :'deploy:cleanup'
    invoke :'deploy:link_shared_paths'
    invoke :'bundle:install'
    invoke :'rails:db_migrate'
    invoke :'rails:assets_precompile'

    to :launch do
      invoke :'unicorn:restart'
      queue "touch #{deploy_to}/tmp/restart.txt"
    end
  end
end

namespace :unicorn do
  desc "Start Unicorn"
  task start: :environment do
    queue 'echo "-----> Start Unicorn"'
    queue! %{
      cd #{app_path}
      bundle exec unicorn_rails -E production -c config/unicorn.rb -D
    }
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

namespace :assets do
  desc "assets clear"
  task clear: :environment do
    queue  %{
      cd #{app_path}
      bundle exec rake assets:clobber RAILS_ENV=production
    }
  end
end
