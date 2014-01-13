require "drop/version"
require "yajl"

module Drop
  ConfigurationError = Class.new(StandardError)

  def self.settings
    @settings ||= {
      :read_types => %w(),
      :write_types => %w(
        https://tent.io/types/file/v0
      ),
      :scopes => %w( permissions )
    }
  end

  def self.configure(options = {})
    ##
    # App registration settings
    self.settings[:name]        = options[:name]        || ENV['APP_NAME']        || 'Drop'
    self.settings[:description] = options[:description] || ENV['APP_DESCRIPTION'] || 'Simple file sharing app'
    self.settings[:display_url] = options[:display_url] || ENV['APP_DISPLAY_URL'] || 'https://github.com/tent/drop'

    ##
    # App settings
    self.settings[:url]                  = options[:url]                  || ENV['URL']
    self.settings[:path_prefix]          = options[:path_prefix]          || ENV['PATH_PREFIX']
    self.settings[:public_dir]           = options[:public_dir]           || ENV['ASSETS_DIR'] || File.expand_path('../../public/assets', __FILE__) # lib/../public/assets
    self.settings[:asset_root]           = options[:asset_root]           || ENV['ASSET_ROOT']
    self.settings[:asset_cache_dir]      = options[:asset_cache_dir]      || ENV['ASSET_CACHE_DIR']
    self.settings[:json_config_url]      = options[:json_config_url]      || ENV['JSON_CONFIG_URL']
    self.settings[:signin_url]           = options[:signin_url]           || ENV['SIGNIN_URL']
    self.settings[:signout_url]          = options[:signout_url]          || ENV['SIGNOUT_URL']
    self.settings[:signout_redirect_url] = options[:signout_redirect_url] || ENV['SIGNOUT_REDIRECT_URL']

    unless settings[:url]
      raise ConfigurationError.new("Missing url option, you need to set URL")
    end

    self.settings[:asset_manifest] = Yajl::Parser.parse(File.read(ENV['APP_ASSET_MANIFEST'])) if ENV['APP_ASSET_MANIFEST'] && File.exists?(ENV['APP_ASSET_MANIFEST'])

    # Default asset root
    self.settings[:asset_root] ||= "/assets"

    # Default config.json url
    self.settings[:json_config_url] ||= "#{self.settings[:url].to_s.sub(%r{/\Z}, '')}/config.json"

    # bypass oauth when true
    self.settings[:skip_authentication] = (options[:skip_authentication] == true) || (ENV['SKIP_AUTHENTICATION'] == 'true')

    # App registration, oauth callback uri
    self.settings[:redirect_uri] = "#{self.settings[:url].to_s.sub(%r{/\Z}, '')}/auth/tent/callback"

    # Default signout url
    self.settings[:signout_url] ||= "#{self.settings[:url].to_s.sub(%r{/\Z}, '')}/signout"

    # Default signout redirect url
    self.settings[:signout_redirect_url] ||= self.settings[:url].to_s.sub(%r{/?\Z}, '/')
  end

  def self.new(options = {})
    self.configure(options)

    require 'drop/app'

    unless self.settings[:skip_authentication]
      require 'drop/model'
      Model.new
    end

    App.new
  end
end
