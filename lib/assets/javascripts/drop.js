//= require tent-client
//= require tent-markdown
//= require ./core
//= require ./config
//= require_self
//= require_tree ./props
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
		Props: {},
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
			},

			shortenURL: function (url, callback) {
				if (!Drop.config.SHORTENER_URL) {
					callback(url);
					return;
				}

				new Marbles.HTTP({
					method: 'POST',
					url: Drop.config.SHORTENER_URL,
					middleware: [Marbles.HTTP.Middleware.SerializeJSON],
					body: {
						long_url: url
					},
					headers: {
						'Content-Type': 'application/json'
					},
					callback: function (res, xhr) {
						if (xhr.status === 200) {
							callback(res.short_url);
						} else {
							callback(url);
							setTimeout(function () {
								throw Error("Drop.Helpers.shortenURL: "+ xhr.status +" - "+ JSON.stringify(res));
							}, 0);
						}
					}
				});
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

			if (this.config.authenticated) {
				this.handleAuthenticated();
			}

			this.initAppNav();
			this.initAuthButton();
			this.initAlerts();

			// cleanup unwanted views before each route's handler is called
			Marbles.history.on('handler:before', function (handler, fragment, params) {
				React.unmountComponentAtNode(Drop.config.container_el);
			});

			Marbles.history.start(Marbles.Utils.extend({ root: (this.config.PATH_PREFIX || '') + '/', silent: true }, options.history || {}));

			if (this.config.authenticated || Marbles.history.path.match(/^[^a-z]*signin[^a-z]/)) {
				Marbles.history.loadURL();
			} else {
				Marbles.history.navigate(this.Helpers.fullPath('/signin?redirect='+ Marbles.history.path), { replace: true });
			}

			this.ready = true;
			this.trigger('ready');
		},

		handleAuthenticated: function () {
			this.set('current_entity', this.config.meta.content.entity);
			this.client = new TentClient(this.current_entity, {
				serverMetaPost: this.config.meta,
				credentials: this.config.credentials
			});
			this.trigger('change:authenticated', true);
		},

		initAppNav: function () {
			var appNav = React.renderComponent(
				Drop.Views.AppNav({
					authenticated: this.config.authenticated
				}),
				document.getElementById('main-nav')
			);

			this.on('change:authenticated', function (authenticated) {
				appNav.setProps({ authenticated: authenticated });
			});

			Marbles.history.on("handler:before", function (handler, fragment, params) {
				appNav.setState({
					activeFragment: fragment
				});
			});
		},

		initAuthButton: function () {
			if (!Drop.config.SIGNOUT_URL) {
				return;
			}

			var authBtn = React.renderComponent(
				Drop.Views.AuthButton({
					authenticated: this.config.authenticated,
					signoutURL: this.config.SIGNOUT_URL,
					handleSignout: function () {
						window.location.href = this.config.SIGNOUT_REDIRECT_URL
					}.bind(this)
				}),
				document.getElementById('auth-button')
			);

			this.on('change:authenticated', function (authenticated) {
				authBtn.setProps({ authenticated: authenticated });
			});
		},

		initAlerts: function () {
			if (!this.config.ALERT_DISMISS_URL) {
				return;
			}

			var alerts = React.renderComponent(
				Drop.Views.Alerts({
					alerts: this.config.alerts || [],
					dismissURL: this.config.ALERT_DISMISS_URL
				}),
				document.getElementById('alerts')
			);

			this.on('change:authenticated', function () {
				alerts.setProps({
					alerts: this.config.alerts || []
				});
			}, this);
		}
	});

	if (Drop.config_ready) {
		Drop.trigger('config:ready');
	}

})();
