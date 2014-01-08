(function () {

	function MainRouter () {
		var _ref = MainRouter.__super__.constructor.apply(this, arguments);
		return _ref;
	}

	Drop.Utils.extends(MainRouter, Marbles.Router);

	MainRouter.routes = {
		""            : "root",
		"uploads/new" : "createUpload",
		"manage"			: "manage"
	};

	MainRouter.prototype.resetScrollPosition = function () {
		var hash_fragment = window.location.hash;
		window.scrollTo(0, 0);
		if (hash_fragment !== '') {
			window.location.hash = hash_fragment;
		}
	};

	MainRouter.prototype.root = function (params) {
		this.navigate("uploads/new", { trigger: true, replace: true });
	};

	MainRouter.prototype.createUpload = function (params) {
		this.resetScrollPosition.call(this);

		React.renderComponent(
			Drop.Views.Upload({}),
			Drop.config.container_el
		);
	};

	MainRouter.prototype.manage = function (params) {
		this.resetScrollPosition.call(this);
	};

	Drop.Routers.main = new MainRouter();

})();
