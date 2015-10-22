# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151022090855) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "addresses", force: :cascade do |t|
    t.string   "name"
    t.string   "tel"
    t.string   "location"
    t.integer  "user_id"
    t.integer  "order_id"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.string   "addition"
    t.string   "status",     default: "wait_send"
  end

  create_table "assignments", force: :cascade do |t|
    t.integer  "project_id"
    t.integer  "tester_id"
    t.string   "status"
    t.string   "video"
    t.boolean  "is_transfer",       default: false
    t.boolean  "is_sexy",           default: false
    t.string   "reasons",                           array: true
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_read",           default: false
    t.boolean  "public",            default: false
    t.integer  "rating_from_pm"
    t.integer  "rating_from_admin"
  end

  create_table "comments", force: :cascade do |t|
    t.boolean "target_user"
    t.integer "assignment_id"
    t.boolean "qualified"
  end

  create_table "credit_records", force: :cascade do |t|
    t.integer  "project_id"
    t.integer  "tester_id"
    t.integer  "assignment_id"
    t.integer  "credits"
    t.integer  "bonus_credits"
    t.integer  "rating"
    t.string   "rating_type"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.boolean  "used",          default: false
  end

  add_index "credit_records", ["tester_id", "assignment_id"], name: "index_credit_records_on_tester_id_and_assignment_id", unique: true, using: :btree

  create_table "feedbacks", force: :cascade do |t|
    t.string   "timeline"
    t.string   "desc"
    t.string   "suggestion"
    t.integer  "assignment_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "goods", force: :cascade do |t|
    t.string   "name"
    t.text     "describle"
    t.float    "cost"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.string   "status"
    t.boolean  "is_publish", default: false
    t.boolean  "is_limit",   default: false
    t.integer  "stock",      default: 0
    t.integer  "used_num",   default: 0
    t.string   "label"
  end

  create_table "orders", force: :cascade do |t|
    t.string   "good_name"
    t.float    "total_cost"
    t.integer  "good_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "user_id"
    t.string   "order_id"
    t.string   "good_url"
    t.integer  "sku_id"
  end

  create_table "pictures", force: :cascade do |t|
    t.integer  "pictureable_id"
    t.string   "pictureable_type"
    t.string   "url"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  create_table "projects", force: :cascade do |t|
    t.string   "name"
    t.string   "profile"
    t.string   "device"
    t.string   "requirement"
    t.string   "qr_code"
    t.string   "platform"
    t.string   "desc"
    t.datetime "expired_at"
    t.string   "contact_name"
    t.string   "phone"
    t.string   "email"
    t.string   "company"
    t.datetime "created_at",                                   null: false
    t.datetime "updated_at",                                   null: false
    t.integer  "credit"
    t.integer  "demand",       default: 1
    t.integer  "pm_id"
    t.string   "status",       default: "wait_check"
    t.string   "reasons",                                                   array: true
    t.boolean  "beginner",     default: false
    t.datetime "assign_time",  default: '2015-03-02 00:00:00'
    t.integer  "basic_bonus",  default: 0
  end

  create_table "skus", force: :cascade do |t|
    t.json     "attr"
    t.uuid     "uuid"
    t.integer  "good_id"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "addition"
    t.integer  "num",        default: 0
  end

  create_table "tasks", force: :cascade do |t|
    t.string   "content"
    t.integer  "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tester_infors", force: :cascade do |t|
    t.integer  "tester_id"
    t.string   "username",         default: "tester-6"
    t.string   "sex"
    t.string   "birthday"
    t.string   "birthplace"
    t.string   "livingplace"
    t.string   "device",                                             array: true
    t.string   "emotional_status"
    t.string   "sex_orientation"
    t.string   "education"
    t.string   "profession"
    t.string   "income"
    t.string   "personality",                                        array: true
    t.string   "interest",                                           array: true
    t.string   "email_contract"
    t.string   "mobile_phone"
    t.string   "wechat"
    t.string   "ali_pay"
    t.datetime "created_at",                            null: false
    t.datetime "updated_at",                            null: false
  end

  create_table "user_features", force: :cascade do |t|
    t.string   "age"
    t.string   "income"
    t.string   "sex",                           array: true
    t.integer  "city_level",                    array: true
    t.string   "education",                     array: true
    t.string   "emotional_status",              array: true
    t.string   "sex_orientation",               array: true
    t.string   "interest",                      array: true
    t.string   "profession",                    array: true
    t.string   "personality",                   array: true
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.integer  "project_id"
  end

  create_table "users", force: :cascade do |t|
    t.string   "username"
    t.string   "email",                  default: "",                    null: false
    t.string   "encrypted_password",     default: "",                    null: false
    t.boolean  "approved",               default: false
    t.string   "role"
    t.string   "auth_token"
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "last_view_time",         default: '2015-05-21 11:37:35'
    t.integer  "credits",                default: 0
    t.datetime "approved_time",          default: '2015-07-28 18:03:00'
    t.integer  "admin",                  default: 0
    t.datetime "last_login"
    t.boolean  "limit_user",             default: false
  end

  add_index "users", ["auth_token"], name: "index_users_on_auth_token", unique: true, using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
