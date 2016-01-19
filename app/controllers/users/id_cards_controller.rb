class Users::IdCardsController < ApplicationController

  before_action :require_login?

  def show
    @id_card = current_user.id_card
    json = { status: 0, code: 1 }
    if @id_card
      respond_to do |format|
        format.html do
          render 'show'
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
    if @id_card.save
      render 'edit'
    else
      #render 'new'
      json =  { status: 0, code: 2, msg: '保存失败' }
      render json: json
    end
  end

  def update
    @id_card = current_user.id_card
    json =  { status: 0, code: 1 }
    if @id_card
      if @id_card.status == 'success' # 已经不能再做修改
        #render 'show'
        json[:code], json[:msg] = 2, '不能再修改'
        render json:json
      elsif @id_card.update_attributes(id_cards_params)
        #render 'show'
        render json: json
      else
        #render 'edit'
        json[:code], json[:msg] = 3, '保存失败'
        render json: json
      end
    else
      json[:code], json[:msg] = 4, '未创建'
      render json: json
      #render 'new'
    end
  end

  private

  def id_cards_params
    params.permit(:name, :face, :back, :id_num)
  end

end
