require "drop/version"
require "yajl"

module Drop
  ConfigurationError = Class.new(StandardError)

  def self.settings
    @settings ||= {}
  end

  def self.configure(options = {})
    ##
    # App settings
    self.settings[:url]                  = options[:url]                  || ENV['URL']
    self.settings[:path_prefix]          = options[:path_prefix]          || ENV['PATH_PREFIX']
    self.settings[:public_dir]           = options[:public_dir]           || ENV['ASSETS_DIR'] || File.expand_path('../../public/assets', __FILE__) # lib/../public/assets
    self.settings[:asset_root]           = options[:asset_root]           || ENV['ASSET_ROOT']
    self.settings[:asset_cache_dir]      = options[:asset_cache_dir]      || ENV['ASSET_CACHE_DIR']
    self.settings[:json_config_url]      = options[:json_config_url]      || ENV['JSON_CONFIG_URL']

    unless settings[:url]
      raise ConfigurationError.new("Missing url option, you need to set URL")
    end

    self.settings[:asset_manifest] = Yajl::Parser.parse(File.read(ENV['APP_ASSET_MANIFEST'])) if ENV['APP_ASSET_MANIFEST'] && File.exists?(ENV['APP_ASSET_MANIFEST'])

    # Default asset root
    self.settings[:asset_root] ||= "/assets"

    # Default config.json url
    self.settings[:json_config_url] ||= "#{self.settings[:url].to_s.sub(%r{/\Z}, '')}/config.json"
  end

  def self.new(options = {})
    self.configure(options)

    require 'drop/app'

    App.new
  end
end
