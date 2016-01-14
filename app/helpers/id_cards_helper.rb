module IdCardsHelper

  INFO = {
    failed: '认证失败',
    success: '认证成功',
    wait_check: '等待审核'
  }

  def dashboard_id_cards_status(status)
    INFO[status.to_sym]
  end

  def dashboard_select_options
    INFO.map {|hash| [hash.last, hash.first] }
  end

end