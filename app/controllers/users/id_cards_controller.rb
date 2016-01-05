class Users::IdCardsController < ApplicationController

  before_action :require_login?

  def show
    @id_card = current_user.id_card
    if @id_card
      if @id_card.status
        render 'show'
      else
        render 'edit'
      end
    else
      @id_card = current_user.build_id_card
      render 'new'
    end

  end

  def create
    @id_card = current_user.build_id_card(id_cards_params)
    if @id_card.save
      render 'edit'
    else
      render 'new'
    end
  end

  def update
    @id_card = current_user.id_card
    if @id_card
      if @id_card.status # 已经不能再做修改
        render 'show'
      elsif @id_card.update_attributes(id_cards_params)
        render 'show'
      else
        render 'edit'
      end
    else
      render 'new'
    end
  end

  private

  def id_cards_params
    params.require(:id_card).permit(:name, :face, :back, :id_num)
  end

end