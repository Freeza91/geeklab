class Stores::SkusController < ApplicationController

  before_filter :authenticate
  before_action :find_good

  def index
    @skus = @good.skus
  end

  def new
    @sku = @good.skus.build
  end

  def create
    @sku = @good.skus.build(sku_params)
    if @sku.save
      redirect_to stores_good_sku_path(@sku)
    else
      render :new
    end
  end

  def show
    @sku = @good.find_by(id: params[:id])
  end

  def edit
    @sku = @good.find_by(id: params[:id])
  end

  def update
    @sku = @good.find_by(id: params[:id])
    if @sku.update_attributes(sku_params)
      redirect_to stores_good_sku_path(@sku)
    else
      render :edit
    end
  end

  def destory
    @sku = @good.find_by(id: params[:id])
    @sku.destory
    redirect_to stores_good_path(@good)
  end

private

  def sku_params
    params(:sku).permit(:attr, :status, :addition)
  end

  def find_good
    @good = Good.find_by(id: params[:good_id])
    redirect_to stores_root_path unless @good
  end

end
