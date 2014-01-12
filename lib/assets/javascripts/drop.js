//= require tent-client
//= require ./core
//= require ./config
//= require_self
//= require_tree ./routers
//= require_tree ./views
//= require_tree ./models
//= require_tree ./collections

(function () {

	var Drop = window.Drop;

	_.extend(Drop, Marbles.Events, Marbles.Accessors, {
		Views: {},
		Models: {},
		Collections: {},
		Routers: {},
		Helpers: {

			formatRelativeTime: function (milliseconds) {
				var time = moment(milliseconds);
				return time.fromNow();
			},

			formatDateTime: function (milliseconds) {
				var time = moment(milliseconds);
				return time.format();
			},

			formattedStorageAmount: function (size) {
				var d, units;
				if (size >= 1000000000) { // >= 1GB
					d = 1000000000;
					units = 'GB';
				} else if (size >= 1000000) { // >= 1MB
					d = 1000000;
					units = 'MB';
				} else if (size >= 1000) { // >= 1KB
					d = 1000;
					units = 'KB';
				} else { // < 1KB
					d = 1;
					units = ' bytes';
				}

				return ((parseInt((size / d) * 100) / 100) || 0) + units;
			},

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
