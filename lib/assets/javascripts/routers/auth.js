//= require ./mixins

(function () {

	"use strict";

	var AuthRouter = Marbles.Router.createClass({
		displayName: 'Drop.Routers.auth',

		mixins: [Drop.Routers.Mixins],

		routes: [
			{ path : "signin" , handler: "signin" },
			{ path : "signout" , handler: "signout" }
		],

		signin: function (params) {
			this.resetScrollPosition.call(this);

			var queryParams = params[0];
			if (queryParams.redirect && queryParams.redirect.indexOf('//') !== -1 && queryParams.redirect.indexOf('//') < queryParams.redirect.indexOf('/')) {
				queryParams.redirect = null;
			}
			if (!queryParams.redirect) {
				queryParams.redirect = Drop.config.PATH_PREFIX || '/';
			}

			function handleSignin() {
				Drop.once('config:ready', function () {
					if (Drop.config.authenticated) {
						Marbles.history.navigate(queryParams.redirect || '/');
					} else {
						Marbles.history.navigate(Marbles.history.path, { force: true, replace: true });
					}
				});
				Drop.fetchConfig();
			}

			React.renderComponent(
				Drop.Views.Auth({ signinURL: Drop.config.SIGNIN_URL, successHandler: handleSignin }),
				Drop.config.container_el
			);
		},

		signout: function () {
			new Marbles.HTTP({
				method: 'POST',
				url: Drop.config.SIGNOUT_URL,
				middleware: [Marbles.HTTP.Middleware.WithCredentials],
				callback: function () {
					if (Drop.config.SIGNOUT_REDIRECT_URL) {
						window.location.href = Drop.config.SIGNOUT_REDIRECT_URL;
					} else {
						Drop.fetchConfig();
						Marbles.history.navigate("signin", {replace:true});
					}
				}
			});
		}

	});

	Drop.Routers.auth = new AuthRouter();

})();
