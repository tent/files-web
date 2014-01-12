/** @jsx React.DOM */

Drop.Views.FileShareButton = React.createClass({
	getInitialState: function () {
		return {
			active: false,
			ttl: moment.duration(1, 'day').asSeconds(),
			minTTL: moment.duration(1, 'minute').asSeconds(),
			maxTTL: moment.duration(12, 'months').asSeconds() - moment.duration(1, 'day').asSeconds(),
			ttlStep: moment.duration(1, 'day').asSeconds()
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

	handleTTLChange: function (e) {
		var ttl = Number(this.refs.ttl.getDOMNode().value.trim());
		this.setState({ ttl: ttl });
	},

	handleSelectTTLChange: function (e) {
		var ttl = 0;
		ttl += moment.duration(Number(this.refs.months.getDOMNode().value.trim()), 'months').asSeconds();
		ttl += moment.duration(Number(this.refs.days.getDOMNode().value.trim()), 'days').asSeconds();
		ttl += moment.duration(Number(this.refs.hours.getDOMNode().value.trim()), 'hours').asSeconds();
		ttl = Math.min(ttl, this.state.maxTTL);
		ttl = Math.max(ttl, this.state.minTTL);
		this.setState({ ttl: ttl });
	},

	handleCloseShareBox: function (e) {
		e.preventDefault();
		this.setState({ active: false });
	},

	handleURLFocus: function (e) {
		Drop.Props.InputSelection.selectAll( this.refs.url.getDOMNode() );
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
			var maxDuration = moment.duration(this.state.maxTTL, 'seconds');
			shareBox = (
				<div className='share-box'>
					<input ref='url' className='float-left url' type='text' value={this.props.file.getSignedLink(this.state.ttl)} onFocus={this.handleURLFocus} />
					<i className='picto picto-remove-oct-fill clickable float-left' onClick={this.handleCloseShareBox}></i>
					<input ref='ttl' type='range' step={this.state.ttlStep} min={this.state.minTTL} max={this.state.maxTTL} value={this.state.ttl} onChange={this.handleTTLChange} />
					<div className='clearfix'>
						<select ref='months' value={duration.months()} onChange={this.handleSelectTTLChange}>
							{numericOptions(Math.min(maxDuration.asMonths(), 12) + 1, 'mo')}
						</select>
						<select ref='days' value={duration.days()} onChange={this.handleSelectTTLChange}>
							{numericOptions(Math.min(maxDuration.asDays(), 31) + 1, 'd')}
						</select>
						<select ref='hours' value={duration.hours()} onChange={this.handleSelectTTLChange}>
							{numericOptions(Math.min(maxDuration.asHours(), 24), 'h')}
						</select>
					</div>
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
