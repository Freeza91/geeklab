class Users::PaysController < ApplicationController

  include AliPayable
  include WxPayable

  def test
  end

end
