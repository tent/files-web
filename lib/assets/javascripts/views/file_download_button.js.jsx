/** @jsx React.DOM */
(function () {

"use strict";

Drop.Views.FileDownloadButton = React.createClass({
	handleClick: function (e) {
		e.preventDefault();

		var file = this.props.file,
				url;
		if (file.get('permissions.public') === false) {
			// private
			url = file.getShareLink(60); // valid for 60 seconds
		} else {
			// public
			url = file.get('link');
		}

		window.open(url);
	},

	render: function () {
		return (
			<a className='icon' href={this.props.file.get('link')} title='Download' onClick={this.handleClick}><i className='fa fa-download'></i></a>
		);
	}
});

})();
