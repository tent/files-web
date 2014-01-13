(function () {

	var MainRouter = Marbles.Router.createClass({
		displayName: 'Drop.Routers.main',

		routes: [
			{ path : ""      , handler: "root"  },
			{ path : "files" , handler: "files" }
		],

		resetScrollPosition: function () {
			var hash_fragment = window.location.hash;
			window.scrollTo(0, 0);
			if (hash_fragment !== '') {
				window.location.hash = hash_fragment;
			}
		},

		root: function () {
			this.navigate("files", { replace: true });
		},

		files: function (params) {
			this.resetScrollPosition.call(this);

			function handleSaveSuccess () {
				// file successfully uploaded
				files.prependModels([file]);
				setFile();
				view.setProps({ model: file });
			}

			var file;
			function setFile() {
				file = Drop.Models.File.findOrInit({
					id: 'new',
					entity: Drop.current_entity,
					permissions: {
						public: true
					}
				});
				file.once('save:success', handleSaveSuccess, this);
			}
			setFile();

			var files = Drop.Collections.Files.findOrInit({
				params: {
					entity: Drop.current_entity,
					types: [Drop.config.POST_TYPES.file]
				}
			});
			files.fetch();

			var view = React.renderComponent(
				Drop.Views.Main({ model: file, collection: files }),
				Drop.config.container_el
			);

			Marbles.history.once('handler:before', function () {
				file.off('save:success', handleSaveSuccess, this);
			}, this);
		}
	});

	Drop.Routers.main = new MainRouter();

})();
