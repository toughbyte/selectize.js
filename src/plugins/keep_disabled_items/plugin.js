// This plugin handles disabled options and provide the below functionality:
//	 - Restricts removing the selected item if its option is disabled;
//	 - Sorts the dropdown options by disabled and selected state.
//	 - Sorts the items by disabled state when we initialize them in the input field.

// This plugin does not have any options.

// An example of usage:
// 	$('selector').selectize({
// 		plugins: ['keep_disabled_items']
// 	});

Selectize.define('handle_disabled_options', function (options) {
  var self = this;

	// Restrict removing the selected item if its option is disabled.
  self.onKeyDown = (function() {
		var original = self.onKeyDown;
		return function(e) {
			var index, option;
			if (e.keyCode === KEY_BACKSPACE) {
				index = self.caretPos - 1;
				option = this.options[this.items[index]];
				if (index >= 0 && option.disabled) {
					e.preventDefault();
					return;
				}
			}
			return original.apply(this, arguments);
		};
	})();

	// Sort the dropdown options by disabled and selected state.
	self.search = (function() {
		var original = self.search;
		return function() {
			var results = original.apply(this, arguments);
			results.items.sort(function(item1, item2) {
				return (self.options[item1.id].disabled && self.items.includes(item1.id) ? -1 : 1) -
							 (self.options[item2.id].disabled && self.items.includes(item2.id) ? -1 : 1);
			});
			return results;
		};
	})();

	// Sort the items by disabled state when we initialize them in the input field.
	self.addItems = (function() {
		var original = self.addItems;
		return function() {
			arguments[0].sort(function(item1, item2) {
				return (self.options[item1].disabled ? -1 : 1) -
							 (self.options[item2].disabled ? -1 : 1);
			});
			return original.apply(this, arguments);
		};
	})();
})
