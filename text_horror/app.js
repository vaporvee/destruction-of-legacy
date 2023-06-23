// BITTE VORHER README LESEN
// some values get saved to local storage for the checkpoint system
var speed = 50; //typewriting effect speed
var typeindex = 0;//wich character is already typed out
var dlgPointer = parseInt(localStorage.getItem("dlgPointer")); //which line the user has loaded from the dialogue.json dictionary
var dlgFile; //the current loaded dictionary (Gets replaced after answer branches)
var dlgKeyMain = localStorage.getItem("dlgKeyMain");
let dlgLines; //string array with all current user readable dialogue lines
var skipDlg = false;
var answers;
var keys; //answer box answers
var allowNextDlg = true;
var voice; //sound that plays every few characters (feature not used in the current game)
var enemyHealth = 0, enemyDamage = 1, enemyStartsHit = false;
var health = 25;
var weaponName = localStorage.getItem("weaponName"), continueCount = true;
var weaponDamage = parseInt(localStorage.getItem("weaponDamage"));
var counttx = 0, countup = true; //counter values for counting weapon damage up and down in the fight screen

window.addEventListener('contextmenu', (event) => {
  event.preventDefault(); //prevents normal right click (shift rightclick works)
  speed = 0; //makes dialogue faster
})

function load(isJump = false) {
  if (!localStorage.getItem("dlgPointer"))
    dlgPointer = 0;
  if (!localStorage.getItem("dlgKeyMain") && !isJump)
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
function resetGame() {
  if (confirm("Willst du wirklich deinen gesamten Fortschritt im Spiel löschen?") == true) {
    localStorage.setItem("dlgPointer", "0");
    localStorage.setItem("dlgKeyMain", "main");
    localStorage.setItem("weaponDamage", "1");
    localStorage.setItem("weaponName", "Fäuste");
    location.reload();
  }
}
//change current dialogue lines with dictionary keys
function changeDlg(dlgKey) {
  if (typeof dlgFile[dlgKey] === "string") {
    var oneline = [dlgFile[dlgKey]];
    dlgLines = oneline;
  }
  else if (Array.isArray(dlgFile[dlgKey]))
    dlgLines = dlgFile[dlgKey];
}
//force typeout the dialogue
function updateDlg() {
  typeindex = 0;
  document.getElementById("dlg-text").innerHTML = "";
  document.getElementById("triangle").hidden = true;
  typeWriter();
}
//typewriter effect
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
//go to next dialogue line and interpretate it
function nextDlg(dlgPointerIncrease = true) {
  speed = 50;
  if (document.getElementById("dlg-text").innerHTML.length == dlgLines[dlgPointer].length && allowNextDlg || skipDlg) {
    skipDlg = false;
    if (dlgPointerIncrease)
      dlgPointer++; //actually go to the next line in the string array
    if (dlgPointer < dlgLines.length) {
      if (typeof dlgLines[dlgPointer] === 'number') {
        speed = 50 / dlgLines[dlgPointer];
        skipDlg = true;
        nextDlg();
      }
      else if (typeof dlgLines[dlgPointer] === 'string') {
        if (dlgLines[dlgPointer].startsWith("_")) { //checks if its a string command wich doesn't get typed out
          skipDlg = true;
          if (dlgLines[dlgPointer].split(":")[0] === "_title") { //topleft NPC name
            document.getElementById("title").innerHTML = dlgLines[dlgPointer].split(':')[1];
            nextDlg();
          }
          else if (dlgLines[dlgPointer].split(":")[0] === "_voice") { //voice wich is a sound wich plays every few text characters
            if (dlgLines[dlgPointer].split(':')[1].length != 0)
              voice = new Audio("text_horror/assets/voices/" + dlgLines[dlgPointer].split(':')[1] + ".wav");
            else
              voice = null;
            nextDlg();
          }
          else if (dlgLines[dlgPointer].split(":")[0] === "_playsound") { //play sounds
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
          else if (dlgLines[dlgPointer].split(":")[0] === "_jump") { // jump to keys wich are not in nested dictionaries (answer boxes)
            dlgKeyMain = dlgLines[dlgPointer].split(':')[1];
            load(true);
            dlgPointer = 0;
          }
          else if (dlgLines[dlgPointer].split(":")[0] === "_weapon") { //set the current player weapon
            weaponName = dlgLines[dlgPointer].split(':')[1];
            weaponDamage = parseInt(dlgLines[dlgPointer].split(':')[2]);
            console.log(weaponDamage);
            nextDlg();
          }
          else if (dlgLines[dlgPointer].split(":")[0] === "_enemy") { //begin a fight against an enemy
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
          else if (dlgLines[dlgPointer].split(":")[0] === "_checkpoint") {
            ß //set a checkpoint with local storage
            localStorage.setItem("dlgPointer", (dlgPointer + 1).toString());
            localStorage.setItem("dlgKeyMain", dlgKeyMain);
            localStorage.setItem("weaponDamage", weaponDamage.toString());
            localStorage.setItem("weaponName", weaponName);
          }
        } else
          updateDlg();
      }
      else if (typeof dlgLines[dlgPointer] === 'object') { //if inside a dictionary is a dictionary it gets built as answer box
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
    else { //if dlgLines array is at the end the game ends
      document.getElementById("bubble").hidden = true;
      document.getElementById("answer-box").hidden = true;
      document.getElementById("triangle").hidden = true;
    }
  }
}

function answered(answerId) { //handles answerbox answer clicks
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

function fight() { //handles the click on the fight button
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

function countWeaponDamage() { //counts up and down
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
