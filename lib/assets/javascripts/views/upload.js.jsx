/** @jsx React.DOM */

(function () {

	Drop.Views.Upload = React.createClass({
		displayName: 'Drop.Views.Upload',

		getInitialState: function () {
			return {
				error: null,
				maxFileSize: 10000000 // 10MB
			};
		},

		formattedStorageAmount: function (size) {
			var d, units;
			if (size >= 1000000000) { // >= 1GB
				d = 1000000000;
				units = 'GB';
			} else if (size >= 1000000) { // >= 1MB
				d = 1000000;
				units = 'MB';
			} else if (size >= 1000) { // >= 1KB
				d = 1000;
				units = 'KB';
			} else { // < 1KB
				d = 1;
				units = ' bytes';
			}

			return ((parseInt((size / d) * 100) / 100) || 0) + units;
		},

		shouldDisableSubmit: function () {
			return !this.props.model || !this.props.model.file;
		},

		bindModel: function (model) {
			if (!model) {
				return;
			}
			model.on('save:failure', this.handleSaveFailure, this);
		},

		unbindModel: function (model) {
			if (!model) {
				return;
			}
			model.off('save:failure', this.handleSaveFailure, this);
		},

		componentDidMount: function () {
			this.bindModel(this.props.model);
		},

		componentWillUnmount: function () {
			this.unbindModel(this.props.model);
		},

		componentWillReceiveProps: function (props) {
			if (this.props.model !== props.model) {
				this.unbindModel(this.props.model);
				this.bindModel(props.model);
			}
		},

		handleSubmit: function (e) {
			e.preventDefault();

			var model = this.props.model;

			if (!model.get('file')) {
				this.handleError("Please select a file to upload.");
				return;
			}

			model.set('name', this.refs.name.getDOMNode().value.trim() || model.get('file.name'));
			model.save();
		},

		handleSaveFailure: function (res, xhr) {
			if (res.error) {
				this.handleError(res.error);
			} else {
				this.handleError("Error creating file: " + xhr.status + ".");
			}
		},

		handleError: function (err) {
			this.setState({ error: err });
		},

		handleFile: function (file) {
			if (file.size > this.state.maxFileSize) {
				this.handleError("The file you selected is " + this.formattedStorageAmount(file.size) + ". Please select one under " + this.formattedStorageAmount(this.state.maxFileSize) + ".");
				return;
			}

			this.props.model.set('file', file);

			this.setState({error: null});
		},

		render: function () {
			var DragFileInput = Drop.Views.DragFileInput;

			var alertNode = '';
			if (this.state.error) {
				alertNode = <div className='alert alert-danger'>{this.state.error.toString()}</div>;
			}

			return (
				<form onSubmit={this.handleSubmit}>
					{alertNode}

					<DragFileInput errorHandler={this.handleError} fileHandler={this.handleFile} file={this.props.model.get('file')}>Drop file here</DragFileInput>

					<label>
						Name:&nbsp;
						<input type='text' ref='name' placeholder={this.props.model.get('file.name') || '' } />
					</label>

					<button type="submit" disabled={this.shouldDisableSubmit()} className='btn btn-primary'>Upload</button>
				</form>
			);
		}
	});

	Drop.Views.DragFileInput = React.createClass({
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

})();
