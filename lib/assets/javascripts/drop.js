//= require ./core
//= require ./config
//= require_self
//= require_tree ./routers
//= require_tree ./views
//= require_tree ./models

(function () {

	var Drop = window.Drop;

	_.extend(Drop, Marbles.Events, {
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
				this.config.container = {
					el: document.getElementById('main')
				};
			}

			Marbles.history.start(_.extend({ root: (this.config.PATH_PREFIX || '') + '/' }, options.history || {}));

			this.ready = true;
			this.trigger('ready');
		}
	});

	if (Drop.config_ready) {
		Drop.trigger('config:ready');
	}

})();
