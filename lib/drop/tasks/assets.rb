require 'drop/compiler'

def configure_app
  return if @app_configured
  @app_configured = true
  Drop.configure
end

namespace :assets do
  task :configure do
    configure_app
  end

  task :compile do
    Drop::Compiler.compile_assets
  end

  task :gzip do
    Drop::Compiler.gzip_assets
  end

  # deploy assets when deploying to heroku
  task :precompile => :gzip
end
