/** @jsx React.DOM */

Drop.Views.Manage = React.createClass({
	displayName: 'Drop.Views.Manage',

	getInitialState: function () {
		return {
			lastPage: true
		};
	},

	bindCollection: function (collection) {
		collection.on('change', this.handleCollectionChange, this);
	},

	unbindCollection: function (collection) {
		collection.off('change', this.handleCollectionChange, this);
	},

	handleCollectionChange: function () {
		var collection = this.props.collection;
		this.setState({
			models: collection.models(),
			lastPage: !collection.pages.next
		});
	},

	loadNextPage: function () {
		var res = this.props.collection.fetchNext({ append: true });
		if (res === false) {
			this.setState({ lastPage: true });
		}
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
				FileDownloadButton = Drop.Views.FileDownloadButton,
				FileShareButton = Drop.Views.FileShareButton,
				FileAlerts = Drop.Views.FileAlerts,
				RelativeTimestamp = Drop.Views.RelativeTimestamp,
				InfiniteScroll = React.addons.InfiniteScroll;
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
							<td><FileDownloadButton file={model} /></td>
							<td><FileShareButton file={model} /></td>
							<td>{Drop.Helpers.formattedStorageAmount(model.get('file_meta.size'))}</td>
							<td title={model.get('file_meta.type')}>{model.get('file_meta.ext')}</td>
							<td>{Drop.Helpers.formatBoolean(model.get('permissions.public') === false)}</td>
							<td><RelativeTimestamp milliseconds={model.get('published_at')} /></td>
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
							<th></th>
							<th></th>
							<th>Size</th>
							<th>Type</th>
							<th>Public</th>
							<th>Date</th>
							<th></th>
						</tr>
					</thead>

					<tbody>
						{rows}
					</tbody>
				</table>

				<InfiniteScroll
					loadMore={this.loadNextPage}
					hasMore={!this.state.lastPage}
					loader={<div>Loading...</div>}
					threshold={250} />
			</div>
		);
	}
});
