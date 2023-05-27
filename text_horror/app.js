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
      dlgLines = dlgFile;
      typeWriter();
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

document.addEventListener('mousedown', mouseDown, false)
document.addEventListener('mouseup', mouseUp, false)

function mouseDown() {
  document.getElementById("triangle").hidden = true;
}

function mouseUp() {
  if (document.getElementById("dlg-text").innerHTML.length == dlgLines[dlgPointer].length) { //check if text is typed out
    document.getElementById("triangle").hidden = true;
    if (dlgPointer < dlgLines.length - 1) { //check if dlgPointer is not at the array end
      do
        dlgPointer++;
      while (!(typeof dlgLines[dlgPointer] === 'string')) //again if it's not string
      typeindex = 0;
      document.getElementById("dlg-text").innerHTML = "";
      typeWriter();
    } else {
      document.getElementById("bubble").hidden = true;
    }
  }
}