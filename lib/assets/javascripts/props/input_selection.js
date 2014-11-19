(function () {

"use strict";

Drop.Props.InputSelection = Marbles.Utils.createClass({
	displayName: 'Drop.Props.InputSelection',

	willInitialize: function (el) {
		this.el = el;
		this.start = this.calculateStart();
		this.end = this.calculateEnd();
	},

	calculateStart: function () {
		return this.el.selectionStart;
	},

	calculateEnd: function () {
		return this.el.selectionEnd;
	},

	selectAll: function () {
		this.select(0, this.el.value.length);
	},

	select: function (start, end) {
		this.el.selectionStart = start;
		this.el.selectionEnd = end;
	}
});

Drop.Props.InputSelection.selectAll = function (el) {
	var inputSelection = new this(el);
	inputSelection.selectAll();
};

})();
