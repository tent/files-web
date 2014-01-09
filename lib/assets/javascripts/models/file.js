(function () {

	// @class Drop.Models.File extends Marbles.Model
	var File = Drop.Utils.createClass('Drop.Models.File', function () {
		// constructor
	}, {
		// prototype
		save: function () {
			console.log('File save', this, this.toJSON());
		}
	}, Marbles.Model);

	File.model_name = 'file';
	File.id_mapping_scope = ['id', 'entity'];

	File.findOrInit = function (attrs) {
		return File.find(attrs, { fetch: false }) || new File(attrs);
	};

	Drop.Models.File = File;

})();
