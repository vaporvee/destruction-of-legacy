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
  if (document.getElementById("bubble").innerHTML.length < dlgLines[dlgPointer].toString().length) {
    document.getElementById("bubble").innerHTML += dlgLines[dlgPointer].toString().charAt(typeindex);
    typeindex++;
    document.getElementById("triangle").hidden = document.getElementById("bubble").innerHTML.length != dlgLines[dlgPointer].length
    setTimeout(typeWriter, speed); //loops because of running "typeWriter" after waiting
  }
}

function mouseDown() {
  document.getElementById("triangle").hidden = true;
}

function mouseUp() {
  if (document.getElementById("bubble").innerHTML.length == dlgLines[dlgPointer].length) { //check if text is typed out
    if (dlgPointer < dlgLines.length - 1) { //check if dlgPointer is not at the array end
      do
        dlgPointer++;
      while (!(typeof dlgLines[dlgPointer] === 'string')) //again if it's not string
      typeindex = 0;
      document.getElementById("bubble").innerHTML = "";
      document.getElementById("triangle").hidden = true;
      typeWriter();
    } else {
      document.getElementById("bubble").hidden = true;
      document.getElementById("triangle").hidden = true;
    }
  }
}