class RailsAdminPgIntArray < RailsAdmin::Config::Fields::Base
  register_instance_option :formatted_value do
    if value.nil?
      value
    else
      value.join(',')
    end

  end

  def parse_input(params)
    if params[name].is_a?(::String)
      params[name] = params[name].split(',').collect{|x| x}
    end
  end
end

RailsAdmin::Config::Fields::Types::register(:pg_int_array, RailsAdminPgIntArray)