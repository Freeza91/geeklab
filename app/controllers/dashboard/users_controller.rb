class Dashboard::UsersController < Dashboard::BaseController

  load_and_authorize_resource

  def index
    @users = User.order('id desc').page(params[:page]).per(10)
  end

  def edit
    @user = User.find params[:id]
  end

  def update
    @user = User.find params[:id]
    if @user && @user.update_attributes(user_params)
      redirect_to dashboard_users_path
    else
      render :edit
    end
  end

  def destroy
    @user = User.find params[:id]
    @user && @user.destroy

    redirect_to dashboard_users_path
  end

private

  def user_params
    params.require(:user).permit(:approved, :credits, :limit_user, :admin)
  end

end