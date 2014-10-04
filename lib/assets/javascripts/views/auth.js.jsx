/** @jsx React.DOM */
(function () {

"use strict";

Drop.Views.Auth = React.createClass({
	displayName: 'Drop.Views.Auth',

	getInitialState: function () {
		return {
			alert: null,
			fieldsSuccess: null, // { name: true/false }
			submitEnabled: true
		};
	},

	handleSubmit: function (e) {
		e.preventDefault();

		this.setState({
			alert: { text: "Please wait...", type: 'info' },
			fieldsSuccess: null,
			submitEnabled: false
		});

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
			this.setState({
				alert: { text: (res.error || 'Something went wrong'), type: 'error' },
				fieldsSuccess: {
					username: res.fields ? res.fields.hasOwnProperty('username') : false,
					passphrase: res.fields ? res.fields.hasOwnProperty('passphrase') : false,
				},
				submitEnabled: true
			});
		}
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
				<h2 className='page-header'>Sign in</h2>

				<form className='signin-form' onSubmit={this.handleSubmit}>
					{alertEl}

					<div className={ 'control-group'+ this.classNameForField('username') }>
						<label>Username</label>
						<div className='input-append'>
							<input ref='username' name='username' type='text' autoCapitalize="off" autoCorrect="off" autoComplete="off" />
							<span className='add-on'><i></i></span>
						</div>
					</div>

					<div className={ 'control-group'+ this.classNameForField('passphrase') }>
						<label>Password</label>
						<div className='input-append'>
							<input ref='passphrase' name='passphrase' type='password' />
							<span className='add-on'><i></i></span>
						</div>
					</div>

					<button className='btn btn-primary' type='submit' disabled={!this.state.submitEnabled}>Sign in</button>
				</form>
			</div>
		);
	}
});

})();
