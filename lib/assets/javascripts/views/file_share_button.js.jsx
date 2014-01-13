/** @jsx React.DOM */

Drop.Views.FileShareButton = React.createClass({
	getInitialState: function () {
		return {
			active: false,
			ttl: moment.duration(1, 'day').asSeconds()
		};
	},

	handleClick: function (e) {
		e.preventDefault();

		if (this.state.active) {
			this.replaceState(this.getInitialState());
		} else {
			this.setState({ active: true });
		}
	},

	handleCloseShareBox: function (e) {
		e.preventDefault();
		this.setState({ active: false });
	},

	handleURLFocus: function (e) {
		Drop.Props.InputSelection.selectAll( this.refs.url.getDOMNode() );
	},

	componentDidUpdate: function () {
		if (this.state.active) {
			Drop.Props.InputSelection.selectAll( this.refs.url.getDOMNode() );
		}
	},

	render: function () {
		function numericOptions(max, desc) {
			max = Math.floor(max);
			var opts = [];
			for (var i = 0; i < max; i++) {
				opts.push(<option key={i + desc} value={i}>{i + desc}</option>);
			}
			return opts;
		}

		var shareBox = '';
		if (this.state.active) {
			var duration = moment.duration(this.state.ttl, 'seconds');
			shareBox = (
				<div className='share-box'>
					<input ref='url' className='float-left url' type='text' value={this.props.file.getSignedLink(this.state.ttl)} onClick={this.handleURLFocus} />
					<i className='picto picto-remove-oct-fill clickable float-left' onClick={this.handleCloseShareBox}></i>
					<div>Expires in {duration.asHours()} hours.</div>
				</div>
			);
		}
		return (
			<div className='share-container'>
				{shareBox}
				<a className='icon' href='#share' title='Share' onClick={this.handleClick}><i className='picto picto-share'></i></a>
			</div>
		);
	}
});
