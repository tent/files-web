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
			this.set('file_meta', {
				name: i.name,
				size: i.size,
				type: i.content_type
			});
			this.set('link', Drop.client.getSignedURL('attachment', {entity: this.entity, digest: i.digest}));
		},

		save: function () {
			if (this.id === 'new') {
				// create
				this.trigger('save:start');
				Drop.client.createPost({
					entity: this.entity,
					type: this.type,
					permissions: {
						public: false
					}
				}, {
					attachments: [['file', this.file, this.name]],
					callback: {
						success: function (res, xhr) {
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
		}
	});

	File.findOrInit = function (attrs) {
		return File.find(attrs, { fetch: false }) || new File(attrs);
	};

	Drop.Models.File = File;

})();