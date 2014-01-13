require 'bundler/setup'

lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)

require 'drop/tasks/assets'
require 'drop/tasks/layout'

task :compile => ["assets:precompile", "layout:compile"] do
end
