/** @jsx React.DOM */

(function () {

	"use strict";

	var navItems = [
		{ fragment: "files", iconName: "files-o", name: "Files" },
		{ fragment: "inbox", iconName: "inbox", name: "Inbox" }
	];

	Drop.Views.AppNav = React.createClass({
		displayName: 'Drop.Views.AppNav',

		getInitialState: function () {
			return {
				navItems: navItems,
				activeFragment: null,
				menuActive: false
			};
		},

		handleMenuToggleClick: function (e) {
			e.preventDefault();
			this.setState({ menuActive: !this.state.menuActive });
		},

		render: function () {
			var AppNavItem = Drop.Views.AppNavItem;
			var navItems = this.state.navItems;
			if (this.props.authenticated) {
				navItems = navItems.concat([{ fragment: "signout", iconName: "power-off", name: "Sign out" }]);
			} else {
				navItems = navItems.concat([{ fragment: "signin", iconName: "power-off", name: "Sign in" }]);
			}
			navItems = navItems.map(function (item) {
				return <AppNavItem key={item.fragment} fragment={item.fragment} active={item.fragment === this.state.activeFragment} iconName={item.iconName} name={item.name} disabled={ !this.props.authenticated } />;
			}.bind(this));
			return (
				<div>
					<a className="menu-switch js-menu-switch" onClick={this.handleMenuToggleClick}>Menu</a>
					<ul className={"unstyled app-nav-list"+ (this.state.menuActive ? ' show' : '')}>
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
			if ( !this.props.disabled ) {
				Marbles.history.navigate(this.props.fragment, { trigger: true });
			}
		},

		render: function () {
			return (
				<a className={(this.props.active ? 'active' : '') + (this.props.disabled ? ' disabled' : '') } href={this.fragmentPath(this.props.fragment)} onClick={this.handleClick}>
					<li>
						<i className={"fa fa-" + this.props.iconName}></i>{this.props.name}
					</li>
				</a>
			);
		}
	});

})();
