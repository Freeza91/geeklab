class Dashboard::ChartsController < Dashboard::BaseController

  def index
  end

  def select
    json = { code: 1, msg: 'success', days: [], weeks: [], months: []}

    render json: get_data(json)
  end

private

  def get_data(json)

    start_at = params[:start_at] || Time.new(2015, 3, 2)
    end_at = params[:end_at] || Time.now

    register_num = 0
    approved_num = 0
    finish_info_num = 0
    user = nil
    days = []
    day = {}
    weeks = []
    week = {}
    months = []
    month = {}

    users = User.order_by_created.during_time(start_at, end_at).to_a
    register_num = users.size

    first_created_at = start_at.to_date
    last_created_at = end_at.to_date
    current_week = first_created_at.strftime("第%-W周")
    current_month = first_created_at.strftime("第%-m月")
    pre_week_index = first_created_at.strftime("第%-W周")
    pre_month_index = first_created_at.strftime("第%-W周")

    week[pre_week_index] = 0
    month[pre_month_index] = 0

    first_created_at.upto(last_created_at) do |day|
      current_day = day
      day_index = current_day.strftime("%-m月%-e日")

      day = {}
      day[day_index] = 0

      register_num.times do |i|
        if users.size > 0
          user = users.pop unless user
          user_day = user.created_at.to_date

          tester = user.to_tester
          if tester
            if info = tester.tester_infor
              finish_info_num += 1 if info.already_finish
            end
            approved_num += 1 if tester.approved
          end

          if current_day == user_day
            day[day_index] += 1
            user = nil
          else
            break
          end
        else
          break
        end
      end
      days << day

      week_index = current_day.strftime("第%-W周")
      unless week[week_index]
        week = {}
        week[week_index] = 0
        weeks << week if week
        pre_week_index = week_index
      end
      week[week_index] += day[day_index]

      month_index = current_day.strftime("第%-m月")
      unless month[month_index]
        month = {}
        month[month_index] = 0
        months << month if month
        pre_month_index = month_index
      end
      month[month_index] += day[day_index]
    end

    weeks << week if week
    days << month if month

    json[:days], json[:weeks], json[:months] = parse_hash_arr(days), parse_hash_arr(weeks),  parse_hash_arr(months)
    json[:register_num], json[:approved_num], json[:finish_info_num] =
    register_num, finish_info_num, approved_num

    json
  end

  def parse_hash_arr(arr)
    arr.collect {|a| a.values.first }
  end

end