require 'tent-client'
require 'securerandom'
require 'drop/utils'

module Drop
  module Model

    class User
      def self.find(id)
        if data = Model.find(id)
          new(data)
        end
      end

      def self.lookup(entity)
        if data = Model.lookup(entity)
          new(data)
        end
      end

      def self.create(entity, app)
        if data = lookup(entity)
          user = new(data)
          user.update(:app => app)
        else
          user = new({
            :entity => entity,
            :app => app
          })
          user.save
        end
        user
      end

      def initialize(data)
        @data = data
        @data[:id] ||= SecureRandom.hex(32)
      end

      def data
        @data
      end

      def save
        Model.persist(self)
      end

      def update(data)
        data.each_pair do |key, val|
          self[key] = val
        end
        save
      end

      def []=(key, val)
        @data[key.to_sym] = val
      end

      def [](key)
        @data[key.to_sym]
      end

      def has_key?(key)
        @data.has_key?(key.to_sym)
      end

      def method_missing(method, *args, &block)
        if has_key?(method)
          self[method]
        else
          super
        end
      end

      def update_authorization(credentials)
        update(:auth => {
          :id => credentials[:id],
          :hawk_key => credentials[:hawk_key],
          :hawk_algorithm => credentials[:hawk_algorithm]
        })
        auth
      end

      def app_client
        @app_client ||= ::TentClient.new(entity, :credentials => app[:credentials].merge(:id => app[:credentials][:hawk_id]))
      end

      def client
        @client ||= ::TentClient.new(entity, :credentials => auth)
      end

      def app_exists?
        res = app_client.post.get(app[:entity], app[:id])
        res.success?
      end

      def server_meta_post
        @server_meta_post ||= begin
          post = Utils::Hash.symbolize_keys(client.server_meta_post)
          if post && post[:content][:entity] != entity
            self.update(:entity => post[:content][:entity])
          end
          post
        end
      end

      def json_config
        {
          :credentials => auth,
          :meta => server_meta_post,
          :app_auth => {
            :id => auth[:id]
          },
          :protected_apps => [app[:id]]
        }
      end
    end

  end
end
