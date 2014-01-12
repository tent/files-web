/** @jsx React.DOM */

(function () {

	Drop.Views.Upload = React.createClass({
		displayName: 'Drop.Views.Upload',

		getInitialState: function () {
			return {
				error: null,
				saving: false,
				maxFileSize: 10000000 // 10MB
			};
		},

		shouldDisableSubmit: function () {
			return !this.props.model || !this.props.model.file || this.state.saving;
		},

		submitButtonDisplayText: function () {
			if (this.state.saving) {
				return "Uploading";
			} else {
				return "Upload";
			}
		},

		bindModel: function (model) {
			if (!model) {
				return;
			}
			model.on('save:start', this.handleSaveStart, this);
			model.on('save:failure', this.handleSaveFailure, this);
			model.on('save:complete', this.handleSaveComplete, this);
		},

		unbindModel: function (model) {
			if (!model) {
				return;
			}
			model.off('save:start', this.handleSaveStart, this);
			model.off('save:failure', this.handleSaveFailure, this);
			model.off('save:complete', this.handleSaveComplete, this);
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

		handleSaveStart: function () {
			this.setState({ saving: true });
		},

		handleSaveFailure: function (res, xhr) {
			if (res.error) {
				this.handleError(res.error);
			} else {
				this.handleError("Error creating file: " + xhr.status + ".");
			}
		},

		handleSaveComplete: function () {
			this.setState({ saving: false });
		},

		handleError: function (err) {
			this.setState({ error: err });
		},

		handleFile: function (file) {
			if (file.size > this.state.maxFileSize) {
				this.handleError("The file you selected is " + Drop.Helpers.formattedStorageAmount(file.size) + ". Please select one under " + Drop.Helpers.formattedStorageAmount(this.state.maxFileSize) + ".");
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

					<button type="submit" disabled={this.shouldDisableSubmit()} className='btn btn-primary'>{this.submitButtonDisplayText()}</button>
				</form>
			);
		}
	});

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

})();
