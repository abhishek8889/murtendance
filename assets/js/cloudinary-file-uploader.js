/*
Handle file attachment upload to cloudinary,
and attach the attachment link within the form submit to form spree
*/
var addFileItem = function (link, originName) {
    // invoke after file confirm uploaded to cloudinary
    var filesContainer = document.getElementById('files');
    var item = document.createElement('div');
    var removeBtn = document.createElement('span');
    var attchFile = document.getElementById('attach-file');
    item.setAttribute('data-file', originName);
    item.setAttribute('data-url', link);
  
    item.innerHTML = /*html*/`
      <i class="fa fa-file-text-o" aria-hidden="true"></i>
      <span>${originName}</span>
    `;
  
    removeBtn.setAttribute('class', 'remove-btn');
    removeBtn.setAttribute('style', 'cursor:pointer;');
    removeBtn.innerHTML = '<i class="fa fa-close"></i>';
    removeBtn.addEventListener('click', function() {
      item.remove();
    }, false);
    item.appendChild(removeBtn);
    filesContainer.appendChild(item);
  };
  
  var createAttachmentLink = function () {
    // invoke this function only at submit
  
    var form = document.getElementById('form-formspree');
    var links = document.querySelectorAll('#files [data-file]');
  
    // create hidden input contains attachment link
    links.forEach(function (el, idx) {
      var hiddenInput = document.createElement('input');
      hiddenInput.setAttribute('type', 'hidden');
      hiddenInput.setAttribute('name', 'attachment-link-' + (idx + 1));
      hiddenInput.value = el.dataset.url;
      console.log(el.dataset.url);
      form.appendChild(hiddenInput);
      console.log(hiddenInput);
    });
  };
  
  // cloudinary config
  var config = {
    cloudName: "boleancdn",
    uploadPreset: "mur_tendance"
  };
  
  // create upload widget
  var widget = cloudinary.createUploadWidget(config, (error, result) => {
    var attchFile = document.getElementById('attach-file');
    if (result && result.event === "success") {
      addFileItem(result.info.secure_url, result.info.original_filename);
    }
  });
  
  // open cloudinary file upload widget on click
  var openFileUploadWidget = function () {
    var attchFile = document.getElementById('attach-file');
    attchFile.addEventListener('click', function() {
      widget.open();
    }, false);
  };
  
  openFileUploadWidget();
  