//= require ./core
//= require ./static_config
//= require_self

(function () {

	"use strict";

	if (!Drop.config.JSON_CONFIG_URL) {
		throw Error("json_config_url is required!");
	}

	Drop.fetchConfig = function () {
		new Marbles.HTTP({
			method: 'GET',
			url: Drop.config.JSON_CONFIG_URL,
			middleware: [
				Marbles.HTTP.Middleware.WithCredentials,
				Marbles.HTTP.Middleware.SerializeJSON
			],
			callback: function (res, xhr) {
				if (xhr.status !== 200) {
					if (Drop.config.SIGNIN_URL && xhr.status === 401) {
						Drop.config.authenticated = false;
						Drop.config_ready = true;
						Drop.trigger('config:ready');
						return;
					} else {
						throw Error("failed to fetch json config: " + xhr.status + " - " + JSON.stringify(res));
					}
				} else {
					Drop.config.authenticated = true;
				}

				for (var key in res) {
					if (res.hasOwnProperty(key)) {
						Drop.config[key] = res[key];
					}
				}

				if (!Drop.config.meta) {
					throw Error("invalid config! missing meta post: " + JSON.stringify(res));
				}

				Drop.config_ready = true;
				Drop.trigger('config:ready');
			}
		});
	};

	Drop.fetchConfig();

})();
