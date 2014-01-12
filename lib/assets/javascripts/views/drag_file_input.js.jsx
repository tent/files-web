/** @jsx React.DOM */

Drop.Views.DragFileInput = React.createClass({
	displayName: 'Drop.Views.DragFileInput',

	getInitialState: function () {
		return {
			active: false
		};
	},

	handleDragOver: function (e) {
		e.preventDefault();
		e.stopPropagation();

		this.setState({ active: true });
	},

	handleDragLeave: function (e) {
		e.preventDefault();
		e.stopPropagation();

		this.setState({ active: false });
	},

	handleDrop: function (e) {
		e.preventDefault();
		e.stopPropagation();

		this.setState({ active: false });

		var files = e.nativeEvent.target.files || e.nativeEvent.dataTransfer.files;

		if (!files || !files.length) {
			this.props.errorHandler("Unable to read file!");
		}

		if (files.length > 1) {
			this.props.errorHandler("You may only select one file!");
			return;
		}

		this.props.fileHandler(files[0]);
	},

	render: function () {
		return (
			<div className={'drop-zone ' + (this.state.active ? 'active' : '')} onDragOver={this.handleDragOver} onDragLeave={this.handleDragLeave} onDrop={this.handleDrop}>
				{this.props.file ? this.props.file.name : this.props.children}
			</div>
		);
	}
});