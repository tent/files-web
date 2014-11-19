(function () {
	"use strict";

	var Files = Marbles.Collection.createClass({
		displayName: 'Drop.Collection.Files',

		collectionName: 'Files',

		cidMappingScope: ['entity', 'context'],

		model: Drop.Models.File,

		willInitialize: function (options) {
			this.params = options.params || {};
			if (!this.params.hasOwnProperty('limit')) {
				this.params.limit = Drop.config.POSTS_PER_PAGE;
			}
			this.context = JSON.stringify(this.params);
			this.client = Drop.client;

			this.pages = {};

			var _handleChangeTimeout;
			function handleChange () {
				clearTimeout(_handleChangeTimeout);
				_handleChangeTimeout = setTimeout(function () {
					this.trigger('change', this.models());
				}.bind(this), 20);
			}

			this.constructor.model.on('change', handleChange, this);

			this.on('reset', handleChange, this);
			this.on('append', handleChange, this);
			this.on('prepend', handleChange, this);
			this.on('remove', handleChange, this);
		},

		didInitialize: function () {
			this.options.unique = true;
		},

		fetch: function (options) {
			if (!options) {
				options = {};
			}
			var params = Marbles.Utils.extend({}, options.params || {}, this.params);

			var successFn = function (res, xhr) {
				var posts = res.posts,
						pages = res.pages,
						models;
				if (options.prepend) {
					models = this.prependJSON(posts);
				} else if (options.append) {
					models = this.appendJSON(posts);
				} else {
					models = this.resetJSON(posts);
				}

				this.pages = Marbles.Utils.extend({
					first: this.pages.first,
					last: this.pages.last
				}, pages);

				if (options.callback) {
					if (typeof options.callback === 'function') {
						options.callback(models, res, xhr);
					} else {
						if (typeof options.callback.success === 'function') {
							options.callback.success(models, res, xhr);
						}
					}
				}
			}.bind(this);

			var failureFn = function (res, xhr) {
				if (options.callback) {
					if (typeof options.callback === 'function') {
						options.callback([], res, xhr);
					} else {
						if (typeof options.callback.success === 'function') {
							options.callback.success([], res, xhr);
						}
					}
				}
			}.bind(this);

			this.client.getPostsFeed({
				params: [params],
				callback: {
					success: successFn,
					failure: failureFn
				}
			});
		},

		fetchNext: function (options) {
			if (!this.pages.next) {
				return false;
			}

			var params = Marbles.History.prototype.deserializeParams(this.pages.next)[0];
			this.fetch(Marbles.Utils.extend({
				params: params
			}, options || {}));
		}

	});

	Drop.Collections.Files = Files;

	Files.findOrInit = function (options) {
		var files = this.find({
			entity: Drop.current_entity,
			context: JSON.stringify(options.params || {})
		}, {fetch:false});

		if (!files) {
			files = new this(options);
		}

		return files;
	};

	// Stop Files.find() from throwing an error
	Files.fetch = function () {
		return;
	};

})();
