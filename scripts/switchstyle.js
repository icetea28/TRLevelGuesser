function getFallbackColorModeFromSystem() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark-mode';
    }
    return 'light-mode';
}

function switchDarkLightMode() {
    const currentMode = localStorage.getItem('tr-guesser-color') || getFallbackColorModeFromSystem();
    if (currentMode === 'light-mode') {
        setColorModeAndSave('dark-mode');
    } else {
        setColorModeAndSave('light-mode');
    }
}

function setColorModeAndSave(mode) {
    const body = document.body;
    body.className = mode;
    localStorage.setItem('tr-guesser-color', mode);
}

// Initialize color mode
(function () {
    const currentMode = localStorage.getItem('tr-guesser-color') || getFallbackColorModeFromSystem();
    setColorModeAndSave(currentMode);
})();