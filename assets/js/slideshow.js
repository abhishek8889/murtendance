(function(exports) {
'use strict';

const $breakpoints = [
	// Screen width, number of items per slide,
	[1000, 3],
	[460, 2],
	[0, 1],
];

const $config = {
	slideSelector: '[data-slideshow="1"] > *',
};

const resize = slider => {
	// Rebuild dots
	const dots = $first('.bullets', slider.element);
	while (dots.firstChild) $dom.rm(dots.firstChild);

	for(let i = 0; i < maxSlides(slider); ++i) {
		const dot = $mkele('li', []);
		$set(dot, 'data-slide', i);
		$e(dot, 'click', evt => { navigate(slider, $get(evt.target, 'data-slide')); });
		$dom.add(dots, dot);
	}

	// Reload current page
	// Does not account for slide count changes.
	slider.Navigate(slider.page);
};

const numSlides = slider => {
	return Math.ceil(($first('.slides', slider.element).children.length || 0) / elementsPerSlide());
};

const elementsPerSlide = () => {
	return $breakpoints.find(i => i[0] < window.innerWidth)[1];
};

const startSlide = slider => slider.page * elementsPerSlide();
const endSlide = slider => startSlide(slider) + elementsPerSlide() - 1;

const maxSlides = slider => Math.min(numSlides(slider), 12);

const navigate = (slider, page) => {
	page = page < 0 ? maxSlides(slider) - 1 : page;
	page = page > maxSlides(slider) - 1 ? 0 : page;
	slider.page = page;

	const el = $first('.slides', slider.element);

	$each(el.children, i => i.classList.add('hidden'));

	const startIdx = Math.max(0, startSlide(slider));
	const endIdx = Math.min(endSlide(slider), el.children.length - 1);

	for (var i = startIdx; i <= endIdx; ++i)
		el.children[i].classList.remove('hidden');

	// Update dot
	const dots = $first('.bullets', slider.element);
	const cur = $first('.current', dots)
	if (cur) cur.classList.remove('current');
	dots.children[page].classList.add('current');
};

const set_touch = (slider, touch) => {
    slider.touchFirstX = touch.pageX;
    slider.touchFirstY = touch.pageY;
};

const init = (slider) => {
	$set(slider.element, 'data-slideshow', 1);

	slider.slides = $all(slider.config.slideSelector, slider.element);

	// Set recurring properties.
	slider.numSlides = slider.slides.length;

	// Public API
	slider.Resize = () => resize(slider);
	slider.Navigate = page => navigate(slider, page);
  slider.SetTouchStart = touch => set_touch(slider, touch);

	// Wrap the sliders for animation purposes.
	slider.wrap = $mkele('div', [], 'slides');
	$each(slider.slides, el => $dom.add(slider.wrap, el));
	$dom.add(slider.element, slider.wrap);

	// Build navigation arrows
	const prev = $mkele('button', [$mkele('i', [], 'fas fa-chevron-left')], 'prev');
	$e(prev, 'click', function() {
		navigate(this.slider, this.slider.page - 1)
	}.bind({ slider: slider }));
	const next = $mkele('button', [$mkele('i', [], 'fas fa-chevron-right')], 'next');
	$e(next, 'click', function() {
		navigate(this.slider, this.slider.page + 1)
	}.bind({ slider: slider }));

  $dom.add(slider.element, $mkele('div', [prev, next], 'controls'));

	// Build dot navigation.
	const dots = $mkele('ul', [], 'bullets');
	for(let i = 0; i < maxSlides(slider); ++i) {
		const dot = $mkele('li', []);
		$set(dot, 'data-slide', i);
		$e(dot, 'click', evt => { navigate(slider, $get(evt.target, 'data-slide')); });
		$dom.add(dots, dot);
	}

	$dom.add(slider.element, dots);

	// Register events
	$e(window, 'resize', $defer(() => resize(slider)));
  $e(slider.element, 'touchstart', (evt) => onTouchStart(evt, slider));
  $e(slider.element, 'touchmove', (evt) => onTouchMove(evt, slider));
  $e(slider.element, 'touchend', (evt) => onTouchEnd(evt, slider));

	slider.page = 0;
};

function onTouchStart(e, slider) {
  const touch = e.changedTouches[0];
  if (!$isReal(touch)) return;

  slider.SetTouchStart(touch);
}

function onTouchMove(e, slider) {
  const touchX = e.changedTouches[0].pageX;
  if (Math.abs(touchX - slider.touchFirstX) > 10) {
    e.preventDefault();
  }
}

function onTouchEnd(e, slider) {
  const touch = e.changedTouches[0];
  const distanceX = touch.pageX - slider.touchFirstX;
  const distanceY = touch.pageY - slider.touchFirstY;
   
  if (Math.abs(distanceY) > 40) return;

  if (distanceX > 40) navigate(slider, slider.page - 1);

  if (distanceX < -40) navigate(slider, slider.page + 1);
}

function Slideshow(root, config) {
	var self = {};
	self.config = $extend($config, config);
	self.element = root;

	init(self);

	return self;
};
exports.Slideshow = Slideshow;

})(window);
