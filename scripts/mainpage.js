function confirmChoice() {
    var mode = document.getElementById("mode").value;
    var game = document.getElementById("game").value; console.log('Game is',game);
    var difficulty = document.getElementById("difficulty").value;

    // Add a forward slash between "scripts/html" and the rest of the file path
    var url = "scripts/html/" + mode + "-" + game + "-" + difficulty + ".html";

    // Redirect to the selected page
    window.location.href = url;
}