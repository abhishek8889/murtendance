// Handle toggle in product page info
$on.dom(() => {
    var toggleElement = document.getElementsByClassName('action-toggle')[0];

    if (toggleElement) {
        toggleElement.addEventListener('click', (e) => {
            e.target.closest('ul').classList.toggle('active');
        });
    }
});