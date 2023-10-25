Selectize.define('deselect_options_via_dropdown', function () {
	var option, self = this;

	function onOptionDeselect(e) {
		option = e[0].currentTarget;
		option.classList.remove('selected');
		self.removeItem(option.dataset.value)
	}

	this.setup = (function () {
		var original = self.setup;
		return function () {
			this.settings.hideSelected = false;
			original.apply(this, arguments);

			self.$dropdown.off('mouseup click', '[data-selectable]', this.onOptionSelect);

			self.$dropdown.on('mouseup click', '[data-selectable]', function () {
				// if (arguments[0].currentTarget.classList.contains('selected')) {
				// 	onOptionDeselect(arguments);
				// } else {
					self.onOptionSelect(arguments);
				// }
			});
		};
	})();
});
