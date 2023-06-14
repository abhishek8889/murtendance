(function(exports){
'use strict';

let $initialized = false;

// NOTE: We could only create these on init, but the overhead is minimal
//       on `$mkele`.
const $overlay = $mkele('div', []);
const $contents = $mkele('div', []);
const $close = $mkele('button', [$mktxt('X')]);

function init() {
	$set($overlay, 'data-dialog-box-overlay', '1');
	$set($contents, 'data-dialog-box-contents', '1');
	$set($close, 'data-dialog-box-close', '1');

	$dom.add(document.body, $overlay);
	$dom.add(document.body, $contents);
	$dom.add(document.body, $close);

	$e($close, 'click', () => close());
	$e($overlay, 'click', () => close());

	$initialized = true;
}

function close() {
	document.body.classList.remove('dialog-box-open');
	while($contents.firstChild) $dom.rm($contents.firstChild);
}

function open(contents) {
	if (!$initialized) init();

	$dom.add($contents, contents);

	$overlay.style.top = `${window.scrollY}px`;
	$contents.style.top = `calc(${window.scrollY}px + 50%)`;
	$close.style.top = `${window.scrollY}px`;

	document.body.classList.add('dialog-box-open');
}

exports.Dialog = open;
exports.CloseDialog = close;
}(window));
