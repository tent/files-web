/** @jsx React.DOM */

Drop.Views.Main = React.createClass({
	displayName: 'Drop.Views.Main',

	render: function () {
		var Upload = Drop.Views.Upload,
				Manage = Drop.Views.Manage;
		return (
			<div>
				<Upload key={this.props.model.cid} model={this.props.model} />
				<Manage key={this.props.collection.cid} collection={this.props.collection} />
			</div>
		);
	}
});
