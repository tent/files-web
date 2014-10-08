/** @jsx React.DOM */
(function () {

"use strict";

Drop.Views.ContactSelector = React.createClass({
	displayName: 'Drop.Views.ContactSelector',

	// callback accepts a single value/displayText object
	// must always produce a response (using the value as the displayText if nessisary)
	findContact: function (entity, callback) {
		if (entity === "all") {
			callback({
				group: true,
				value: entity,
				displayText: "Everyone",
				displayIcon: "unlock"
			});
			return;
		}

		var self = this;
		TentContacts.find(entity, function (profile) {
			callback({
				value: profile.entity,
				displayText: profile.name,
				displayImageURL: self.getAvatarURL(profile)
			});
		});
	},

	// callback accepts an array of value/displayText objects
	searchContacts: function (queryString, callback) {
		if (queryString.toLowerCase() === "everyone") {
			callback([{
				group: true,
				value: "all",
				displayText: "Everyone",
				displayIcon: "unlock"
			}]);
			return;
		}

		var self = this;
		TentContacts.search(queryString, function (profiles) {
			if (profiles.length === 0) {
				if (/https?:\/\//.test(queryString)) {
					callback([{
						value: queryString,
						displayText: queryString
					}]);
				} else {
					callback([]);
				}
				return;
			}

			callback(profiles.map(function (profile) {
				return {
					value: profile.entity,
					displayText: profile.name,
					displayImageURL: self.getAvatarURL(profile)
				};
			}));
		});
	},

	getAvatarURL: function (profile) {
		if (profile.avatarDigest) {
			return Drop.client.getNamedURL('attachment', [{
				entity: profile.entity,
				digest: profile.avatarDigest
			}]);
		} else {
			return Drop.Helpers.sigilURL(profile.entity, { w: 60 });
		}
	},

	hidePicker: function () {
		this.refs.multiselect.hidePicker();
	},

	render: function () {
		var Multiselect = Drop.Views.Multiselect;
		return (
			<Multiselect
				ref="multiselect"
				selectedValues={this.props.selectedEntities}
				itemLookup={this.findContact}
				itemFuzzyLookup={this.searchContacts}
				handleChangeSelection={this.props.handleChangeSelection}
				handleKeyDown={this.props.handleKeyDown}
				focusNextInput={this.props.focusNextInput} />
		);
	}
});

})();
