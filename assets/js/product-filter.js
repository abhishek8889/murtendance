(function (exports) {
	'use strict';

	// Fix style for alt position on image and text.
	function addAltStyle(elements) {
		return elements.map((item, i) => {
			item.classList.toggle('alt', i % 2 === 0);
		});
	}

	function filter(currentFilterElement, filterName) {
		let allItems = document.querySelectorAll('.product-item');
		var filters = document.querySelectorAll('.filter');

		filters.forEach((item) => item.classList.remove('current'));
		currentFilterElement.classList.add('current');

		allItems = Array.prototype.slice.call(allItems);
		allItems.forEach((item) => item.classList.remove('current'));

		const matches = allItems.filter((item) => {
			return filterName === 'all' || item.dataset.item.includes(filterName);
		});

		addAltStyle(matches);

		matches.forEach((match) => {
			return match.classList.add('current');
		});
	}

	function openDefaultTab() {
		var defaultTab = document.querySelectorAll('.defaultOpen');
		if (defaultTab) {
			$each(defaultTab, (i) => {
				i.click();
			});
		}
	}

	exports.ProductFilter = {
		init: openDefaultTab,
		filter: filter,
	};
})(window);
