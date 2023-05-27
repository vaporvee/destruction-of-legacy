var speed = 50;
var typeindex = 0;
var dlgPointer = 0;
var dlgFile;
let dlgLines;

function load() {
  fetch("text_horror/dialogue.json")
    .then(Response => Response.json())
    .then(data => {
      dlgFile = data;
      changeDlg("start");
    })
}

function typeWriter() {
  if (document.getElementById("dlg-text").innerHTML.length < dlgLines[dlgPointer].length) {
    document.getElementById("dlg-text").innerHTML += dlgLines[dlgPointer].charAt(typeindex);
    typeindex++;
    document.getElementById("triangle").hidden = document.getElementById("dlg-text").innerHTML.length != dlgLines[dlgPointer].length
    setTimeout(typeWriter, speed); //loops because of running "typeWriter" after waiting
  }
}

function nextDlg() {
  document.getElementById("triangle").hidden = true;
  if (document.getElementById("dlg-text").innerHTML.length == dlgLines[dlgPointer].length) { //check if text is typed out
    if (dlgPointer < dlgLines.length - 1) { //check if dlgPointer is not at the array end
      do {
        if (typeof dlgLines[dlgPointer] === 'number')
          speed = 50 / dlgLines[dlgPointer];
        else if (typeof dlgLines[dlgPointer] === 'object') {
          document.getElementById("answer-box").hidden = false;
          document.getElementById("bubble").onclick = null;
          const answers = document.getElementsByClassName("answer");
          const keys = Object.keys(dlgLines[dlgPointer]);
          for (let j = 0; j < keys.length; j++) { //why is the length one smaller? Does javascript make any sense someday?
            answers.item(j).innerHTML = keys[j];
          }
          break;
        }
        else if (typeof dlgLines[dlgPointer] === 'string' && dlgLines[dlgPointer].startsWith("_")) {
          if (dlgLines[dlgPointer].split(":")[0] === "_title")
            document.getElementById("title").innerHTML = dlgLines[dlgPointer].split(':')[1];
        }
        dlgPointer++;
      }
      while (!(typeof dlgLines[dlgPointer] === 'string') || dlgLines[dlgPointer].startsWith("_")) //again if it's not string
      if (typeof dlgLines[dlgPointer] === 'string') {
        typeindex = 0;
        document.getElementById("dlg-text").innerHTML = "";
        typeWriter();
      }
    } else {
      document.getElementById("bubble").hidden = true;
      document.getElementById("answer-box").hidden = true;
    }
  }
}

function changeDlg(dlgKey = "") {
  var dlgPointer = 0;
  dlgLines = dlgFile[dlgKey];
  typeWriter();
}