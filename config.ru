require 'bundler'
Bundler.require

$stdout.sync = true

require './config'

require 'static-sprockets/app'
map '/' do
  use Rack::Session::Cookie,  :key => 'drop.session',
                              :expire_after => 2592000, # 1 month
                              :secret => ENV['SESSION_SECRET'] || SecureRandom.hex
  run StaticSprockets::App.new
end
