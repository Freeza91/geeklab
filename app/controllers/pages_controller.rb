class PagesController < ApplicationController

  before_action :detect_browser, only: :test
  layout false, only: :test

  def home
  end

  def test

    respond_to do |format|
      format.html do |html|
        html
        html.android
        html.ios
        html.windows
      end
    end
  end

private

  def detect_browser
    case request.user_agent
      when /iPad/i
        request.variant = :ios
      when /iPhone/i
        request.variant = :ios
      when /Android/i && /mobile/i
        request.variant = :android
      when /Android/i
        request.variant = :android
      when /Windows Phone/i
        request.variant = :windows
    end
  end

end
