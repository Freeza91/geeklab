class Dashboard::GoodsController < Dashboard::BaseController

  load_and_authorize_resource

  def index
    @goods = Good.order('updated_at desc').page(params[:page]).per(10)
    @q = Good.order('updated_at desc').ransack(params[:q])
  end

  def new
    type = params[:type]
    @good = Good.new
    case type
    when 'real'
      @good.label = '1'
    when 'virtual'
      @good.label = '0'
    end
  end

  def create
    @good = Good.new(good_params)
    if @good.save
      redirect_to dashboard_goods_path
    else
      render :new
    end
  end

  def edit
    @good = Good.find params[:id]
  end

  def update
    @good = Good.find params[:id]
    if @good.update_attributes(good_params)
      redirect_to dashboard_goods_path
    else
      render :edit
    end
  end

  def destroy
    @good = Good.find params[:id]
    @good && @good.destroy
    redirect_to dashboard_goods_path
  end

  def search
    @goods = Good.order('updated_at desc').ransack(params[:q])
                 .result.page(params[:page]).per(10)
    @q = Good.order('updated_at desc').ransack(params[:q])

    render :index
  end

private

  def good_params
    params.require(:good).permit(:name, :describle, :cost, :status,
                                 :is_publish, :is_limit, :label,
                                 pictures_attributes: [:id, :_destroy, :url])

  end

end