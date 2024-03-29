// Enable WebMidi API and handle any errors if it fails to enable.
// This is necessary to work with MIDI devices in the web browser.
await WebMidi.enable();
// importing our MusicNotation class.
import MusicNotation from "./MusicNotation.js";

// let key = 60;
let velocity = 127;
let tempo = 120;
const notation = new MusicNotation(tempo);

// Initialize variables to store the first MIDI input and output devices detected.
// These devices can be used to send or receive MIDI messages.
let myInput = WebMidi.inputs[0];
let myOutput = WebMidi.outputs[0].channels[1];

// Get the dropdown elements from the HTML document by their IDs.
// These dropdowns will be used to display the MIDI input and output devices available.
let dropIns = document.getElementById("dropdown-ins");
let dropOuts = document.getElementById("dropdown-outs");

// For each MIDI input device detected, add an option to the input devices dropdown.
WebMidi.inputs.forEach(function (input, num) {
  dropIns.innerHTML += `<option value=${num}>${input.name}</option>`;
});

// Similarly, for each MIDI output device detected, add an option to the output devices dropdown.
WebMidi.outputs.forEach(function (output, num) {
  dropOuts.innerHTML += `<option value=${num}>${output.name}</option>`;
});

// Add an event listener for the 'change' event on the input devices dropdown.
dropIns.addEventListener("change", function () {
  // Before changing the input device, remove any existing event listeners
  // to prevent them from being called after the device has been changed.
  if (myInput.hasListener("noteon")) {
    myInput.removeListener("noteon");
  }
  if (myInput.hasListener("noteoff")) {
    myInput.removeListener("noteoff");
  }

  // Change the input device based on the user's selection in the dropdown.
  myInput = WebMidi.inputs[dropIns.value];

  // After changing the input device, add new listeners for 'noteon' and 'noteoff' events.
  // These listeners will handle MIDI note on (key press) and note off (key release) messages.

  // event listener for Tempo updates
  let tempoInput = document.getElementById("tempo");
  let tempo = parseInt(tempoInput.value);
  notation.updateMM(tempo);

  // Right now I'm just trying to make sure that my MusicNotation class doesn't need to be updated and that I can get messages through.
  myInput.addListener("noteon", function (event) {
    let key = event.note.number;
    let velocity = event.note.velocity;
    myOutput.send([0x90, key, velocity]); // Note on message format: [status, note, velocity]
  });

  console.log(myOutput.send);
});

myInput.addListener("noteoff", function (event) {
  let key = event.note.number;
  setTimeout(myOutput.send([0x80, key, 0]), notation.quarter); // Note off message format: [status, note, velocity] with the quarter function from musicnotation.js
});
// });

// Add an event listener for the 'change' event on the output devices dropdown.
dropOuts.addEventListener("change", function () {
  // Change the output device based on the user's selection in the dropdown.
  // The '.channels[1]' specifies that the script should use the first channel of the selected output device.
  // MIDI channels are often used to separate messages for different instruments or sounds.
  myOutput = WebMidi.outputs[dropOuts.value].channels[1];
});

// for keeping track of where we are in the lick
let index = 0;

// Function to send a MIDI note on message
const attack = function (key) {
  myOutput.send([0x90, key, velocity]);
};

// Function to send a MIDI note off message
const release = function (key) {
  myOutput.send([0x80, key, 0]);
};

// Function to play a note with specified duration
const playNote = function (noteValue, key) {
  // Schedule note attack after a delay
  setTimeout(function () {
    attack(key);
  }, index);

  // Schedule note release after the specified duration
  setTimeout(function () {
    release(key);
  }, index + noteValue);

  // Increment index for the next note
  index = index + noteValue;
};

// This function will eventually replace the above noteon and off messages.
const playTheLick = function (key, velocity) {
  // root note
  playNote(notation.eighth, key);
  // next notes
  playNote(notation.eighth, key + 2);
  playNote(notation.eighth, key + 3);
  playNote(notation.eighth, key + 5);
  playNote(notation.quarter, key + 2);
  playNote(notation.eighth, key - 2);
  playNote(notation.eighth + notation.whole, key);
};
