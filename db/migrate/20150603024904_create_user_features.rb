class CreateUserFeatures < ActiveRecord::Migration
  def change
    create_table :user_features do |t|
      t.string     :age
      t.string     :income
      t.string     :sex,              array: true
      t.integer    :city_level,       array: true
      t.string     :education,        array: true
      t.string     :emotional_status, array: true
      t.string     :sex_orientation,  array: true
      t.string     :interest,         array: true
      t.string     :profession,       array: true
      t.string     :personality,      array: true

      t.timestamps null: false
    end
  end
end