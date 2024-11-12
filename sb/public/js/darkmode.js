// darkmode.js
document.addEventListener('DOMContentLoaded', () => {
    // Check localStorage for dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';

    // If dark mode is enabled, add the 'dark-mode' class to the body
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    // Check if there's a dark mode toggle on the current page
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        // Set toggle state based on current dark mode status
        toggle.checked = isDarkMode;

        // Add an event listener to the toggle switch
        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                // Enable dark mode
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled'); // Save preference
            } else {
                // Disable dark mode
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'disabled'); // Save preference
            }
        });
    }
});
