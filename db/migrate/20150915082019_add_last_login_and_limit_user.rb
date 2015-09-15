class AddLastLoginAndLimitUser < ActiveRecord::Migration
  def change
    add_column :users, :last_login, :datetime
    add_column :users, :limit_user, :boolean, default: false
  end
end
