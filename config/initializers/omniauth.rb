OmniAuth.config.path_prefix = '/users/authorize'

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :geekpark, Settings.GEEKPARK_KEY, Settings.GEEKPARK_SECRET
end