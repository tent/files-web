/** @jsx React.DOM */

(function () {

	var navItems = [
		{ fragment: "files", iconName: "files", name: "Files" }
	];

	Drop.Views.AppNav = React.createClass({
		displayName: 'Drop.Views.AppNav',

		getInitialState: function () {
			return {
				navItems: navItems,
				activeFragment: null
			};
		},

		render: function () {
			var AppNavItem = Drop.Views.AppNavItem;
			var navItems = this.state.navItems.map(function (item) {
				return <AppNavItem key={item.fragment} fragment={item.fragment} active={item.fragment === this.state.activeFragment} iconName={item.iconName} name={item.name} />;
			}.bind(this));
			return (
				<div>
					<a className="menu-switch js-menu-switch">Menu</a>
					<ul className="unstyled app-nav-list">
						{navItems}
					</ul>
				</div>
			);
		}
	});

	Drop.Views.AppNavItem = React.createClass({
		fragmentPath: function (fragment) {
			return Drop.Helpers.fullPath('/' + fragment);
		},

		handleClick: function (e) {
			e.preventDefault();
			Marbles.history.navigate(this.props.fragment, { trigger: true });
		},

		render: function () {
			return (
				<a className={this.props.active ? 'active' : ''} href={this.fragmentPath(this.props.fragment)} onClick={this.handleClick}>
					<li>
						<i className={"picto picto-" + this.props.iconName}></i>{this.props.name}
					</li>
				</a>
			);
		}
	});

})();
