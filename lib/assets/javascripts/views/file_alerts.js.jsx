/** @jsx React.DOM */

Drop.Views.FileAlerts = React.createClass({
	getInitialState: function () {
		return {};
	},

	bindModelClass: function (modelClass) {
		modelClass.on('delete:failure', this.handleDeleteFailure, this);
		modelClass.on('delete:success', this.handleDeleteSuccess, this);
	},

	unbindModelClass: function (modelClass) {
		modelClass.off('delete:failure', this.handleDeleteFailure, this);
		modelClass.off('delete:success', this.handleDeleteSuccess, this);
	},

	handleDeleteFailure: function (model, res, xhr) {
		var msg = 'Failed to delete '+ (model.get('file_meta.name') || 'file') +': ' (res.error || xhr.status);
		this.setState({ msg: msg, type: 'error' });
	},

	handleDeleteSuccess: function (model, res, xhr) {
		var msg = 'Successfully deleted '+ (model.get('file_meta.name') || 'file') +'.';
		this.setState({ msg: msg, type: 'success' });
	},

	handleClick: function (e) {
		e.preventDefault();
		this.replaceState({});
	},

	componentDidMount: function () {
		this.bindModelClass(this.props.modelClass);
	},

	componentWillUnmount: function () {
		this.unbindModelClass(this.props.modelClass);
	},

	componentWillReceiveProps: function (props) {
		if (this.props.modelClass !== props.modelClass) {
			this.unbindModelClass(this.props.modelClass);
			this.bindModelClass(this.props.modelClass);
		}
	},

	render: function () {
		if (this.state.msg) {
			return (
				<div className={'alert alert-'+ this.state.type} onClick={this.handleClick}>{this.state.msg}</div>
			);
		} else {
			return <div />;
		}
	}
});
