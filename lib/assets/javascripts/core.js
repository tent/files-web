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
		},

		// @function (constructor, proto [, parent] [, mixin, ...])
		createClass: function (name, constructor, proto, parent) {
			var _constructor;
			if (parent) {
				_constructor = function () {
					constructor.apply(this, arguments);
					var _ref = _constructor.__super__.constructor.apply(this, arguments);
					return _ref;
				}

				Drop.Utils.extends(_constructor, parent);

				_constructor.displayName = name;
			} else {
				_constructor = constructor;
			}

			for (var k in proto) {
				if (!proto.hasOwnProperty(k)) {
					continue;
				}
				_constructor.prototype[k] = proto[k];
			}

			var mixins = Array.prototype.slice.call(arguments, 3);
			for (var i = 0, _len = mixins.length; i < _len; i++) {
				var mixin = mixins[i];
				for (var k in mixin) {
					if (!mixin.hasOwnProperty(k)) {
						continue;
					}
					_constructor.prototype[k] = mixin[k];
				}
			}

			return _constructor;
		}
	};
})();
