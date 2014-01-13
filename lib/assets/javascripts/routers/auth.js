//= require ./mixins

(function () {

	var AuthRouter = Marbles.Router.createClass({
		displayName: 'Drop.Routers.auth',

		mixins: [Drop.Routers.Mixins],

		routes: [
			{ path : "signin" , handler: "signin" }
		],

		signin: function (params) {
			this.resetScrollPosition.call(this);

			function handleSignin() {
				Drop.once('config:ready', function () {
					if (Drop.config.authenticated) {
						Drop.handleAuthenticated();
						Marbles.history.navigate(params[0].redirect || '/');
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
		}
	});

	Drop.Routers.auth = new AuthRouter();

})();
