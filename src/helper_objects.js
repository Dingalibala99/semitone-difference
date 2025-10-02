const domElements = {
  giveUpButton: document.getElementById("giveUpButton"),
  randomNotesButton: document.getElementById("randomNotesButton"),
  restartButton: document.getElementById("restartButton"),
  userAnswerInput: document.getElementById("userAnswer"),
  submitAnswerButton: document.getElementById("submitAnswerButton"),
  answerMessage: document.getElementById("answerMessage"),
  explanation: document.getElementById("explanation"),
  streakDisplay: document.getElementById("streakDisplay"),
  randomNotesElement: document.getElementById("randomNotes"),
};

const messages = {
  validNumberMessage: "Please enter a valid number between 0 and 11.",
  invalidInputMessage: "Invalid input",
  rightAnswer: "You got it right. Well done!",
  wrongAnswer: "Wrong answer! Try again.",
};

const classObject = {
  green: "highlight-green",
  bubble: "note-bubble",
};

const tagObject = {
  div: "div",
  span: "span",
  p: "p",
};

module.exports = {
  domElements,
  messages,
  classObject,
  tagObject,
};
