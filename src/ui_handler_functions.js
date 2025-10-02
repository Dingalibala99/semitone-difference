function clearContent({ innerHTML, text, value }) {
  if (innerHTML) innerHTML.map((elem) => (elem.innerHTML = ""));
  if (text) text.map((elem) => (elem.textContent = ""));
  if (value) value.map((elem) => (elem.value = ""));
}

function toggleInputs(arr, value) {
  arr.map((elem) => (elem.disabled = value));
}

function removeAnswerMessage(time) {
  setTimeout(() => {
    clearContent({ text: [answerMessage] });
  }, time);
}
module.exports = {
  removeAnswerMessage,
  toggleInputs,
  clearContent,
};
