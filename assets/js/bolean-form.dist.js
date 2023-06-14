/**
Copyright (c) 2017 Brian Edmonds <brian@bedmonds.net>
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/

// Serialize the specified form into a query string.
//
// Returns a blank string if +form+ is not actually a form element.
//
// +evt+ is an optional parameter used when serializing as part of an event
// callback, such as a button's +click+ event.
function $serialize(form, evt) {
	if (typeof form !== 'object' && form.nodeName !== 'FORM') return '';

	evt = evt || window.event || { target: null };
	evt.target = evt.srcElement || evt.target || null;
	var field,
		query = '';

	// Transform a form field into a query-string-friendly
	// serialized form.
	//
	// [NOTE]: Replaces blank spaces from its standard '%20' representation
	//         into the non-standard (though widely used) '+'.
	var encode = function (field, name) {
		if (field.disabled) return '';

		return (
			'&' +
			(name || field.name) +
			'=' +
			encodeURIComponent(field.value).replace(/%20/g, '+')
		);
	};

	// Fields without names can't be serialized.
	var hasName = function (el) {
		return el.name && el.name.length > 0;
	};

	// Ignore the usual suspects: file inputs, reset buttons,
	// buttons that did not submit the form and unchecked
	// radio buttons and checkboxes.
	var ignorableField = function (el, evt) {
		return (
			el.type == 'file' ||
			el.type == 'reset' ||
			((el.type == 'submit' || el.type == 'button') && evt.target != el) ||
			((el.type == 'checkbox' || el.type == 'radio') && !el.checked)
		);
	};

	var parseMultiSelect = function (field) {
		var q = '';

		for (var j = field.options.length - 1; j >= 0; j--) {
			if (field.options[j].selected) {
				q += encode(field.options[j], field.name);
			}
		}

		return q;
	};

	for (i = form.elements.length - 1; i >= 0; i--) {
		field = form.elements[i];

		if (!hasName(field) || field.value == '' || ignorableField(field, evt))
			continue;

		query +=
			field.type == 'select-multiple' ? parseMultiSelect(field) : encode(field);
	}

	return query.length == 0 ? '' : query.substr(1);
}
/*
 * Name: Create Input
 * */

/*
 * example:
      creatInput({
        formNode: this.formNode(),
        type: 'hidden',
        name: '_cc',
        value: this.email
      })
 * */

(function () {
	const createInput = function (config) {
		this.formNode = config.formNode;
		this.type = config.type;
		this.name = config.name;
		this.value = config.value;

		this.targetNode = () => {
			if (typeof this.formNode !== 'string') {
				return this.formNode;
			} else {
				return document.querySelectorAll(this.formNode)[0];
			}
		};

		const input = document.createElement('input');
		input.setAttribute('type', this.type);
		input.setAttribute('name', this.name);
		input.setAttribute('value', this.value);

		this.targetNode().appendChild(input);
	};

	return (window.createInput = createInput);
})();

/* Name: bolean Form
 * Description:
 * A simple helper function to send form submission
 * via AJAX. Currently support Formspree parameter such as `_cc`
 * dependencies: [serialize.js] [create-input.js]
 * Author: Krozz Wu for bolean
 * */

(function () {
	const BoleanForm = function (config) {
		this.element = config.element;
		this.email = config.email;
		this.endpoint = config.endpoint;
		this.callback = config.callback;

		this.formNode = () => {
			return document.querySelectorAll(this.element)[0];
		};

		if (this.email !== undefined) {
			new createInput({
				formNode: this.formNode(),
				type: 'hidden',
				name: '_cc',
				value: this.email,
			});
		}

		this.postRequest = (endpoint, callback) => {
			var request = new XMLHttpRequest();
			request.open('POST', endpoint, true);
			request.setRequestHeader('accept', 'application/json');
			request.setRequestHeader(
				'Content-Type',
				'application/x-www-form-urlencoded'
			);
			request.send($serialize(this.formNode()));
			request.onreadystatechange = function () {
				if (request.readyState === 4) {
					if (request.status === 200) {
						callback.success();
					} else {
            console.log(request, 'request');
						callback.failed();
					}
				}
			};
		};

		this.formSubmit = () => {
			event.preventDefault();
			var file_upload = document.getElementById('attach-file');

			if (typeof file_upload != 'undefined' && file_upload != null) {
				createAttachmentLink();
			}
			this.postRequest(this.endpoint, this.callback);
		};

		this.formNode().addEventListener('submit', this.formSubmit, false);
	};

	return (window.BoleanForm = BoleanForm);
})();
