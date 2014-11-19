/** @jsx React.DOM */
(function () {

"use strict";

Drop.Views.Auth = React.createClass({
	displayName: 'Drop.Views.Auth',

	getInitialState: function () {
		return {
			alert: null,
			fieldsSuccess: null, // { name: true/false }
			submitEnabled: true,
			mode: "login"
		};
	},

	handleSubmit: function (e) {
		e.preventDefault();

		this.setState({
			alert: { text: "Please wait...", type: 'info' },
			fieldsSuccess: null,
			submitEnabled: false
		});

		if (this.state.mode === "login") {
			this.handleLoginSubmit();
		} else {
			this.handleResetSubmit();
		}
	},

	handleLoginSubmit: function () {
		new Marbles.HTTP({
			method: 'POST',
			url: this.props.signinURL,
			body: {
				username: this.refs.username.getDOMNode().value,
				passphrase: this.refs.passphrase.getDOMNode().value
			},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			middleware: [
				Marbles.HTTP.Middleware.WithCredentials,
				Marbles.HTTP.Middleware.FormEncoded,
				Marbles.HTTP.Middleware.SerializeJSON
			],
			callback: this.handleSubmitResponse
		});
	},

	handleResetSubmit: function () {
		new Marbles.HTTP({
			method: 'POST',
			url: this.props.resetURL,
			body: {
				username: this.refs.username.getDOMNode().value
			},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			middleware: [
				Marbles.HTTP.Middleware.WithCredentials,
				Marbles.HTTP.Middleware.FormEncoded,
				Marbles.HTTP.Middleware.SerializeJSON
			],
			callback: this.handleResetSubmitResponse
		});
	},

	handleSubmitResponse: function (res, xhr) {
		if (xhr.status === 200) {
			this.setState({
				alert: { text: "You are now signed in", type: 'success' },
				fieldsSuccess: {
					username: true,
					passphrase: true
				},
				submitEnabled: false
			});
			this.props.successHandler(res, xhr);
		} else {
			this.handleSubmitFailure(res);
		}
	},

	handleResetSubmitResponse: function (res, xhr) {
		if (xhr.status === 200) {
			this.setState({
				alert: { text: "Reset email sent.", type: 'success' },
				fieldsSuccess: {
					username: true
				},
				submitEnabled: false
			});
		} else {
			this.handleSubmitFailure(res);
		}
	},

	handleSubmitFailure: function (res) {
		this.setState({
			alert: { text: (res.error || 'Something went wrong'), type: 'error' },
			fieldsSuccess: {
				username: res.fields ? res.fields.hasOwnProperty('username') : false,
				passphrase: res.fields ? res.fields.hasOwnProperty('passphrase') : false,
			},
			submitEnabled: true
		});
	},

	classNameForField: function (name) {
		if (!this.state.fieldsSuccess) {
			return '';
		} else {
			if (this.state.fieldsSuccess[name]) {
				return 'has-success';
			} else {
				return 'has-error';
			}
		}
	},

	render: function () {
		var alertEl = '';
		if (this.state.alert) {
			alertEl = <div className={'alert alert-'+ this.state.alert.type}>{this.state.alert.text}</div>;
		}

		return (
			<div>
				<h2 className='page-header'>Log in</h2>

				<form className='signin-form' onSubmit={this.handleSubmit}>
					{alertEl}

					<div className={ 'control-group'+ this.classNameForField('username') }>
						<label>Username</label>
						<div className='input-append'>
							<input ref='username' name='username' type='text' autoCapitalize="off" autoCorrect="off" autoComplete="off" />
							<span className='add-on'><i></i></span>
						</div>
					</div>

					{this.state.mode === "login" ? (
						<div className={'control-group '+ this.classNameForField('passphrase')}>
							<label>Passphrase</label>
							<div className='input-append'>
								<input ref='passphrase' name='passphrase' type='password' />
								<span className='add-on'><i></i></span>
							</div>
						</div>
					) : null}

					<button className='btn btn-primary' type='submit' disabled={!this.state.submitEnabled}>{this.state.mode === "login" ? "Log in" : "Reset passphrase"}</button>

					{this.props.resetURL ? (
						<a href="#reset-passphrase" className="reset-passphrase" onClick={this.__handleResetToggleClick}>{this.state.mode === "login" ? "reset passphrase" : "cancel"}</a>
					) : null}
				</form>
			</div>
		);
	},

	__handleResetToggleClick: function (e) {
		e.preventDefault();
		e.target.blur();
		if (this.state.mode === "login") {
			this.setState({
				mode: "reset",
				submitEnabled: true,
				alert: null,
				fieldsSuccess: null
			});
		} else {
			this.setState({
				mode: "login",
				submitEnabled: true,
				alert: null,
				fieldsSuccess: null
			});
		}
	}
});

})();
