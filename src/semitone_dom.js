const { JamBuddy } = require("./semitone.js");
const {
  removeAnswerMessage,
  toggleInputs,
  clearContent,
} = require("./ui_handler_functions.js");
const {
  domElements,
  messages,
  classObject,
  tagObject,
} = require("./helper_objects.js");
const jamBuddy = new JamBuddy();

let streak;
let selectedNotes = [];
let lastSelectedNotes = [];
let lastAnsweredCorrectly = false;

domElements.randomNotesButton.addEventListener("click", getRandomNotes);
domElements.giveUpButton.addEventListener("click", giveUp);
domElements.restartButton.addEventListener("click", restart);
domElements.userAnswerInput.addEventListener("input", getUserAnswer);
domElements.submitAnswerButton.addEventListener("click", submitAnswer);

document.addEventListener("DOMContentLoaded", () => {
  getRandomNotes();
});

function getRandomNotes() {
  clearContent({
    value: [domElements.userAnswerInput],
    innerHTML: [domElements.explanation],
    text: [domElements.answerMessage],
  });
  toggleInputs(
    [
      domElements.userAnswerInput,
      domElements.submitAnswerButton,
      domElements.giveUpButton,
      domElements.restartButton,
    ],
    false
  );
  if (!selectedNotes.length) {
    streak = 0;
    domElements.streakDisplay.textContent = `Streak: ${streak}`;
  }
  selectedNotes = jamBuddy.selectNotes();
  domElements.randomNotesElement.textContent = selectedNotes.join(" - ");
  randomNotesClicked = true;
  lastSelectedNotes = [];
  lastAnsweredCorrectly = false;
}

function giveUp() {
  clearContent({
    value: [domElements.userAnswerInput],
    innerHTML: [domElements.explanation],
    text: [domElements.answerMessage],
  });
  toggleInputs(
    [domElements.userAnswerInput, domElements.submitAnswerButton],
    true
  );
  jamBuddy.notes.forEach((note) => {
    const noteElement = document.createElement(tagObject.div);
    noteElement.classList.add(classObject.bubble);

    if (Array.isArray(note)) {
      const highlightedNotes = note.map((currentNote) => {
        if (
          currentNote === jamBuddy.currentSelectedNotes[0] ||
          currentNote === jamBuddy.currentSelectedNotes[1]
        ) {
          const highlightedNote = document.createElement(tagObject.span);
          highlightedNote.textContent = currentNote;
          highlightedNote.classList.add(classObject.green);
          return highlightedNote.outerHTML;
        }
        return currentNote;
      });
      noteElement.innerHTML = highlightedNotes.join(" / ");
    } else if (
      note === jamBuddy.currentSelectedNotes[0] ||
      note === jamBuddy.currentSelectedNotes[1]
    ) {
      const highlightedNote = document.createElement(tagObject.span);
      highlightedNote.textContent = note;
      highlightedNote.classList.add(classObject.green);
      noteElement.appendChild(highlightedNote);
    } else {
      noteElement.textContent = note;
    }
    domElements.explanation.appendChild(noteElement);
  });
  const answerElement = document.createElement(tagObject.p);
  answerElement.innerHTML = `Answer: ${jamBuddy.calculateAnswer()}`;
  domElements.explanation.appendChild(answerElement);
}

function restart() {
  toggleInputs(
    [
      domElements.userAnswerInput,
      domElements.giveUpButton,
      domElements.restartButton,
    ],
    false
  );
  toggleInputs([domElements.submitAnswerButton], true);
  clearContent({
    innerHTML: [domElements.explanation],
    text: [domElements.answerMessage],
    value: [domElements.userAnswerInput],
  });
  selectedNotes = [];
  getRandomNotes();
  randomNotesClicked = false;
}

function getUserAnswer() {
  const parsedInput = parseInt(domElements.userAnswerInput.value.trim());
  toggleInputs([domElements.submitAnswerButton], true);
  if (isNaN(parsedInput)) {
    domElements.answerMessage.textContent = messages.invalidInputMessage;
    removeAnswerMessage(5000);
  } else if (parsedInput < 0 || parsedInput > 11) {
    domElements.answerMessage.textContent = messages.validNumberMessage;
    removeAnswerMessage(5000);
  } else {
    toggleInputs([domElements.submitAnswerButton], false);
  }
}

function submitAnswer() {
  const parsedInput = parseInt(domElements.userAnswerInput.value.trim());
  const isCorrect = jamBuddy.checkAnswer(parsedInput);
  clearContent({ value: [domElements.userAnswerInput] });

  if (isNaN(parsedInput) || parsedInput < 0 || parsedInput > 11) {
    domElements.answerMessage.textContent = `${messages.invalidInputMessage}. ${messages.validNumberMessage}`;
  } else {
    if (
      isCorrect &&
      !lastAnsweredCorrectly &&
      !lastSelectedNotes.includes(selectedNotes.join("-"))
    ) {
      jamBuddy.notes.forEach((note) => {
        const noteElement = document.createElement(tagObject.div);
        noteElement.classList.add(classObject.bubble);

        if (Array.isArray(note)) {
          const highlightedNotes = note.map((currentNote) => {
            if (
              currentNote === jamBuddy.currentSelectedNotes[0] ||
              currentNote === jamBuddy.currentSelectedNotes[1]
            ) {
              const highlightedNote = document.createElement(tagObject.span);
              highlightedNote.textContent = currentNote;
              highlightedNote.classList.add(classObject.green);
              return highlightedNote.outerHTML;
            }
            return currentNote;
          });
          noteElement.innerHTML = highlightedNotes.join(" / ");
        } else if (
          note === jamBuddy.currentSelectedNotes[0] ||
          note === jamBuddy.currentSelectedNotes[1]
        ) {
          const highlightedNote = document.createElement(tagObject.span);
          highlightedNote.textContent = note;
          highlightedNote.classList.add(classObject.green);
          noteElement.appendChild(highlightedNote);
        } else {
          noteElement.textContent = note;
        }
        domElements.explanation.appendChild(noteElement);
      });

      domElements.answerMessage.textContent = messages.rightAnswer;
      streak++;
      lastAnsweredCorrectly = true;
      lastSelectedNotes.push(selectedNotes.join("-"));

      domElements.userAnswerInput.disabled = true;
      domElements.submitAnswerButton.disabled = true;
    } else if (!isCorrect) {
      toggleInputs(
        [
          domElements.userAnswerInput,
          domElements.submitAnswerButton,
          domElements.giveUpButton,
        ],
        false
      );
      domElements.answerMessage.textContent = messages.wrongAnswer;

      streak = 0;

      setTimeout(() => {
        domElements.answerMessage.textContent = "";
        domElements.userAnswerInput.disabled = false;
        domElements.submitAnswerButton.disabled = false;
      }, 2000);
    }
    domElements.streakDisplay.textContent = `Streak: ${streak}`;
  }
}

module.exports = { getUserAnswer };
