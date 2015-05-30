class ErrorsController < ApplicationController

  def file_not_found
    from = [root_path, pms_path, testers_path]
    path = URI.parse(request.referer || root_url).path
    referer = from.include?(path) ? path : root_path
    @path = referer
    render 'errors/file_not_found'
  end

  def unprocessable
  end

  def internal_server_error
  end
end
