chrome.storage.sync.get(['originalColor', 'newColor'], function(data) {
    let originalColor = data.originalColor || '#DF0303'; // Default original color
    let newColor = data.newColor || '#000000'; // Default new color

    // Function to replace colors
    function replaceColors() {
        const elements = document.querySelectorAll('*');
        elements.forEach(function(element) {
            const computedStyle = window.getComputedStyle(element);

            // Replace background colors
            if (computedStyle.backgroundColor === hexToRgb(originalColor)) {
                element.style.backgroundColor = newColor;
            }

            // Replace text colors
            if (computedStyle.color === hexToRgb(originalColor)) {
                element.style.color = newColor;
            }

            // Replace border colors
            if (computedStyle.borderColor === hexToRgb(originalColor)) {
                element.style.borderColor = newColor;
            }

            // Replace outline colors
            if (computedStyle.outlineColor === hexToRgb(originalColor)) {
                element.style.outlineColor = newColor;
            }

            // Handle pseudo-elements like ::before and ::after
            handlePseudoElements(element, '::before');
            handlePseudoElements(element, '::after');

            // Add hover event listeners to switch between colors
            element.addEventListener('mouseenter', function() {
                applyOriginalColor(element);
            });
            element.addEventListener('mouseleave', function() {
                applyNewColor(element);
            });

            // Check if the element is an image and handle it
            if (element.tagName.toLowerCase() === 'img') {
                handleImage(element);
            }
        });
    }

    // Function to handle pseudo-elements
    function handlePseudoElements(element, pseudo) {
        const pseudoStyle = window.getComputedStyle(element, pseudo);

        if (pseudoStyle.backgroundColor === hexToRgb(originalColor)) {
            element.style.setProperty(`background-color`, newColor, 'important');
        }

        if (pseudoStyle.color === hexToRgb(originalColor)) {
            element.style.setProperty(`color`, newColor, 'important');
        }
    }

    // Function to apply the original color on hover
    function applyOriginalColor(element) {
        const computedStyle = window.getComputedStyle(element);

        if (computedStyle.backgroundColor === hexToRgb(newColor)) {
            element.style.backgroundColor = originalColor;
        }

        if (computedStyle.color === hexToRgb(newColor)) {
            element.style.color = originalColor;
        }

        if (computedStyle.borderColor === hexToRgb(newColor)) {
            element.style.borderColor = originalColor;
        }

        if (computedStyle.outlineColor === hexToRgb(newColor)) {
            element.style.outlineColor = originalColor;
        }
    }

    // Function to apply the new color when the mouse leaves
    function applyNewColor(element) {
        const computedStyle = window.getComputedStyle(element);

        if (computedStyle.backgroundColor === hexToRgb(originalColor)) {
            element.style.backgroundColor = newColor;
        }

        if (computedStyle.color === hexToRgb(originalColor)) {
            element.style.color = newColor;
        }

        if (computedStyle.borderColor === hexToRgb(originalColor)) {
            element.style.borderColor = newColor;
        }

        if (computedStyle.outlineColor === hexToRgb(originalColor)) {
            element.style.outlineColor = newColor;
        }
    }

    // Function to handle image manipulation
    function handleImage(imageElement) {
        // For non-SVG images, try using canvas to replace the colors
        replaceImageColorsUsingCanvas(imageElement);

        // Add hover event listeners for images
        imageElement.addEventListener('mouseenter', function() {
            restoreOriginalImage(imageElement); // Restore original color on hover
        });

        imageElement.addEventListener('mouseleave', function() {
            replaceImageColorsUsingCanvas(imageElement); // Apply new color when the mouse leaves
        });
    }

    // Canvas-based image color replacement
    function replaceImageColorsUsingCanvas(imageElement) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.crossOrigin = 'Anonymous'; // Handle cross-origin issues

        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Convert newColor to RGB array
            const [newR, newG, newB] = hexToRgbArray(newColor);

            // Loop through all pixels and replace matching colors
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Check if the pixel matches the original color (within tolerance)
                if (isMatchingColor(r, g, b, originalColor)) {
                    data[i] = newR;     // Red value of the new color
                    data[i + 1] = newG; // Green value of the new color
                    data[i + 2] = newB; // Blue value of the new color
                }
            }

            // Update the image with the new colors
            ctx.putImageData(imageData, 0, 0);
            imageElement.src = canvas.toDataURL(); // Replace the original image source with the modified one
        };

        img.src = imageElement.src; // Start loading the image
    }

    // Restore the original image when hovering
    function restoreOriginalImage(imageElement) {
        imageElement.src = imageElement.src; // Reset the image back to its original source
    }

    // Helper function to check if the color matches the original (within tolerance)
    function isMatchingColor(r, g, b, hexColor) {
        const [targetR, targetG, targetB] = hexToRgbArray(hexColor);
        const tolerance = 50; // Adjust tolerance as needed

        return Math.abs(r - targetR) < tolerance &&
               Math.abs(g - targetG) < tolerance &&
               Math.abs(b - targetB) < tolerance;
    }

    // Convert hex color to an RGB array
    function hexToRgbArray(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r, g, b];
    }

    // Convert hex to rgb string for CSS comparison
    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Replace the colors on page load
    replaceColors();
});
