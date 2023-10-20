// Retrieve and set the saved selections on page load
window.onload = function () {
    var savedMode = localStorage.getItem('savedMode');
    var savedGame = localStorage.getItem('savedGame');
    var savedDifficulty = localStorage.getItem('savedDifficulty');

    if (savedMode && savedGame && savedDifficulty) {
        document.getElementById('mode').value = savedMode;
        document.getElementById('game').value = savedGame;
        document.getElementById('difficulty').value = savedDifficulty;
    }
}

function confirmChoice() {
    var mode = document.getElementById("mode").value;
    var game = document.getElementById("game").value;
    var difficulty = document.getElementById("difficulty").value;

    // Save the selections in localStorage
    localStorage.setItem('savedMode', mode);
    localStorage.setItem('savedGame', game);
    localStorage.setItem('savedDifficulty', difficulty);

    // Construct the URL and redirect to the selected page
    var url = "scripts/html/" + mode + "-" + game + "-" + difficulty + ".html";
    window.location.href = url;
}