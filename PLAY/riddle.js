// Add the key of each image as source to the entry so the entries by themselves are fully defined
for (let key of Object.keys(riddleData.images)) {
    riddleData.images[key].source = key;
}

function checkAnswers() {
    // Clear the wrongAnswers object before checking answers
    wrongAnswers = {};

    let totalCorrect = 0;

    const riddles = document.getElementsByClassName("riddle");
    for (let i = 0; i < riddles.length; i++) {
        const image = riddles[i].querySelector("img");
        const input = riddles[i].querySelector("input");
        const imageName = image.getAttribute("src").split('/').pop();
        let playerAnswer = input.value.toLowerCase();

        // Remove the 'correct-answer' and 'wrong-answer' classes to reset colors
        input.classList.remove("correct-answer");
        input.classList.remove("wrong-answer");

        // If input is not empty or just spaces
        if (playerAnswer.trim() === "") {
            playerAnswer = "Blank";
        }

        if (riddleData.images[imageName]) {
            const correctAnswer = riddleData.images[imageName].solution;

            // check for mistake
            if (isCloseEnough(playerAnswer, correctAnswer)) {
                totalCorrect++;
                input.classList.add("correct-answer"); // Add 'correct-answer' class
            } else {
                wrongAnswers[playerAnswer] = correctAnswer;
                input.classList.add("wrong-answer"); // Add 'wrong-answer' class
            }
        }
    }

    // TODO: Styling
    let resultMessage = "<font size=5><b><font color=#01DF01>Total correct answers: " + totalCorrect + "/" + riddles.length + "</font></b></font>";
    if (Object.keys(wrongAnswers).length > 0) {
        resultMessage += "<p></p><br><font size=5><b><font color=#FF0000>Your mistakes:</font></b></font>";
        for (let playerAnswer in wrongAnswers) {
            resultMessage += "<br>" + playerAnswer;
        }
    }

    document.getElementById("result").innerHTML = resultMessage;
}

function selectRiddleEntries(totalEntries) {
    const randomImageKeys = Object.keys(riddleData.images).sort(() => 0.5 - Math.random());
    const randomImages = [];

    for (let i = 0; i < totalEntries; ++i) {
        randomImages.push(riddleData.images[randomImageKeys[i]]);
    }
    return randomImages;
}

function addImagesToPage(imageEntries) {
    const riddlesContainer = document.getElementById('riddles-container');
    riddlesContainer.innerHTML = '';

    for (const imageEntry of imageEntries) {
        const riddleDiv = document.createElement('div');
        riddleDiv.classList.add('riddle');

        const imageElem = document.createElement('img');
        imageElem.src = riddleData.folder + imageEntry.source;
        imageElem.alt = 'Riddle picture';

        const inputElem = document.createElement('input');
        inputElem.type = 'text';
        inputElem.style = 'width: 300px; height: 40px';
        inputElem.placeholder = riddleData.type === 'ROOM' ? 'Enter room number' : 'Enter level name';

        const clueButton = document.createElement('button');
        clueButton.textContent = 'Get a clue';
        clueButton.classList.add('clue-button');
        clueButton.addEventListener('click', () => alert(imageEntry.hint));

        riddleDiv.appendChild(imageElem);
        riddleDiv.appendChild(inputElem);
        riddleDiv.appendChild(clueButton);


        riddlesContainer.appendChild(riddleDiv);
        riddlesContainer.appendChild(document.createElement("br"));
    }
}

function updateButtonText(numberOfImages) {
    const button = document.getElementById('change-amount-button');
    button.textContent = 'Change number of pictures (' + numberOfImages + ')';
}

function fillWrongAnswers() {
    const riddles = document.getElementsByClassName("riddle");
    for (let i = 0; i < riddles.length; i++) {
        const input = riddles[i].querySelector("input");
        const playerAnswer = input.value.toLowerCase();

        if (playerAnswer in wrongAnswers) {
            input.value = wrongAnswers[playerAnswer];
            input.classList.remove("wrong-answer"); // Entferne die CSS-Klasse
        } else {
            input.classList.remove("correct-answer"); // Entferne die CSS-Klasse
        }
    }
}

// check if there's a mistake and how close it has to be
function isCloseEnough(str1, str2) {
    const maxErrors = riddleData.type === 'ROOM' ? 0 : 2; // number of max possible mistakes
    let errors = 0;

    for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
        if (str1[i] !== str2[i]) {
            errors++;
            if (errors > maxErrors) {
                return false;
            }
        }
    }

    // in case of different length of strings
    errors += Math.abs(str1.length - str2.length);

    return errors <= maxErrors;
}

function imageAmount() {
    const userPrompt = prompt('Enter the number of images you want to guess (up to 10):');
    const newNumberOfImages = parseInt(userPrompt);
    console.log(newNumberOfImages);
    if (isNaN(newNumberOfImages) || newNumberOfImages <= 0 || newNumberOfImages > 10) {
        if (userPrompt !== null) {
            alert('Please enter a valid number between 1 and 10.');
        }
        return;
    }

    updateButtonText(newNumberOfImages);
    const newImages = selectRiddleEntries(newNumberOfImages);
    addImagesToPage(newImages);
}

var wrongAnswers = {}; // declare outside functions

addImagesToPage(selectRiddleEntries(10));