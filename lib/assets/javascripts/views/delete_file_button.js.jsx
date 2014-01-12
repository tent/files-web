/** @jsx React.DOM */

Drop.Views.DeleteFileButton = React.createClass({
	handleClick: function (e) {
		e.preventDefault();

		if (!confirm("Delete " + this.props.name + "?")) {
			return;
		}

		this.props.model.performDelete();
	},

	render: function () {
		return (
			<a href='#' className='icon' title={'Delete ' + this.props.name} onClick={this.handleClick}><i className='picto picto-trash'></i></a>
		);
	}
});
