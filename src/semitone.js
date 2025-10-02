class JamBuddy {
  constructor() {
    this.currentSelectedNotes = null;
    this.notes = [
      "A",
      ["A#", "Bb"],
      "B",
      "C",
      ["C#", "Db"],
      "D",
      ["D#", "Eb"],
      "E",
      "F",
      ["F#", "Gb"],
      "G",
      ["G#", "Ab"],
    ];
  }

  getRandomNote() {
    const randomNote =
      this.notes[Math.floor(Math.random() * this.notes.length)];

    return Array.isArray(randomNote)
      ? randomNote[Math.floor(Math.random() * randomNote.length)]
      : randomNote;
  }

  selectNotes() {
    return (this.currentSelectedNotes = [
      this.getRandomNote(),
      this.getRandomNote(),
    ]);
  }

  calculateAnswer() {
    const note1Index = this.findIndexOfNote(0);
    const note2Index = this.findIndexOfNote(1);

    return note2Index >= note1Index
      ? note2Index - note1Index
      : note2Index + (this.notes.length - note1Index);
  }

  findIndexOfNote(selectedNoteIndex) {
    return this.notes.findIndex((note) =>
      Array.isArray(note)
        ? note.includes(this.currentSelectedNotes[selectedNoteIndex])
        : note === this.currentSelectedNotes[selectedNoteIndex]
    );
  }

  checkAnswer(answer) {
    return answer === this.calculateAnswer();
  }
}

module.exports = { JamBuddy: JamBuddy };
