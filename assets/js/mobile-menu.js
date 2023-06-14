/* Menu Replacement for Mobile
 *
 * Builds a secondary menu off the primary navigation
 * and language links.
 */
(function(exports){
'use strict';

const WIDTH_MODE_BURGER = 1024;

// Cache the elements used by this module between resizes.
let $dialog = null;
let $button = null;

/* Open the mobile menu. */
const toggle = () => {
	const icon = $first('img', $button);
	const span = $first('span', $button);

	$dialog.classList.toggle('open');
	document.body.classList.toggle('mobile-menu-open');

	if ($dialog.classList.contains('open')) {
    icon.src = '/images/x-icon.svg'
		span.innerHTML = 'Fermer'
	} else {
		if (typeof paleHeader !== 'undefined') {
			icon.src = '/images/burger-black.svg';
		} else {
			icon.src = '/images/burger.svg';
		}
		span.innerHTML = '';
	}
}

/* Remove all traces that this script ever ran. */
const cleanup = () => {
	document.body.classList.remove('mobile-menu-enabled');
	document.body.classList.remove('mobile-menu-open');
	$dom.rm($id('mobile-menu'));
	$dom.rm($id('mobile-menu-toggle'));
};


/* Build the mobile menu element. */
const buildDialog = () => {

	const mainNav = $mkele('nav', [], '_main');

	$each($all('body > header a:not(#brand):not(#login-button)'), (i) => {
		$dom.add(mainNav, i.cloneNode(true));
	});

	const secNav = $mkele('nav', [], '_secondary');

	const el = $mkele('div', [mainNav, secNav]);
	el.id = 'mobile-menu';

	return el;
};

/* Build the menu toggle button */
const buildButton = () => {
	const icon = $mkele('img', []);
  icon.src = '/images/burger.svg';
	const span = $mkele('span', []);

	const el = $mkele('a', [span, icon]);
	el.id = 'mobile-menu-toggle';

	$e(el, 'click', toggle);

	return el;
};


const create = () => {
	$dialog = $dialog ? $dialog : buildDialog();
	$button = $button ? $button : buildButton();

	document.body.classList.add('mobile-menu-enabled');
	$dom.add(document.body, $dialog);
	$dom.add($first('body > header'), $button);
};

/* Responsive */
const AdjustToWidth = (evt) => {
	if ($first('.mobile-menu-open')) return;

	cleanup();

	if (window.innerWidth > WIDTH_MODE_BURGER) return;

	const intro = $id('introduction');
	if (intro && $isReal($get(intro, 'data-mobile-bg'))) {
		intro.style = `background-image: url(${$get(intro, 'data-mobile-bg')})`;
	}
	create();
};

exports.MobileMenu = {
	AdjustToWidth,
};

}(window));
