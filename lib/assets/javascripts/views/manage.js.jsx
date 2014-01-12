/** @jsx React.DOM */

(function () {

	Drop.Views.Manage = React.createClass({
		displayName: 'Drop.Views.Manage',

		getInitialState: function () {
			return {};
		},

		bindCollection: function (collection) {
			collection.on('change', this.handleCollectionChange, this);
		},

		unbindCollection: function (collection) {
			collection.off('change', this.handleCollectionChange, this);
		},

		handleCollectionChange: function () {
			this.setState({ models: this.props.collection.models() });
		},

		componentDidMount: function () {
			this.bindCollection(this.props.collection);
		},

		componentWillUnmount: function () {
			this.unbindCollection(this.props.collection);
		},

		componentWillReceiveProps: function (props) {
			if (this.props.collection !== props.collection) {
				this.unbindCollection(this.props.collection);
				this.bindCollection(props.collection);
			}
		},

		render: function () {
			var DeleteFileButton = Drop.Views.DeleteFileButton,
					FileAlerts = Drop.Views.FileAlerts;
			var rows = [],
					model;
			if (this.state.models) {
				for (var i = 0, _ref = this.state.models, _len = _ref.length; i < _len; i++) {
					model = _ref[i];

					if (!model.get('file_meta.size')) {
						rows.push(
							<tr key={model.cid} className='error'>
								<td colSpan="5">Upload failed</td>
								<td><DeleteFileButton model={model} name="Failed upload" /></td>
							</tr>
						);
					} else {
						rows.push(
							<tr key={model.cid}>
								<td>{model.get('file_meta.name')}</td>
								<td><a className='icon' href={model.get('link')} title='Download'><i className='picto picto-file-open'></i></a></td>
								<td>{Drop.Helpers.formattedStorageAmount(model.get('file_meta.size'))}</td>
								<td title={model.get('file_meta.type')}>{model.get('file_meta.ext')}</td>
								<td title={Drop.Helpers.formatDateTime(model.get('published_at'))}>{Drop.Helpers.formatRelativeTime(model.get('published_at'))}</td>
								<td><DeleteFileButton model={model} name={model.get('file_meta.name')} /></td>
							</tr>
						);
					}
				}
			}

			return (
				<div>
					<FileAlerts modelClass={this.props.collection.constructor.model} />
					<table className='table table-striped manage-uploads-table'>
						<thead>
							<tr>
								<th>Filename</th>
								<th>Link</th>
								<th>Size</th>
								<th>Type</th>
								<th>Date</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{rows}
						</tbody>
					</table>
				</div>
			);
		}
	});

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

})();
