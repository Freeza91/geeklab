class Dashboard::IdCardsController < Dashboard::BaseController

  load_and_authorize_resource

  def index
    @id_cards = IdCard.page(params[:page])
  end

  def edit
    @id_card = IdCard.find params[:id]
  end

  def update
    @id_card = IdCard.find params[:id]
    if @id_card.update_attributes(id_cards_params)
      redirect_to dashboard_id_cards_path
    else
      render :edit
    end
  end

  def destroy
    @id_card = IdCard.find params[:id]
    @id_card && @id_card.destroy

    redirect_to dashboard_id_cards_path
  end

private

  def id_cards_params
    params.require(:id_card).permit(:status, :reason)
  end

end
