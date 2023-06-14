(function(exports){
'use strict';

/**
 * Utility library to simplify common JavaScript operations.
 *
 * @license
 * Copyright (c) 2017 Brian Edmonds
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var $id = document.getElementById.bind(document);
exports.$id = $id;

// Listen for +evt+ on +el+ with callback +fn+.
/**
 * Shorthand to add an event callback to an element.
 *
 * @param {object} el - Element to bind the event listener to.
 * @param {string} evt - Type of event to listen for. For example 'click'.
 * @param {Function} fn - Callback to invoke.
 */
function $e(el, evt, fn) {
  el.addEventListener(evt, fn);
};
exports.$e = $e;

/**
 * Create a new DOM Element, with optional child elements.
 *
 * @param {string} tagName - Type of element to create.
 * @param {Array} children - (optional) Nodes to insert into the new element.
 * @param {Object} options - (optional) Additional options.
 * @returns {HTMLElement}
 */

function $mkele(tagName, children, css){
  // Safari, IE and Opera do not support default parameters.
  children = children || [];

  var el = document.createElement(tagName);

  if (!$isUndef(css) && !$isNull(css)) {
    var parts = css.split(' ');
    while (parts.length > 0) el.classList.add(parts.pop());
  }

  if (children === null) return el;

  if (children.constructor === Array) {
    $each(children, function(i){ $dom.add(el, i); });
  } else if(children.constructor === String) {
    $dom.add(el, $mktxt(children));
  }

  return el;
}
exports.$mkele = $mkele;

/**
 * Insert a stylesheet into the document.
 *
 * @param {string} href - URL of the stylesheet to add.
 */
function $stylesheet(href) {
  var link = $mkele('link', null);
  link.rel = 'stylesheet';
  link.href = href;

  $dom.add(document.body, link);
}
exports.$stylesheet = $stylesheet;

/**
 * @alias document.createTextNode
 */
var $mktxt = document.createTextNode.bind(document);
exports.$mktxt = $mktxt;

/**
 * @alias document.querySelector
 */
function $first(sel, owner) {
  owner = owner || document;
  return owner.querySelector(sel);
}
exports.$first = $first;

/**
 * @alias document.querySelectorAll
 **/
function $all(sel, owner) {
  owner = owner || document;
  return owner.querySelectorAll(sel);
}
exports.$all = $all;

/**
 * Shorthand to retrieve an attribute from an element.
 *
 * @param {HTMLElement} element - The element to probe.
 * @params {string} attr - The attribute's name.
 * @returns The attribute's value.
 */
function $get(element, attr) { return element.getAttribute(attr); }
exports.$get = $get;

/**
 * Shorthand to set the value of an attribute on an element.
 *
 * @param {HTMLElement} element - The element to work on.
 * @param {string} attr - The attribute's name.
 * @param value - The value to give to the attribute.
 */
function $set(element, attr, value) { element.setAttribute(attr, value); }
exports.$set = $set;

/**
 * Return true if the supplied argument is undefined.
 * @return {boolean}
 */
function $isUndef(i) { return (typeof i === 'undefined'); }
exports.$isUndef = $isUndef;

/**
 * Return true if the supplied argument is null.
 * @return {boolean}
 */
function $isNull(i)  { return i === null; }
exports.$isNull = $isNull;

/**
 * Return true if the supplied argument is neither null nor undefined.
 * @return {boolean}
 */
function $isReal(i) { return !$isUndef(i) && !$isNull(i); }
exports.$isReal = $isReal;

/**
 * Run +fn+ for each element of +list+.
 *
 * +fn+ is expected to take one argument, which is an element of +list+.
 *
 * Because it's useful to have forEach functionality on HTMLElement
 * Collections.
 *
 * @param {Iterable} list - List to iterate through.
 * @param {Function} fn - Function taking one argument.
 */
function $each(list, fn) {
  for (var i = 0, len = list.length; i < len; ++i) {
    fn(list[i], i);
  }
};
exports.$each = $each;

/**
 * Add all properties in +props+ to +obj+, overwriting
 * existing ones with the same name.
 *
 * @param {Object} obj - Object to extend.
 * @param {Object} props - Object to copy onto obj.
 */
function $extend(obj, props) {
  if (!$isReal(props) || !$isReal(obj)) return;

  var copy = JSON.parse(JSON.stringify(obj));
  var props = JSON.parse(JSON.stringify(props));

  return Object.assign(copy, props);
}
exports.$extend = $extend;

function $defer(fn, t) {
  return function() {
    clearTimeout(t);
    t = setTimeout(fn, 25);
  };
}
exports.$defer = $defer;

/**
 * Return an array of items built from the return value of +fn+,
 * run once for each member of +list+.
 *
 * +fn+ is expected to take one or two arguments: the fist if the
 * current element of +list+ and the second the current array index.
 *
 * @param {Iterable} list
 * @param {Function} fn
 * @returns {Array} of the same length as +list+.
 **/
function $map(list, fn) {
  var out = [];

  for (var i = 0, len = list.length; i < len; ++i) {
    out.push(fn(list[i], i));
  }

  return out;
}
exports.$map = $map;

/**
 * Attempt to dig through nested objects for a value.
 *
 * +propList+ is expected to be a string of properties
 * separated by periods.
 *
 * @param {Object} obj
 * @param {String} propList
 * @returns {Any|Null} the value if found, or null.
 **/
function $dig(obj, propList) {
  var props = propList.split('.');
  var cur;

  while (props.length > 0) {
    cur = props.shift();
    obj = obj[cur];

    if ($isUndef(obj) || $isNull(obj)) return null;
  }

  return obj;
}
exports.$dig = $dig;

// Aliases for common DOM manipulations.
var $dom = {
  add: function(node, child, before) {
    if ($isUndef(before) || $isNull(before)) {
      node.appendChild(child);
    } else {
      node.insertBefore(child, before);
    }
  },

  rm: function(el) {
    if ($isUndef(el) || $isNull(el)) return;

    el.parentNode.removeChild(el);
  }
};
exports.$dom = $dom;

const $animate = (el, klass, initial, offsetMultiplier = 0.25) => {
	el.classList.add(initial);

	$on.scroll(() => {
		if (el.classList.contains(klass)) return;
		if (window.scrollY < el.offsetTop - (window.innerHeight * offsetMultiplier)) return;
		console.log(el);
		el.classList.add(klass);
	});
};
exports.$animate = $animate;

const $on = {
  resize: fn => $e(window, 'resize', $defer(fn)),
  scroll: fn => $e(window, 'scroll', $defer(fn)),
  load: fn => $e(window, 'load', fn),
  dom: fn => $e(document, 'DOMContentLoaded', fn),
};
exports.$on = $on;

const $fas_icon = (icon) => {
  const el = $mkele('i', null);
  el.className = `fas fa-fw fa-${icon}`;
  return el;
}
exports.$fas_icon = $fas_icon;

const $hijack = (fn) => (evt) => {
  evt.preventDefault();
  fn(evt)
};
exports.$hijack = $hijack;

})(window);
