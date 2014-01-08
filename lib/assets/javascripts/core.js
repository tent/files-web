(function () {
	if (!this.Drop) {
		this.Drop = {
			Views: {}
		};
	}

	var __hasProp = {}.hasOwnProperty;

	this.Drop.Utils = {
		extends: function(child, parent) {
			for (var key in parent) {
				if (__hasProp.call(parent, key)) child[key] = parent[key];
			}

			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}
	};
})();
