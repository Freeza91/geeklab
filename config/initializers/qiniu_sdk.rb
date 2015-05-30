#!/usr/bin/env ruby

require 'qiniu'

Qiniu.establish_connection! :access_key => Settings.qiniu_access_key,
                            :secret_key => Settings.qiniu_secret_key