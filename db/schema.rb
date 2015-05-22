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

ActiveRecord::Schema.define(version: 20150522055828) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "assignments", force: :cascade do |t|
    t.integer "project_id"
    t.integer "tester_id"
    t.string  "status"
    t.string  "video"
  end

  create_table "projects", force: :cascade do |t|
    t.string   "name"
    t.string   "profile"
    t.string   "device",                    array: true
    t.string   "requirement",               array: true
    t.string   "qr_code"
    t.string   "platform",                  array: true
    t.string   "desc"
    t.datetime "expired_at"
    t.string   "contact_name"
    t.string   "phone"
    t.string   "email"
    t.string   "company"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
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
  end

  add_index "users", ["auth_token"], name: "index_users_on_auth_token", unique: true, using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
