// https://chat.openai.com/share/5a116660-a4b3-409f-8f4a-5ffcc82b1e60
// above is the link to a transcript of how I prompted chat to help me create this class as I wouldn't have been able to conceptualize this myself.

const WebMidi = require("webmidi");

class MusicNotation {
  constructor(tempo) {
    this.mm = tempo;
    this.bps = this.mm / 60;
    this.beatDuration = 1 / this.bps;
  }
  // function to update Metronome Marking with new Tempo
  updateMM(newTempo) {
    this.mm = newTempo;
    this.bps = this.mm / 60;
    this.beatDuration = 1 / this.bps;
  }

  // functions to call note values from 32nd notes up to dotted whole notes.
  async thirtySecond(noteNumber) {
    await this._playNoteWithDuration(noteNumber, this.beatDuration / 8);
  }

  async sixteenth(noteNumber) {
    await this._playNoteWithDuration(noteNumber, this.beatDuration / 4);
  }

  async eighth(noteNumber) {
    await this._playNoteWithDuration(noteNumber, this.beatDuration / 2);
  }

  async quarter(noteNumber) {
    await this._playNoteWithDuration(noteNumber, this.beatDuration);
  }

  async half(noteNumber) {
    await this._playNoteWithDuration(noteNumber, this.beatDuration * 2);
  }

  async dottedHalf(noteNumber) {
    await this._playNoteWithDuration(noteNumber, this.beatDuration * 3);
  }

  async whole(noteNumber) {
    await this._playNoteWithDuration(noteNumber, this.beatDuration * 4);
  }

  async dottedWhole(noteNumber) {
    await this._playNoteWithDuration(noteNumber, this.beatDuration * 6);
  }

  async _playNoteWithDuration(noteNumber, duration) {
    await WebMidi.enable();

    const noteOn = (note) => {
      WebMidi.outputs[0].playNote(noteNumber, 127);
    };

    const noteOff = (note) => {
      WebMidi.outputs[0].stopNote(noteNumber);
    };

    noteOn(noteNumber);
    setTimeout(() => {
      noteOff(noteNumber);
    }, duration * 1000);
  }
}

module.exports = MusicNotation;
