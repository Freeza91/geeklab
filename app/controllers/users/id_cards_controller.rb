class Users::IdCardsController < ApplicationController

  before_action :require_login?

  def show
    @id_card = current_user.id_card
    json = { status: 0, code: 1 }
    if @id_card
      respond_to do |format|
        format.html do
        end
        format.json do
          json[:id_card] = @id_card.to_json
          render json: json
        end
      end
    end
  end

  def edit
    @edit = false
    if current_user.id_card && current_user.id_card.status == 'failed'
      @edit = true
    end
  end

  def create
    @id_card = current_user.build_id_card(id_cards_params)
    json =  { status: 0, code: 1}
    if @id_card.save
      render json: json
    else
      json[:code], json[:msg] = 2, '保存失败'
      render json: json
    end
  end

  def update
    @id_card = current_user.id_card
    json =  { status: 0, code: 1 }
    if @id_card
      if @id_card.status == 'success' # 已经不能再做修改
        json[:code], json[:msg] = 3, '不能再修改'
        render json:json
      elsif @id_card.update_attributes(id_cards_params)
        render json: json
      else
        json[:code], json[:msg] = 2, '保存失败'
        render json: json
      end
    else
      json[:code], json[:msg] = 4, '未创建'
      render json: json
    end
  end

  private

  def id_cards_params
    params.permit(:name, :face, :back, :id_num)
  end

end
