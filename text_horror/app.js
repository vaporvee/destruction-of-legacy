var speed = 50;
var dlgLines = ["Hello welcome to TextHorror", "This is the second line"];
var dlgPointer = 0;

var i = 0;
function typeWriter() {
  if (document.getElementById("bubble").innerHTML.length - 1 < dlgLines[dlgPointer].length) {
    document.getElementById("bubble").innerHTML += dlgLines[dlgPointer].charAt(i);
    i++;
    setTimeout(typeWriter, speed);//loops because of running "typeWriter" after waiting
  }
}

function mouseClick() {
  if (document.getElementById("bubble").innerHTML.length == dlgLines[dlgPointer].length) {
    if (dlgPointer < dlgLines.length - 1) {
      dlgPointer++;
      i = 0;
      document.getElementById("bubble").innerHTML = "";
      typeWriter();
    } else {
      document.getElementById("bubble").hidden = true;
      document.getElementById("triangle").hidden = true;
    }
  }
}