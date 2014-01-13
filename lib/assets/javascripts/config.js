//= require ./core
//= require ./static_config
//= require_self

(function () {

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
					throw Error("failed to fetch json config: " + xhr.status + " - " + JSON.stringify(res));
				}

				if (!Drop.config) {
					Drop.config = {};
				}

				for (var key in res) {
					Drop.config[key] = res[key];
				}

				Drop.config_ready = true;
				Drop.trigger('config:ready');
			}
		});
	};

	Drop.fetchConfig();

})();
