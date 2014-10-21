//= require ./mixins

(function () {

	"use strict";

	var MainRouter = Marbles.Router.createClass({
		displayName: 'Drop.Routers.main',

		mixins: [Drop.Routers.Mixins],

		routes: [
			{ path : ""      , handler: "root"  },
			{ path : "files" , handler: "files" },
			{ path : "inbox" , handler: "inbox" }
		],

		root: function () {
			this.navigate("files", { replace: true });
		},

		files: function () {
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
		},

		inbox: function () {
			this.resetScrollPosition.call(this);

			var files = Drop.Collections.Files.findOrInit({
				params: {
					mentions: Drop.current_entity,
					types: [Drop.config.POST_TYPES.file],
				}
			});
			files.fetch();

			React.renderComponent(
				Drop.Views.Manage({ collection: files }),
				Drop.config.container_el
			);
		}
	});

	Drop.Routers.main = new MainRouter();

})();
