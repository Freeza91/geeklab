class ErrorsController < ApplicationController

  def file_not_found
    from = [root_path, pms_path, testers_path]
    path = (URI.parse request.original_url).path

    @path = if path.include?"testers"
        testers_path
      elsif path.include?"pms"
        pms_path
      else
        root_path
      end
    render 'errors/file_not_found'
  end

  def unprocessable
  end

  def internal_server_error
  end
end
