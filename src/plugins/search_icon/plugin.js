// This plugin adds a search kbd icon to the right side of the selectize input.

Selectize.define('search_icon', function(options) {
	var searchIcon;
	var self = this;

	searchIcon = '<kbd>S</kbd>';

	self.setup = (function() {
		var original = self.setup;
		return function() {
			original.apply(self, arguments);
			self.$control.append(searchIcon);
		};
	})();
});
