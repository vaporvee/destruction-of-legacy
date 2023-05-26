var speed = 50;
var typeindex = 0;
var dlgFile = {};
var dlgLines = [""];
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
  if (document.getElementById("bubble").innerHTML.length - 1 < dlgLines[dlgPointer].length) {
    document.getElementById("bubble").innerHTML += dlgLines[dlgPointer].charAt(typeindex);
    typeindex++;
    setTimeout(typeWriter, speed);//loops because of running "typeWriter" after waiting
  }
}

function mouseClick() {
  if (document.getElementById("bubble").innerHTML.length == dlgLines[dlgPointer].length) {
    if (dlgPointer < dlgLines.length - 1) {
      dlgPointer++;
      typeindex = 0;
      document.getElementById("bubble").innerHTML = "";
      typeWriter();
    } else {
      document.getElementById("bubble").hidden = true;
      document.getElementById("triangle").hidden = true;
    }
  }
}