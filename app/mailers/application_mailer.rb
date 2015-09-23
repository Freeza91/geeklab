class ApplicationMailer < ActionMailer::Base

  default from: '"极客实验室"<geeklabs@geekpark.net>'

  # layout 'user_mailer'
  layout false

  include SendGrid

  sendgrid_category :use_subject_lines
  sendgrid_enable   :ganalytics, :opentrack

end
