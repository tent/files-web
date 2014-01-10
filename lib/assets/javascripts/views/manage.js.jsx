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
			var rows = [],
					model;
			if (this.state.models) {
				for (var i = 0, _ref = this.state.models, _len = _ref.length; i < _len; i++) {
					model = _ref[i];
					rows.push(
						<tr key={model.cid}>
							<td>{model.get('file_meta.name')}</td>
							<td><a href={model.get('link')}>download</a></td>
							<td>{model.get('file_meta.size')}</td>
							<td>{model.get('file_meta.type')}</td>
							<td>{model.get('published_at')}</td>
						</tr>
					);
				}
			}

			return (
				<table>
					<thead>
						<tr>
							<th>Filename</th>
							<th>Link</th>
							<th>Size</th>
							<th>Type</th>
							<th>Date</th>
						</tr>
					</thead>

					<tbody>
						{rows}
					</tbody>
				</table>
			);
		}
	});

})();
