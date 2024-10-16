document.getElementById('save').addEventListener('click', function() {
    let originalColor = document.getElementById('original-color').value;
    let newColor = document.getElementById('new-color').value;

    // Save the color preferences
    chrome.storage.sync.set({
        originalColor: originalColor,
        newColor: newColor
    }, function() {
        alert('Colors saved! Refresh the page to apply changes.');
    });
});
