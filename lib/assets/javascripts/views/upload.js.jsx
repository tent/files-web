/** @jsx React.DOM */

(function () {

	Drop.Views.Upload = React.createClass({
		getInitialState: function () {
			return {
				error: null
			};
		},

		handleSubmit: function (e) {
			e.preventDefault();
			// TODO: upload selected file
		},

		handleError: function (err) {
			this.setState({ error: err });
		},

		handleFile: function (file) {
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
