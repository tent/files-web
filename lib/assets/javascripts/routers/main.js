(function () {

	var MainRouter = Marbles.Router.createClass({
		displayName: 'Drop.Routers.main',

		routes: [
			{ path : ""            , handler: "root" },
			{ path : "uploads/new" , handler: "createUpload" },
			{ path : "manage"      , handler: "manage" }
		],

		resetScrollPosition: function () {
			var hash_fragment = window.location.hash;
			window.scrollTo(0, 0);
			if (hash_fragment !== '') {
				window.location.hash = hash_fragment;
			}
		},

		root: function (params) {
			this.navigate("uploads/new", { trigger: true, replace: true });
		},

		createUpload: function (params) {
			this.resetScrollPosition.call(this);

			var file = Drop.Models.File.findOrInit({
				id: 'new',
				entity: Drop.current_entity
			});

			function handleSaveSuccess () {
				// file successfully uploaded
				this.navigate("manage", { trigger: true });
			}
			file.once('save:success', handleSaveSuccess, this);

			React.renderComponent(
				Drop.Views.Upload({ model: file }),
				Drop.config.container_el
			);

			Marbles.history.once('handler:before', function () {
				file.off('save:success', handleSaveSuccess, this);
			}, this);
		},

		manage: function (params) {
			this.resetScrollPosition.call(this);
		}
	});

	Drop.Routers.main = new MainRouter();

})();
