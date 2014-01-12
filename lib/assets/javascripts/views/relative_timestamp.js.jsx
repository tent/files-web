/** @jsx React.DOM */

Drop.Views.RelativeTimestamp = React.createClass({
	resetInterval: function () {
		this.setState({
			interval: setInterval(this.forceUpdate.bind(this), 1000)
		});
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
