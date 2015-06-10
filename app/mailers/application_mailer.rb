class ApplicationMailer < ActionMailer::Base

  default from: "geeklabs@geekpark.net"
  # layout 'user_mailer'
  layout false

  include SendGrid

  sendgrid_category :use_subject_lines
  sendgrid_enable   :ganalytics, :opentrack

end
