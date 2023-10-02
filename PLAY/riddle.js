// Add the key of each image as source to the entry so the entries by themselves are fully defined
for (let key of Object.keys(riddleData.images)) {
    riddleData.images[key].source = key;
}

function checkAnswers() {
    let wrongInputs = new Set();

    let totalCorrect = 0;

    const riddles = document.getElementsByClassName("riddle");
    for (let i = 0; i < riddles.length; i++) {
        const image = riddles[i].querySelector("img");
        const input = riddles[i].querySelector("input");
        const imageName = image.getAttribute("src").split('/').pop();
        let playerAnswer = input.value.toLowerCase().trim();

        // Remove the 'correct-answer' and 'wrong-answer' classes to reset colors
        input.classList.remove("correct-answer");
        input.classList.remove("wrong-answer");

        // If input is not empty or just spaces
        if (playerAnswer === '') {
            playerAnswer = "Blank";
        }

        if (riddleData.images[imageName]) {
            const correctAnswer = getAnswerForImageUrl(image.src);

            // check for mistake
            if (answerMatches(playerAnswer, correctAnswer)) {
                totalCorrect++;
                input.classList.add("correct-answer");
            } else {
                wrongInputs.add(playerAnswer || 'Blank');
                input.classList.add("wrong-answer");
            }
        }
    }

    let resultMessage = `<div class="result-correct-answers">Total correct answers: ${totalCorrect}/${riddles.length}</div>`;
    if (wrongInputs.size > 0) {
        resultMessage += '<div class="result-wrong-answers">Your mistakes:</div><ul>';
        wrongInputs.forEach(mistake => {
            resultMessage += `<li>${mistake}</li>`;
        });
        resultMessage += '</ul>';
    }

    document.getElementById('result').innerHTML = resultMessage;
}

function getAnswerForImageUrl(imageUrl) {
    const imageName = imageUrl.split('/').pop();

    if (!riddleData.images[imageName]) {
        throw new Error('Unexpected error: Missing riddle data for "' + imageUrl + '"');
    }
    return riddleData.images[imageName].solution;
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
        inputElem.classList.add('answer');
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
    const riddles = document.getElementsByClassName('riddle');
    for (let i = 0; i < riddles.length; i++) {
        const input = riddles[i].querySelector('input');
        const playerAnswer = input.value.toLowerCase().trim();
        if (!playerAnswer) {
            continue; // Don't fill empty fields
        }

        const img = riddles[i].querySelector('img');
        const correctAnswer = getAnswerForImageUrl(img.src);
        if (!answerMatches(playerAnswer, correctAnswer)) {
            input.classList.remove("correct-answer");
            input.classList.remove("wrong-answer");
            input.value = correctAnswer;
        }
    }
}

function answerMatches(inputAnswer, correctAnswer) {
    const maxErrors = riddleData.type === 'ROOM' ? 0 : 2; // number of max possible mistakes
    let errors = 0;

    for (let i = 0; i < Math.min(inputAnswer.length, correctAnswer.length); i++) {
        if (inputAnswer[i] !== correctAnswer[i]) {
            errors++;
            if (errors > maxErrors) {
                return false;
            }
        }
    }

    // in case of different length of strings
    errors += Math.abs(inputAnswer.length - correctAnswer.length);
    return errors <= maxErrors;
}

function promptNewNumberOfImages() {
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

addImagesToPage(selectRiddleEntries(10));