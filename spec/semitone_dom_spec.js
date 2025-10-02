const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync("./index.html", "utf-8");
const { document } = new JSDOM(html).window;
global.document = document;

const { messages, domElements } = require("../src/helper_objects");
const { getUserAnswer } = require("../src/semitone_dom");
const { JamBuddy } = require("../src/semitone.js");

const bundlePath = path.resolve("dist", "bundle.js");
const bundleCode = fs.readFileSync(bundlePath, "utf-8");
eval(bundleCode);

describe("semitone_dom.js", () => {
  let jamBuddy;

  beforeEach(() => {
    jamBuddy = new JamBuddy();
  });

  describe("submitButton", () => {
    it('should return "You got it right. Well done!" when the submit button is clicked', () => {
      domElements.randomNotesButton.click();
      jamBuddy.currentSelectedNotes =
        domElements.randomNotesElement.textContent.split(" - ");

      domElements.submitAnswerButton.addEventListener("click", () => {
        domElements.userAnswerInput.value = jamBuddy.calculateAnswer();
        expect(domElements.answerMessage.textContent).toBe("");
        domElements.submitAnswerButton.click();
        expect(domElements.answerMessage.textContent).toBe(
          messages.rightAnswer
        );
      });
    });

    it('should return "Wrong answer! Try again." when the submit button is clicked', () => {
      domElements.randomNotesButton.click();
      jamBuddy.currentSelectedNotes =
        domElements.randomNotesElement.textContent.split(" - ");

      domElements.submitAnswerButton.addEventListener("click", () => {
        domElements.userAnswerInput.value = "3";
        expect(domElements.answerMessage.textContent).toBe("");
        domElements.submitAnswerButton.click();
        expect(domElements.answerMessage.textContent).toBe(
          messages.wrongAnswer
        );
      });
    });

    it("should display notes with the current selected notes highlighted when the correct answer is submitted", () => {
      domElements.submitAnswerButton.addEventListener("click", () => {
        expect(domElements.answerMessage.textContent).toBe("");
        expect(domElements.streakDisplay.textContent).toBe("Streak: 0");
        const correctAnswer = jamBuddy.calculateAnswer();
        domElements.userAnswerInput.value = correctAnswer;

        domElements.submitAnswerButton.click();

        expect(domElements.answerMessage.textContent).toBe(
          messages.rightAnswer
        );
        expect(domElements.streakDisplay.textContent).toBe("Streak: 1");
        const revealedNotes =
          domElements.explanation.querySelectorAll(".note-bubble");
        expect(revealedNotes.length).toBe(jamBuddy.notes.length);
      });
    });
  });

  describe("randomNotesButton", () => {
    it("should get random notes when the randomNotesButton is clicked", () => {
      domElements.randomNotesButton;
      domElements.randomNotesButton.addEventListener("click", () => {
        const randomNotes = jamBuddy.selectNotes();
        domElements.randomNotesElement.textContent = randomNotes.join(" - ");

        expect(domElements.randomNotesElement.textContent.split(" - ")).toEqual(
          randomNotes
        );
        expect(domElements.randomNotesElement.textContent).toBe("");
        domElements.randomNotesButton.click();
        expect(domElements.randomNotesElement.textContent).not.toBe("");
      });
    });
  });

  describe("restartButton", () => {
    it("should restart the game when the restartButton is clicked", () => {
      jamBuddy.currentSelectedNotes =
        domElements.randomNotesElement.textContent.split(" - ");

      domElements.submitAnswerButton.addEventListener("click", () => {
        domElements.userAnswerInput.value = jamBuddy.calculateAnswer();
        expect(domElements.answerMessage.textContent).toBe("");
        expect(domElements.streakDisplay.textContent).toBe("Streak: 0");
        domElements.submitAnswerButton.click();
        expect(domElements.answerMessage.textContent).toBe(
          messages.rightAnswer
        );
        expect(domElements.streakDisplay.textContent).toBe("Streak: 1");
      });

      domElements.restartButton.click();

      expect(domElements.randomNotesButton.disabled).toBe(false);
      expect(domElements.streakDisplay.textContent).toBe("Streak: 0");
      expect(domElements.userAnswerInput.value).toBe("");
      expect(domElements.submitAnswerButton.disabled).toBe(false);
      expect(domElements.answerMessage.textContent).toBe("");
      expect(domElements.explanation.innerHTML).toBe("");
    });
  });

  describe("giveUpButton", () => {
    it("should give up when the giveUpButton is clicked", () => {
      expect(domElements.answerMessage.textContent).toBe("");
      expect(domElements.userAnswerInput.disabled).toBe(false);
      expect(domElements.submitAnswerButton.disabled).toBe(false);

      domElements.giveUpButton.click();

      expect(domElements.userAnswerInput.disabled).toBe(true);
      expect(domElements.submitAnswerButton.disabled).toBe(true);
      expect(domElements.explanation.innerHTML).not.toBe("");
    });

    it("should display notes with the current selected notes highlighted when the giveUpButton is clicked", () => {
      domElements.giveUpButton.click();

      const revealedNotes =
        domElements.explanation.querySelectorAll(".note-bubble");
      expect(revealedNotes.length).toBe(jamBuddy.notes.length);
    });
  });

  describe("Input handler", () => {
    it("should handle invalid input for user's", () => {
      domElements.userAnswerInput.value = "123";
      getUserAnswer(
        domElements.userAnswerInput,
        domElements.submitAnswerButton,
        domElements.answerMessage
      );

      expect(domElements.submitAnswerButton.disabled).toBe(true);
      expect(domElements.answerMessage.textContent).toBe(
        messages.validNumberMessage
      );

      domElements.userAnswerInput.value = "e";
      getUserAnswer(
        domElements.userAnswerInput,
        domElements.submitAnswerButton,
        domElements.answerMessage
      );

      expect(domElements.submitAnswerButton.disabled).toBe(true);
      expect(domElements.answerMessage.textContent).toBe(
        messages.invalidInputMessage
      );
    });
  });
});
