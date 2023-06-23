var speed = 50;
var typeindex = 0;
var dlgPointer = localStorage.getItem("dlgPointer");
var dlgFile;
var dlgKeyMain = localStorage.getItem("dlgKeyMain");
let dlgLines;
var skipDlg = false;
var answers;
var keys;
var allowNextDlg = true;
var voice;
var playerName;
var enemyHealth = 0, enemyDamage = 1, enemyStartsHit = false;
var health = 25;
var weaponName = localStorage.getItem("weaponName"), continueCount = true;
var weaponDamage = localStorage.getItem("weaponDamage");
var counttx = 0, countup = true;

//TODO
//simple fights
//save file in local storage

window.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  speed = 0;
})

function load() {
  if (!localStorage.getItem("dlgPointer"))
    dlgPointer = 0;
  if (!localStorage.getItem("dlgKeyMain"))
    dlgKeyMain = "main";
  if (!localStorage.getItem("weaponName"))
    weaponName = "Fäuste";
  if (!localStorage.getItem("weaponDamage"))
    weaponDamage = 1;
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
  if (typeof dlgFile[dlgKey] === "string") {
    var oneline = [dlgFile[dlgKey]];
    dlgLines = oneline;
  }
  else if (Array.isArray(dlgFile[dlgKey]))
    dlgLines = dlgFile[dlgKey];
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
  speed = 50;
  if (document.getElementById("dlg-text").innerHTML.length == dlgLines[dlgPointer].length && allowNextDlg || skipDlg) {
    skipDlg = false;
    if (dlgPointerIncrease)
      dlgPointer++;
    if (dlgPointer < dlgLines.length) {
      if (typeof dlgLines[dlgPointer] === 'number') {
        speed = 50 / dlgLines[dlgPointer];
        skipDlg = true;
        nextDlg();
      }
      else if (typeof dlgLines[dlgPointer] === 'string') {
        if (dlgLines[dlgPointer].startsWith("_")) {
          skipDlg = true;
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
            var sound;
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
            dlgKeyMain = dlgLines[dlgPointer].split(':')[1];
            load();
            dlgPointer = 0;
          }
          else if (dlgLines[dlgPointer].split(":")[0] === "_lock") {
            nextDlg();
          }
          else if (dlgLines[dlgPointer].split(":")[0] === "_weapon") {
            weaponName = dlgLines[dlgPointer].split(':')[1];
            weaponDamage = dlgLines[dlgPointer].split(':')[2];
            console.log(weaponDamage);
            nextDlg();
          }
          else if (dlgLines[dlgPointer].split(":")[0] === "_enemy") {
            document.getElementById("enemy-name").innerHTML = dlgLines[dlgPointer].split(":")[1];
            document.getElementById("enemy-texture").src = "text_horror/assets/textures/" + dlgLines[dlgPointer].split(":")[2] + ".png";
            enemyHealth = dlgLines[dlgPointer].split(":")[3];
            enemyDamage = dlgLines[dlgPointer].split(":")[4];
            countWeaponDamage();
            document.getElementById("enemy-health").innerHTML = enemyHealth;
            document.getElementById("weapon").innerHTML = weaponName;
            document.getElementById("health").innerHTML = health;
            document.getElementById("fight").style.visibility = "unset";
            document.getElementById("dlg-text").innerHTML = "";
            document.getElementById("bubble").hidden = true;
            document.getElementById("answer-box").hidden = true;
            document.getElementById("triangle").hidden = true;
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
  dlgPointer = 0;
  allowNextDlg = true;
  skipDlg = true;
  nextDlg(false);
  for (let j = 0; j < keys.length; j++) {
    answers.item(j).innerHTML = "";
  }
}

function fight() {
  continueCount = false;
  if (!enemyStartsHit) {
    if (!continueCount) {
      enemyStartsHit = true;
      setTimeout(() => {
        enemyHealth = enemyHealth - counttx;
        if (enemyHealth < 1) {
          setTimeout(() => {
            document.getElementById("fight").style.visibility = "hidden";
            document.getElementById("bubble").hidden = false;
            document.getElementById("triangle").hidden = false;
            health = 25;
            nextDlg();
          }, 1000);
        }
        document.getElementById("enemy-health").innerHTML = enemyHealth
        document.getElementById("weapon-damage").innerHTML = weaponDamage
        setTimeout(() => {
          health = health - enemyDamage
          document.getElementById("health").innerHTML = health;
          if (health > 0) {
            enemyStartsHit = false;
            continueCount = true;
            countWeaponDamage();
          }
          else
            setTimeout(() => { document.getElementById("fight").style.visibility = "hidden"; }, 1000);
        }, 2000);
      }, 100);
    } else
      countWeaponDamage();
  }
}

function countWeaponDamage() {
  if (countup) {
    ++counttx;
    if (counttx >= weaponDamage)
      countup = false;
  }
  else {
    --counttx;
    if (counttx <= 0)
      countup = true;
  }
  document.getElementById("weapon-damage").innerHTML = counttx;
  if (continueCount)
    setTimeout(countWeaponDamage, 100);
}
