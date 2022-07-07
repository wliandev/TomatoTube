var pomodoro = 1500000; // default is 25 minutes
var shortbreak = 300000; // default is 5 minutes
var longbreak = 900000; // default is 15 minutes
var time = pomodoro; // default is pomodoro
var working = 1;
var myTimer;

function milli2minsec(milli) {
  const d = new Date(Date.UTC(0,0,0,0,0,0,milli)),
  parts = [
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds()
  ],
  formatted = parts.map(s => String(s).padStart(2,'0')).join(':');
  return formatted;
}

function setTimer() {
  pomodoro = document.getElementById('pomodoro').value * 60000;
  shortbreak = document.getElementById('short break').value * 60000;
  longbreak = document.getElementById('long break').value * 60000;
  time = pomodoro;
  displayTimer(time);
  document.getElementById("mySettings").style.display = "none";
  document.getElementById("cover").style.display = "none";
}

function startTimer() {
  document.getElementById("start").innerHTML = "Pause"
  document.getElementById("start").classList.remove('start-button');
  document.getElementById("start").classList.add('pause-button');
  document.getElementById("start").onclick = stopTimer;
  document.getElementById("start").id = "pause";
  myTimer = setInterval(updateTimer, 1000);
}

function stopTimer() {
  document.getElementById("pause").innerHTML = "Start"
  document.getElementById("pause").classList.remove('pause-button');
  document.getElementById("pause").classList.add('start-button');
  document.getElementById("pause").onclick = startTimer;
  document.getElementById("pause").id = "start";
  clearInterval(myTimer);
}

function goBack() {
  if (working === -.5) { 
    time = longbreak;
  } else if (working < 0) {
    time = shortbreak;
  } else {
    time = pomodoro;
  }
  displayTimer(time)
}

function skipForward() {
  switchTimer();
}

function updateTimer() {
  if (time > 0){
    time -= 1000;
    displayTimer(time);
  } else {
    switchTimer();
  }
}

function switchTimer() {
  working *= -2; 
  playSound();
  if (working === -32) { 
    time = longbreak;
    document.getElementById("status").innerHTML = "Long Break"
    working = -.5
  } else if (working < 0) {
    time = shortbreak;
    document.getElementById("status").innerHTML = "Short Break"
  } else {
    time = pomodoro;
    document.getElementById("status").innerHTML = "Pomodoro"
  }
  displayTimer(time)
}

function displayTimer(time) {
  document.getElementById("timer").innerHTML = milli2minsec(time)
}

function playSound() {
  var beep = new Audio('beep.mp3');
  var count = 1;
  beep.loop = false;
  beep.play()
  beep.addEventListener('ended', function() {
    this.currentTime = 0;
    if (count <= 2) {
      this.play();
    } else {
      this.pause();
    }
    count++;
  }, false);
}

function openSettings() {
  document.getElementById("mySettings").style.display = "block";
  document.getElementById("cover").style.display = "block";
}

function closeSettings() {
  document.getElementById("mySettings").style.display = "none";
  document.getElementById("cover").style.display = "none";
}