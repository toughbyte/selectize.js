// This plugin allows you to select all or none options via the dropdown menu.
// This plugin is used the Bootstrap styles.

// You may pass several options to the plugin:
// - `allButton` - boolean, default `true`. If `true` then the "All" button will be added to the dropdown menu.
// - `noneButton` - boolean, default `true`. If `true` then the "None" button will be added to the dropdown menu.
// - `buttonsClass` - string. The class of the buttons.
// - `buttonGroupSize` - string. The size of the button group.

// An example of usage:
// 	$('selector').selectize({
// 		plugins: { dropdown_buttons: { buttonsClass: 'btn btn-outline-secondary',
//																	 buttonGroupSize: 'btn-group-sm' }
//		}
// 	});

Selectize.define('dropdown_buttons', function (options) {
	var dropdownButtons, allButton, noneButton, self = this;

	function selectNoneOptions() {
		if (self.items.length === 0) return;

		const alreadySelectedAndDisabledItems = self.items.filter(item => {
			return self.options[item].disabled;
		});
		if (self.items.length === alreadySelectedAndDisabledItems.length) return;

		self.items
			.filter(item => !alreadySelectedAndDisabledItems.includes(item))
			.forEach(item => self.removeItem(item, true));
		self.focus();

		self.refreshOptions();
		if (alreadySelectedAndDisabledItems.length === 0) self.$input.trigger('change');
	}

	function selectAllOptions() {
		const values =
			Object.values(self.options).filter(option => {
				const value = option.value.toString();

				return !(self.items.includes(value) || option.disabled);
			}).map(option => option.value);

		self.addItems(values);
		self.focus();

		self.lastQuery = null;
		self.setTextboxValue('');
	}

	options = $.extend({
		allButton  : true,
		noneButton : true
	}, options);

	if (options.allButton) {
		allButton =
			`<button type="button" class="${options.buttonsClass}" id="select-all">All</button>`
	}

	if (options.noneButton) {
		noneButton =
			`<button type="button" class="${options.buttonsClass}" id="select-none">None</button>`
	}

	if (!allButton && !noneButton) return;

	dropdownButtons =
		'<div class="d-flex justify-content-center">' +
			`<div class="control-buttons btn-group ${options.buttonGroupSize} w-100 my-2 mx-3">` +
				 (allButton || '') +
				 (noneButton || '') +
			'</div>' +
		'</div>'

	self.refreshOptions = (function () {
		var original = self.refreshOptions;
		return function () {
			original.apply(this, arguments);

			if (self.isLocked) return;

			// Make the dropdown menu visible.
			self.isOpen = true;
			self.refreshState();
			self.$dropdown.css({display: 'block'});

			// Check if there are no options in the dropdown menu.
			if (!self.$activeOption) {
				self.$dropdown_content.css({display: 'none'});
				self.$dropdown_buttons.removeClass('border-bottom');
			} else {
				self.$dropdown_content.css({display: 'block'});
				self.$dropdown_buttons.addClass('border-bottom');
			}
		};
	})();

	self.setup = (function() {
		var original = self.setup;
		return function() {
			original.apply(self, arguments);
			self.$dropdown_buttons = $(dropdownButtons);
			self.$dropdown.prepend(self.$dropdown_buttons);

			self.$dropdown_buttons.find('#select-all').on('click', selectAllOptions);
			self.$dropdown_buttons.find('#select-none').on('click', selectNoneOptions);
		};
	})();
});
