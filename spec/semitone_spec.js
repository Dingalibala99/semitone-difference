const { JamBuddy } = require("../src/semitone");

describe("JamBuddy", () => {
  let buddy;

  beforeEach(() => {
    buddy = new JamBuddy();
  });

  describe("selectNotes", () => {
    it("should return an array of two notes", () => {
      const notes = buddy.selectNotes();
      expect(buddy.currentSelectedNotes.length).toEqual(2);
      expect(buddy.currentSelectedNotes).toEqual(notes);
    });
  });

  describe("calculateAnswer", () => {
    it("should calculate the correct number of semitones for sharp notes", () => {
      buddy.currentSelectedNotes = ["A#", "A"];
      expect(buddy.calculateAnswer()).toEqual(11);
    });

    it("should calculate the correct number of semitones for flat notes", () => {
      buddy.currentSelectedNotes = ["Bb", "A"];
      expect(buddy.calculateAnswer()).toEqual(11);
    });

    it("should calculate the correct number of semitones for mixed sharp and flat notes", () => {
      buddy.currentSelectedNotes = ["F#", "Eb"];
      expect(buddy.calculateAnswer()).toEqual(9);
    });
  });

  describe("checkAnswer", () => {
    it("should return true if answer is correct", () => {
      buddy.currentSelectedNotes = ["A#", "A"];
      expect(buddy.checkAnswer(11)).toEqual(true);
    });

    it("should return false if answer is incorrect", () => {
      buddy.currentSelectedNotes = ["A", "B"];
      expect(buddy.checkAnswer(1)).toEqual(false);
    });
  });
});
