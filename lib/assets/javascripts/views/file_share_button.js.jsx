/** @jsx React.DOM */
(function () {

"use strict";

Drop.Views.FileShareButton = React.createClass({
	getInitialState: function () {
		return {
			active: false,
			ttl: moment.duration(1, 'day').asSeconds(),
			url: null
		};
	},

	handleClick: function (e) {
		e.preventDefault();

		if (this.state.active) {
			this.replaceState(this.getInitialState());
		} else {
			this.setState({ active: true });
			this.shortenURL();
		}
	},

	shortenURL: function () {
		this.props.file.getShareLink(this.state.ttl, {
			short: true,
			callback: function (url) {
				this.setState({ url: url });
			}.bind(this)
		});
	},

	componentDidMount: function () {
		this.setState({
			url: this.props.file.getShareLink(this.state.ttl)
		});
	},

	handleCloseShareBox: function (e) {
		e.preventDefault();
		this.setState({ active: false });
	},

	handleURLFocus: function () {
		Drop.Props.InputSelection.selectAll( this.refs.url.getDOMNode() );
	},

	componentDidUpdate: function () {
		if (this.state.active) {
			Drop.Props.InputSelection.selectAll( this.refs.url.getDOMNode() );
		}
	},

	render: function () {
		var shareBox = '';
		if (this.state.active) {
			var duration = moment.duration(this.state.ttl, 'seconds');
			var expiresIn = '';
			if (this.props.file.get('permissions.public') === false) {
				expiresIn = <div>Link expires in {duration.asHours()} hours.</div>;
			}
			shareBox = (
				<div className='share-box'>
					<input ref='url' className='float-left url' type='text' value={this.state.url || ''} onClick={this.handleURLFocus} />
					<i className='fa fa-times-circle clickable float-left' onClick={this.handleCloseShareBox}></i>
					{expiresIn}
				</div>
			);
		}
		return (
			<div className='share-container'>
				{shareBox}
				<a className='icon' href='#share' title='Get link' onClick={this.handleClick}><i className='fa fa-share'></i></a>
			</div>
		);
	}
});

})();
