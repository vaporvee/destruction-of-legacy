var speed = 50;
var typeindex = 0;
var dlgPointer = 0;
var dlgFile;
var dlgKeyMain = "main";
let dlgLines;
var skipDlg = false;
var answers;
var keys;
var allowNextDlg = true;
var voice;

//TODO
//add skipDlg with right mouse click
//simple fights
//playsound
//save file in local storage

function load() {
  fetch("text_horror/dialogue.json") //Load json file here
    .then(Response => Response.json())
    .then(data => {
      dlgFile = data;
      changeDlg(dlgKeyMain); //Set "start" key from dialogue.json
      skipDlg = true; //Allow skipping to next dialogue
      nextDlg(false); //Skip to first
    });
}

function changeDlg(dlgKey) {
  dlgPointer = 0;
  if (typeof dlgFile[dlgKey] === "string") {
    var oneline = [dlgFile[dlgKey]]
    dlgLines = oneline
  }
  else if (Array.isArray(dlgFile[dlgKey]))
    dlgLines = dlgFile[dlgKey]
}

function updateDlg() {
  typeindex = 0;
  document.getElementById("dlg-text").innerHTML = "";
  document.getElementById("triangle").hidden = true;
  typeWriter();
}

function typeWriter() {
  if (typeindex < dlgLines[dlgPointer].length) {
    document.getElementById("dlg-text").innerHTML += dlgLines[dlgPointer].charAt(typeindex);
    if (voice != null && typeindex % 3 == 1) {
      voice.load();
      voice.play();
    }
    typeindex++;
    setTimeout(typeWriter, speed);
  } else if (allowNextDlg)
    document.getElementById("triangle").hidden = false;
}

function nextDlg(dlgPointerIncrease = true) {
  if (document.getElementById("dlg-text").innerHTML.length == dlgLines[dlgPointer].length && allowNextDlg || skipDlg) {
    skipDlg = false;
    if (dlgPointerIncrease)
      dlgPointer++
    if (dlgPointer < dlgLines.length) {
      if (typeof dlgLines[dlgPointer] === 'number') {
        speed = 50 / dlgLines[dlgPointer];
        skipDlg = true
        nextDlg();
      }
      else if (typeof dlgLines[dlgPointer] === 'string') {
        if (dlgLines[dlgPointer].startsWith("_")) {
          skipDlg = true
          if (dlgLines[dlgPointer].split(":")[0] === "_title") {
            document.getElementById("title").innerHTML = dlgLines[dlgPointer].split(':')[1];
            nextDlg();
          }
          else if (dlgLines[dlgPointer].split(":")[0] === "_voice") {
            if (dlgLines[dlgPointer].split(':')[1].length != 0)
              voice = new Audio("text_horror/assets/voices/" + dlgLines[dlgPointer].split(':')[1] + ".wav");
            else
              voice = null;
            nextDlg();
          }
          else if (dlgLines[dlgPointer].split(":")[0] === "_playsound") {
            var sound
            if (dlgLines[dlgPointer].split(':')[1].length != 0) {
              sound = new Audio("text_horror/assets/sounds/" + dlgLines[dlgPointer].split(':')[1] + ".wav");
              sound.load();
              sound.play();
            }
            else
              sound = null;
            nextDlg();
          }
          else if (dlgLines[dlgPointer].split(":")[0] === "_jump") {
            dlgKeyMain = dlgLines[dlgPointer].split(':')[1]
            load()
          }
        } else
          updateDlg();
      }
      else if (typeof dlgLines[dlgPointer] === 'object') {
        allowNextDlg = false;
        document.getElementById("triangle").hidden = true;
        document.getElementById("answer-box").hidden = false;
        answers = document.getElementsByClassName("answer");
        keys = Object.keys(dlgLines[dlgPointer]);
        for (let j = 0; j < keys.length; j++) {
          answers.item(j).innerHTML = keys[j];
        }
      }
    }
    else {
      document.getElementById("bubble").hidden = true;
      document.getElementById("answer-box").hidden = true;
      document.getElementById("triangle").hidden = true;
    }
  }
}

function answered(answerId) {
  dlgFile = dlgLines[dlgPointer];
  document.getElementById("answer-box").hidden = true;
  changeDlg(document.getElementById(answerId).innerHTML);
  allowNextDlg = true;
  skipDlg = true;
  nextDlg(false);
  for (let j = 0; j < keys.length; j++) {
    answers.item(j).innerHTML = "";
  }
}