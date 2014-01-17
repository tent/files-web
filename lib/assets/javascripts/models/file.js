(function () {

	// @class Drop.Models.File extends Marbles.Model
	var File = Marbles.Model.createClass({
		displayName: 'Drop.Models.File',

		modelName: 'file',

		cidMappingScope: ['id', 'entity'],

		willInitialize: function () {
			this.type = Drop.config.POST_TYPES.file;

			this.on('change:attachments', this.handleChangeAttachments, this);
		},

		handleChangeAttachments: function (attachments) {
			if (!this.entity) {
				var _args = Array.prototype.slice.call(arguments, 0);
				this.once('change:entity', function () {
					this.handleChangeAttachments.apply(this, _args);
				}, this);
				return;
			}

			var i = attachments[0] || {};
			var _ref = i.name.split('.');
			var ext = _ref[_ref.length-1];
			if (!ext || ext === _ref[0]) {
				_ref = i.content_type.split('/');
				ext = _ref[_ref.length-1];
			}
			this.set('file_meta', {
				name: i.name,
				size: i.size,
				type: i.content_type,
				digest: i.digest,
				ext: ext
			});

			this.set('link', Drop.client.getNamedURL('attachment', [{entity: this.entity, digest: i.digest}]));
		},

		getShareLink: function (ttl, options) {
			if (!options) {
				options = {};
			}
			options.short = options.short === true; // default false

			var params = [{
				entity: this.entity,
				digest: this.get('file_meta.digest')
			}];

			var url;

			if (this.get('permissions.public') !== false) {
				// public
				url = Drop.client.getNamedURL('attachment', params);
			} else {
				url = Drop.client.getSignedURL('attachment', params, { ttl: ttl });
			}

			if (options.short) {
				if (typeof options.callback !== 'function') {
					throw Error(this.constructor.displayName +".prototype.getShareLink: You can't get a short URL without setting options.callback function.");
				}
				Drop.Helpers.shortenURL(url, options.callback);
			} else {
				return url;
			}
		},

		save: function () {
			if (this.id === 'new') {
				// create
				this.trigger('save:start');
				Drop.client.createPost({
					entity: this.entity,
					type: this.type,
					permissions: {
						public: this.get('permissions.public') !== false
					}
				}, {
					attachments: [['file', this.file, this.name]],
					callback: {
						success: function (res, xhr) {
							this.set('file', null);
							this.parseAttributes(res.post);
							this.trigger('save:success', res, xhr);
						}.bind(this),

						failure: function (res, xhr) {
							this.trigger('save:failure', res, xhr);
						}.bind(this),

						complete: function (res, xhr) {
							this.trigger('save:complete', res, xhr);
						}.bind(this)
					}
				});
			} else {
				console.error(Error("You need to implement saving existing file with Drop.Models.File.prototype.save"));
			}
		},

		performDelete: function () {
			if (this.id === 'new') {
				this.detach();
				return;
			} else {
				Drop.client.deletePost({
					params: [{
						entity: this.entity,
						post: this.id,
					}],
					callback: {
						success: function (res, xhr) {
							this.trigger('delete:success', res, xhr);
							this.constructor.trigger('delete:success', this, res, xhr);
							this.detach();
						}.bind(this),

						failure: function (res, xhr) {
							this.trigger('delete:failure', res, xhr);
							this.constructor.trigger('delete:failure', this, res, xhr);
						}.bind(this),

						complete: function (res, xhr) {
							this.trigger('delete:complete', res, xhr);
							this.constructor.trigger('delete:complete', this, res, xhr);
						}.bind(this)
					}
				});
			}
		}
	});

	File.findOrInit = function (attrs) {
		return File.find(attrs, { fetch: false }) || new File(attrs);
	};

	Drop.Models.File = File;

})();
