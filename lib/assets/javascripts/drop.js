//= require tent-client
//= require ./core
//= require ./config
//= require_self
//= require_tree ./routers
//= require_tree ./views
//= require_tree ./models

(function () {

	var Drop = window.Drop;

	_.extend(Drop, Marbles.Events, Marbles.Accessors, {
		Views: {},
		Models: {},
		Collections: {},
		Routers: {},
		Helpers: {

			fullPath: function (path) {
				prefix = Drop.config.PATH_PREFIX || '/';
				return (prefix + '/').replace(/\/+$/, '') + path;
			}

		},

		run: function (options) {
			if (!Marbles.history || Marbles.history.started) {
				return;
			}

			if (!options) {
				options = {};
			}

			if (!this.config.container) {
				this.config.container_el = document.getElementById('main');
			}

			this.set('current_entity', this.config.meta.content.entity);
			this.client = new TentClient(this.current_entity, {
				serverMetaPost: this.config.meta,
				credentials: this.config.credentials
			});

			this.initAppNav();

			// cleanup unwanted views before each route's handler is called
			Marbles.history.on('handler:before', function (handler, fragment, params) {
				React.unmountComponentAtNode(Drop.config.container_el);
			});

			Marbles.history.start(_.extend({ root: (this.config.PATH_PREFIX || '') + '/' }, options.history || {}));

			this.ready = true;
			this.trigger('ready');
		},

		initAppNav: function (options) {
			var appNav = React.renderComponent(
				Drop.Views.AppNav({}),
				document.getElementById('main-nav')
			);

			Marbles.history.on("handler:before", function (handler, fragment, params) {
				appNav.setState({
					activeFragment: fragment
				});
			});
		}
	});

	if (Drop.config_ready) {
		Drop.trigger('config:ready');
	}

})();
