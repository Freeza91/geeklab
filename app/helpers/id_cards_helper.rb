module IdCardsHelper

  INFO = {
    failed: '审核不通过',
    success: '已认证',
    wait_check: '正在审核'
  }

  def dashboard_id_cards_status(status)
    INFO[status.to_sym]
  end

  def dashboard_select_options
    INFO.map {|hash| [hash.last, hash.first] }
  end

  def idcardStatus(id_card)
    if id_card
      INFO[id_card.status.to_sym]
    else
      '未认证'
    end
  end

end
