ActionMailer::Base.smtp_settings = {
  address:              'smtp.sendgrid.net',
  port:                 587,
  domain:               '50.116.16.150',
  user_name:            Settings.sendgrid_username,
  password:             Settings.sendgrid_password,
  authentication:       'plain',
  enable_starttls_auto: true

}
