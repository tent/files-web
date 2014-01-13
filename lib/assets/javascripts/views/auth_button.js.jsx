/** @jsx React.DOM */

Drop.Views.AuthButton = React.createClass({
	displayName: 'Drop.Views.AuthButton',

	handleClick: function (e) {
		e.preventDefault();

		if (this.props.authenticated) {
			this.performSignout();
		}
	},

	performSignout: function () {
		new Marbles.HTTP({
			method: 'POST',
			url: this.props.signoutURL,
			middleware: [Marbles.HTTP.Middleware.WithCredentials],
			callback: this.props.handleSignout
		});
	},

	render: function () {
		return (
      <div className='nav-icon app-icon-signout icon-2x' onClick={this.handleClick} title={(this.props.authenticated ? 'Sign out' : 'Sign in')}></div>
		);
	}
});
