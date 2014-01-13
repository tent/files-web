lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)

require 'bundler'
Bundler.require

$stdout.sync = true

require 'drop'

map '/' do
  use Rack::Session::Cookie,  :key => 'drop.session',
                              :expire_after => 2592000, # 1 month
                              :secret => ENV['SESSION_SECRET'] || SecureRandom.hex
  run Drop.new
end
