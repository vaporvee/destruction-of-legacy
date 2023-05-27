var speed = 50;
var typeindex = 0;
var dlgFile = {};
let dlgLines;
var dlgPointer = 0;

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

document.addEventListener('click', nextDlg, false)

function nextDlg() {
  document.getElementById("triangle").hidden = true;
  if (document.getElementById("dlg-text").innerHTML.length == dlgLines[dlgPointer].length) { //check if text is typed out
    document.getElementById("triangle").hidden = true;
    if (dlgPointer < dlgLines.length - 1) { //check if dlgPointer is not at the array end
      do {
        if (String(dlgLines[dlgPointer]).startsWith("_")) {
          switch (dlgLines[dlgPointer].split(":")[0]) {
            case "_title":
              document.getElementById("title").innerHTML = dlgLines[dlgPointer].split(':')[1];
              break;
          }
        }
        dlgPointer++;
      }
      while (typeof dlgLines[dlgPointer] !== 'string' || String(dlgLines[dlgPointer]).startsWith("_")) //again if it's not string
      typeindex = 0;
      document.getElementById("dlg-text").innerHTML = "";
      typeWriter();
    } else {
      document.getElementById("bubble").hidden = true;
    }
  }
}

function changeDlg(dlgKey = "") {
  var dlgPointer = 0;
  dlgLines = dlgFile[dlgKey];
  typeWriter();
}