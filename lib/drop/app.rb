require 'rack-putty'
require 'securerandom'

module Drop
  class App
    require 'drop/app/middleware'
    require 'drop/app/serialize_response'
    require 'drop/app/asset_server'
    require 'drop/app/render_view'

    AssetServer.asset_roots = [
      File.expand_path('../../assets', __FILE__), # lib/assets
      File.expand_path('../../../vendor/assets', __FILE__) # vendor/assets
    ]

    RenderView.view_roots = [
      File.expand_path(File.join(File.dirname(__FILE__), '..', 'views')), # lib/views
      File.expand_path(File.join(File.dirname(__FILE__), '..', '..'))  # project root
    ]

    include Rack::Putty::Router

    stack_base SerializeResponse

    class MainApplication < Middleware
      def action(env)
        env['response.view'] = 'application'
        env
      end
    end

    class Favicon < Middleware
      def action(env)
        env['REQUEST_PATH'].sub!(%r{/favicon}, "/assets/favicon")
        env['params'][:splat] = 'favicon.ico'
        env
      end
    end

    class CacheControl < Middleware
      def action(env)
        env['response.headers'] ||= {}
        env['response.headers'].merge!(
          'Cache-Control' => @options[:value].to_s,
          'Vary' => 'Cookie'
        )
        env
      end
    end

    class AccessControl < Middleware
      def action(env)
        env['response.headers'] ||= {}
        if @options[:allow_credentials]
          env['response.headers']['Access-Control-Allow-Credentials'] = 'true'
        end
        env['response.headers'].merge!(
          'Access-Control-Allow-Origin' => 'self',
          'Access-Control-Allow-Methods' => 'DELETE, GET, HEAD, PATCH, POST, PUT',
          'Access-Control-Allow-Headers' => 'Cache-Control, Pragma',
          'Access-Control-Max-Age' => '10000'
        )
        env
      end
    end

    class ContentSecurityPolicy < Middleware
      def action(env)
        env['response.headers'] ||= {}
        env['response.headers']["Content-Security-Policy"] = content_security_policy
        env
      end

      def content_security_policy
        [
          "default-src 'self'",
          "object-src 'none'",
          "img-src *",
          "connect-src *"
        ].join('; ')
      end
    end

    get '/assets/*' do |b|
      b.use AssetServer
    end

    get '/favicon.ico' do |b|
      b.use Favicon
      b.use AssetServer
    end

    get '/config.json' do |b|
      b.use AccessControl, :allow_credentials => true
      b.use CacheControl, :value => 'no-cache'
      b.use CacheControl, :value => 'private, max-age=600'
      b.use RenderView, :view => :'config.json', :content_type => "application/json"
    end

    get '*' do |b|
      b.use ContentSecurityPolicy
      b.use MainApplication
      b.use RenderView
    end
  end
end
