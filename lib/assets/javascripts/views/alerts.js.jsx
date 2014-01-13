/** @jsx React.DOM */

Drop.Views.Alerts = React.createClass({
	displayName: 'Drop.Views.Alerts',

	getInitialState: function () {
		return {
			dismissedAlerts: []
		};
	},

	componentWillReceiveProps: function (props) {
		this.setState({ alerts: props.alerts || [] });
	},

	performDismiss: function (alert) {
		var dismissedAlerts = this.state.dismissedAlerts;
		dismissedAlerts.push(alert.id);
		this.setState({ dismissedAlerts: dismissedAlerts });

    new Marbles.HTTP({
      method: 'DELETE',
      url: this.props.dismissURL.replace(':id', alert.id),
      middleware: [Marbles.HTTP.Middleware.WithCredentials]
		});
	},

	render: function () {
		var Alert = Drop.Views.Alert;
		var alertNodes = [];
		for (var i = 0, _ref = this.props.alerts, _len = _ref.length; i < _len; i++) {
			if (this.state.dismissedAlerts.indexOf(_ref[i].id) === -1) {
				alertNodes.push(<Alert key={_ref[i].id} alert={_ref[i]} performDismiss={this.performDismiss} />);
			}
		}

		return (
			<div className='row'>
				{alertNodes}
			</div>
		);
	}
});

Drop.Views.Alert = React.createClass({
	displayName: 'Drop.Views.Alerts',

	getAlertClassName: function (type) {
		switch (type) {
			case 'info':
				return 'alert-info';
			case 'warning':
				return 'alert-warning';
			case 'danger':
				return 'alert-error';
		}
	},

	handleClick: function (e) {
		e.preventDefault();
		this.props.performDismiss(this.props.alert);
	},

	render: function () {
		var alert = this.props.alert;
		var titleNode = '';
		if (alert.title) {
			titleNode = <h4>{alert.title}</h4>;
		}
		return (
			<div className={'alert alert-block '+ this.getAlertClassName(alert.type)}>
				<button type="button" className="close" onClick={this.handleClick}>&times;</button>
				{titleNode}
				<span dangerouslySetInnerHTML={{__html: markdown.toHTML(alert.body, 'Tent') }} />
			</div>
		);
	}
});
