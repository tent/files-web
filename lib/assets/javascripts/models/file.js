(function () {

	// @class Drop.Models.File extends Marbles.Model
	var File = Drop.Utils.createClass('Drop.Models.File', function () {
		// constructor
		this.type = "https://tent.io/types/file/v0#";
	}, {
		// prototype
		save: function () {
			if (this.id === 'new') {
				// create
				Drop.client.createPost({
					entity: this.entity,
					type: this.type,
					permissions: {
						public: false
					}
				}, {
					attachments: ['file', this.file, this.name],
					callback: {
						success: function (res, xhr) {
							this.parseAttributes(res.post);
							this.trigger('save:success', res, xhr);
						}.bind(this),

						failure: function (res, xhr) {
							this.trigger('save:failure', res, xhr);
						}.bind(this)
					}
				});
			} else {
				console.error(Error("You need to implement saving existing file with Drop.Models.File.prototype.save"));
			}
		}
	}, Marbles.Model);

	File.model_name = 'file';
	File.id_mapping_scope = ['id', 'entity'];

	File.findOrInit = function (attrs) {
		return File.find(attrs, { fetch: false }) || new File(attrs);
	};

	Drop.Models.File = File;

})();