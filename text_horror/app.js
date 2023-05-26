var i = 0;
var txt = 'Hello welcome to TextHorror!';
var speed = 50;

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("bubble").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}