Drop.Routers.Mixins = {
	resetScrollPosition: function () {
		var hash_fragment = window.location.hash;
		window.scrollTo(0, 0);
		if (hash_fragment !== '') {
			window.location.hash = hash_fragment;
		}
	}
};
