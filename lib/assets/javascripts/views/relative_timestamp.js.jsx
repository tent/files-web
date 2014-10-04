/** @jsx React.DOM */
(function () {

"use strict";

Drop.Views.RelativeTimestamp = React.createClass({
	getInitialState: function () {
		return {};
	},

	resetInterval: function () {
		this.clearInterval();

		var updateEvery = function (n) {
			this.setState({
				interval: setInterval(this.forceUpdate.bind(this), n)
			});
		}.bind(this);

    var delta = Date.now() - this.props.milliseconds;
    if (delta < 60000) { // less than 1 minute ago
			updateEvery(2000); // update in 2 seconds
		} else if (delta < 3600000) { // less than 1 hour ago
			updateEvery(30000); // update in 30 seconds
		} else if (delta < 86400000) { // less than 1 day ago
			updateEvery(1800000); // update in 30 minutes
		} else if (delta < 2678400000) { // 31 days ago
			updateEvery(43200000); // update in 12 hours
		} else {
			updateEvery(2419000000); // update in 28 days
		}
	},

	clearInterval: function () {
		clearInterval(this.state.interval);
	},

	componentDidMount: function () {
		this.resetInterval();
	},

	componentWillUnmount: function () {
		this.clearInterval();
	},

	componentWillReceiveProps: function (props) {
		if (this.props.milliseconds !== props.milliseconds) {
			this.resetInterval();
		}
	},

	render: function () {
		return <span title={Drop.Helpers.formatDateTime(this.props.milliseconds)}>{Drop.Helpers.formatRelativeTime(this.props.milliseconds)}</span>;
	}
});

})();
