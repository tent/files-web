module Drop
  class App
    class Middleware < Rack::Putty::Middleware

      class Halt < StandardError
        attr_accessor :code, :message, :headers, :body
        def initialize(code, message=nil)
          super(message)
          @code, @message = code, message
          @headers = { 'Content-Type' => 'text/plain' }
          @body = message.to_s
        end

        def to_response
          [code, headers, [body]]
        end
      end

      def call(env)
        super
      rescue Halt => e
        e.to_response
      end

      def halt!(code, message)
        raise Halt.new(code, message)
      end

      def redirect(location)
        [302, { 'Location' => location }, []]
      end

      def redirect!(location)
        halt = Halt.new(302)
        halt.headers = { 'Location' => location.to_s }
        raise halt
      end

      def read_input(env)
        data = env['rack.input'].read
        env['rack.input'].rewind
        data
      end

    end
  end
end
