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
  if (document.getElementById("dlg-text").innerHTML.length < dlgLines[dlgPointer].toString().length) {
    document.getElementById("dlg-text").innerHTML += dlgLines[dlgPointer].toString().charAt(typeindex);
    typeindex++;
    document.getElementById("triangle").hidden = document.getElementById("dlg-text").innerHTML.length != dlgLines[dlgPointer].length
    setTimeout(typeWriter, speed); //loops because of running "typeWriter" after waiting
  }
}

function nextDlg() {
  document.getElementById("triangle").hidden = true;
  if (document.getElementById("dlg-text").innerHTML.length == dlgLines[dlgPointer].length) { //check if text is typed out
    document.getElementById("triangle").hidden = true;
    if (dlgPointer < dlgLines.length - 2) { //check if dlgPointer is not at the array end
      do {
        dlgPointer++;
        if (typeof dlgLines[dlgPointer] === 'number')
          speed = 50 / dlgLines[dlgPointer];
        else if (typeof dlgLines[dlgPointer] === 'object') { }
        else if (typeof dlgLines[dlgPointer] === 'string' && String(dlgLines[dlgPointer]).startsWith("_")) {
          if (dlgLines[dlgPointer].split(":")[0] === "_title")
            document.getElementById("title").innerHTML = dlgLines[dlgPointer].split(':')[1];
        }
      }
      while (typeof dlgLines[dlgPointer] !== 'string' || String(dlgLines[dlgPointer]).startsWith("_")) //again if it's not string
      typeindex = 0;
      document.getElementById("dlg-text").innerHTML = "";
      typeWriter();
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