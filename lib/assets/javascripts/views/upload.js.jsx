/** @jsx React.DOM */

(function () {

	Drop.Views.Upload = React.createClass({
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

		handleSubmit: function (e) {
			e.preventDefault();
			if (!this.state.file) {
				this.handleError("Please select a file to upload.");
				return;
			}
			// TODO: upload selected file
		},

		handleError: function (err) {
			this.setState({ error: err });
		},

		handleFile: function (file) {
			if (file.size > this.state.maxFileSize) {
				this.handleError("The file you selected is " + this.formattedStorageAmount(file.size) + ". Please select one under " + this.formattedStorageAmount(this.state.maxFileSize) + ".");
				return;
			}

			this.setState({ error: null });

			console.log('handleFile', file);
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

					<DragFileInput errorHandler={this.handleError} fileHandler={this.handleFile}>Drop file here</DragFileInput>

					<button type="submit" className='btn btn-primary'>Upload</button>
				</form>
			);
		}
	});

	Drop.Views.DragFileInput = React.createClass({
		getInitialState: function () {
			return {
				active: false,
				file: null
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

			var file = files[0];

			this.setState({ file: file });

			this.props.fileHandler(file);
		},

		render: function () {
			return (
				<div className={'drop-zone ' + (this.state.active ? 'active' : '')} onDragOver={this.handleDragOver} onDragLeave={this.handleDragLeave} onDrop={this.handleDrop}>
					{this.state.file ? this.state.file.name : this.props.children}
				</div>
			);
		}
	});

})();
