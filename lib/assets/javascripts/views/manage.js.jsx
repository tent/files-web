/** @jsx React.DOM */
(function () {

"use strict";

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

		var permissionsMeta = function (model) {
			var permissionsText = "";
			var className = "fa fa-";
			if (model.get('permissions.public') === false) {
				if ((model.get('permissions.entities') || []).length > 0) {
					permissionsText = 'Shared ('+ model.get('permissions.entities').join(', ') +')';
					className = className+'lock';
				} else {
					permissionsText = 'Private';
					className = className+'lock';
				}
			} else {
				permissionsText = 'Public';
				className = className+'unlock';
			}
			return {
				text: permissionsText,
				className: className
			};
		};

		var models = this.state.models || [];

		var getAvatarURL = Drop.Helpers.avatarURL;

		return (
			<section>
				<FileAlerts modelClass={this.props.collection.constructor.model} />
				<ul className="files">
					{models.map(function (file) {
						var _ref = permissionsMeta(file);
						var permissionsText = _ref.text;
						var className = _ref.className;
						var nameWithoutExt = file.get('file_meta.name');
						if (file.nameIncludesExt) {
							nameWithoutExt = nameWithoutExt.slice(0, nameWithoutExt.indexOf(file.get('file_meta.ext')));
						}
						var avatarURL = getAvatarURL(file.entity, (file.profile || {}).avatarDigest || null);
						return (
							<li key={file.id}>
								{ !file.get('file_meta.size') ? (
									<div className="alert alert-block alert-error">
										Upload failed
										<DeleteFileButton model={file} name="Failed upload" />
									</div>
								) : (
									<article className="file">
										<header>
											<h1>
												<img className="avatar" src={avatarURL} title={file.profile ? (file.profile.name === file.entity ? (file.entity) : (file.profile.name +" ("+ file.entity +")")) : (file.entity)} />
												<small className="permissions">
													<i
														title={permissionsText}
													className={className} />
												</small>
												{file.nameIncludesExt ? (
													<span>
														{nameWithoutExt}
														<span title={file.get('file_meta.type')}>{file.get('file_meta.ext')}</span>
													</span>
												) : (
													file.get('file_meta.name')
												)}
												{file.nameIncludesExt ? null : (
													<small className="filemeta">
														<span title={file.get('file_meta.type')}>({file.get('file_meta.ext')})</span>
													</small>
												)}
											</h1>

											<aside className="meta">
												{Drop.Helpers.formattedStorageAmount(file.get('file_meta.size'))}
											</aside>

											<aside className="actions">
												<ul>
													<li><DeleteFileButton model={file} name={file.get('file_meta.name')} /></li>
													<li><FileDownloadButton file={file} /></li>
													<li><FileShareButton file={file} /></li>
													<li><RelativeTimestamp milliseconds={file.get('published_at')} /></li>
												</ul>
											</aside>
										</header>
									</article>
								)}
							</li>
						);
					})}
				</ul>

				<InfiniteScroll
					loadMore={this.loadNextPage}
					hasMore={!this.state.lastPage}
					loader={<div>Loading...</div>}
					threshold={250} />
			</section>
		);
	}
});

})();
