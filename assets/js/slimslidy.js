var SlimSlidy = function(el) {
	this.DOMElement = el;
	this.images = this.DOMElement.querySelectorAll('img');
	this.activeSlide = 0;
	this.offset = 0; // Distance between two images
	this.bullets;
	this.init();
}

SlimSlidy.prototype.init = function() {
	this.resizeImages();
	this.DOMElement.style.gridTemplateColumns = "repeat(" + this.images.length + ", 1fr)";

	// Calculate the distance between 2 images
	this.offset = (this.images[1].offsetLeft - this.images[0].offsetLeft) * -1;

	this.createBullets();
	this.bullets[this.activeSlide].classList.add('active');
	this.images[this.activeSlide].classList.add('active');
}

SlimSlidy.prototype.refresh = function() {
	this.resizeImages();

	// Calculate the distance between 2 images
	this.offset = (this.images[1].offsetLeft - this.images[0].offsetLeft) * -1;

	this.DOMElement.style.transform = "translateX(" + (this.offset * this.activeSlide) + "px)";
}

// Resize images to the slider's display size, which is calculated via CSS
SlimSlidy.prototype.resizeImages = function() {
	for (var i = 0; i < this.images.length; i++) {
		this.images[i].style.width = this.DOMElement.clientWidth + 'px';
	}
}

SlimSlidy.prototype.createBullets = function() {
	var bulletList = this.DOMElement.parentNode.querySelector('.bullets');
	var slider = this;

	// Clear the current buttons
	bulletList.innerHTML = "";

	for (var i = 0; i < this.images.length; i++) {
		var button = document.createElement('button');
		button.appendChild(document.createElement('figure'));
		button.dataset.index = i;

		button.addEventListener('click', function() {
			slider.goToSlide(this.dataset.index);
		});

		bulletList.appendChild(button);
	}

	this.bullets = bulletList.querySelectorAll('button');
}

SlimSlidy.prototype.goToSlide = function(idx) {
	this.activeSlide = idx;

	// Reset active slide
	for (var i = 0; i < this.images.length; i++) {
		this.images[i].classList.remove('active');
		this.bullets[i].classList.remove('active');
	}

	this.images[idx].classList.add('active');
	this.bullets[idx].classList.add('active');
	this.DOMElement.style.transform = "translateX(" + (this.offset * idx) + "px)";
}

SlimSlidy.prototype.prevSlide = function() {
	(this.activeSlide > 0) ? this.activeSlide-- : this.activeSlide = (this.images.length - 1);
	this.goToSlide(this.activeSlide);
}

SlimSlidy.prototype.nextSlide = function() {
	(this.activeSlide < (this.images.length - 1)) ? this.activeSlide++ : this.activeSlide = 0;
	this.goToSlide(this.activeSlide);
}

SlimSlidy.prototype.touchStart = function(e) {
  var touch;
  touch = e.changedTouches[0];
  this.touchFirstX = touch.pageX;
  this.touchFirstY = touch.pageY;
}

SlimSlidy.prototype.touchMove = function(e) {
  var touchX;
  touchX = e.changedTouches[0].pageX;
  if (Math.abs(touchX - this.touchFirstX) > 10) {
    e.preventDefault();
  }
}

SlimSlidy.prototype.touchEnd = function(e) {
  var distanceX, distanceY, touch;
  touch = e.changedTouches[0];
  distanceX = touch.pageX - this.touchFirstX;
  distanceY = touch.pageY - this.touchFirstY;
  if (Math.abs(distanceY) > 40) {
    return;
  }
  if (distanceX > 40) {
    this.prevSlide();
  }
  if (distanceX < -40) {
    this.nextSlide();
  }
}

SlimSlidy.prototype.enableTouchEvents = function() {
  var self = this;
  this.DOMElement.parentNode.addEventListener('touchstart', function(e) {
    self.touchStart(e);
  });
  this.DOMElement.parentNode.addEventListener('touchmove', function(e) {
    self.touchMove(e);
  });
  this.DOMElement.parentNode.addEventListener('touchend', function(e) {
    self.touchEnd(e);
  });
}

