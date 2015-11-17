class Users::OmniauthCallbacksController < ApplicationController

  def self.provides_callback_for(* providers)

    providers.each do |provider|
      class_eval %{

        def #{provider}
          p "hello
          p env["omniauth.auth"]
          render '/users/auth'
        end

      }
    end

  end

  provides_callback_for :geekpark # can add other providers, like github, qq, weibo etc

end