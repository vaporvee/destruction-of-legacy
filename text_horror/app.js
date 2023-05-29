var speed = 50;
var typeindex = 0;
var dlgPointer = 0;
var dlgFile;
let dlgLines;
var skipDlg = false;
var answers;
var keys;
var allowNextDlg = true;

function load() {
  fetch("text_horror/dialogue.json")
    .then(Response => Response.json())
    .then(data => {
      dlgFile = data;
      changeDlg("start");
      skipDlg = true;
      nextDlg(false);
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
  console.log(dlgLines[dlgPointer]);
  typeindex = 0;
  document.getElementById("dlg-text").innerHTML = "";
  document.getElementById("triangle").hidden = true;
  typeWriter();
}

function typeWriter() {
  if (typeindex < dlgLines[dlgPointer].length) {
    document.getElementById("dlg-text").innerHTML += dlgLines[dlgPointer].charAt(typeindex);
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