lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)

require 'bundler'
Bundler.require

$stdout.sync = true

require 'drop'

map '/' do
  run Drop.new
end
