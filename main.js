// youtube API functions

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var focusPlayer;
var breakPlayer;

function onYouTubeIframeAPIReady() {
    focusPlayer = new YT.Player('focus-player', {
        height: '390',
        width: '640',
        videoId: '',
        playerVars: {
            'playsinline': 1
        },
        events: { }
    });
    breakPlayer = new YT.Player('break-player', {
        height: '390',
        width: '640',
        videoId: '',
        playerVars: {
            'playsinline': 1
        },
        events: { }
    });
  }

// play/pause functions

function playFocusVideo(){
    focusPlayer.playVideo();
}
function pauseFocusVideo(){
    focusPlayer.pauseVideo();
}
function playBreakVideo(){
    breakPlayer.playVideo();
}
function pauseBreakVideo(){
    breakPlayer.pauseVideo();
}

// mask functions

function showFocusMask() {
    document.getElementById("focus-mask").style = "visibility: visible"
}
function hideFocusMask() {
    document.getElementById("focus-mask").style = "visibility: hidden"
}
function showBreakMask() {
    document.getElementById("break-mask").style = "visibility: visible"
}
function hideBreakMask() {
    document.getElementById("break-mask").style = "visibility: hidden"
}

// timer functions

var pomodoro = 1500000; // default is 25 minutes
var shortbreak = 300000; // default is 5 minutes
var longbreak = 900000; // default is 15 minutes
var time = pomodoro; // default is pomodoro
var interval = 3; // default long break interval is after 3 pomodoros
var working = 2; // pomodoro =- 2, short break > 0, long break == -1
var paused = true;
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

function milli2percent(milli) {
    var percent = "";
    if (working === -1) { 
        percent = (longbreak-milli)/longbreak;
    } else if (working < 0) {
        percent = (shortbreak-milli)/shortbreak;
    } else {
        percent = (pomodoro-milli)/pomodoro;
    }
    return (percent*100).toString() + "%";
}

function startTimer() {
    if (working < 0) {
      playBreakVideo();
      hideBreakMask();
    } else {
      playFocusVideo();
      hideFocusMask();
    }
    document.getElementById("start").innerHTML = "PAUSE"
    document.getElementById("start").classList.remove('start');
    document.getElementById("start").classList.add('pause');
    document.getElementById("start").onclick = stopTimer;
    document.getElementById("start").id = "pause";
    myTimer = setInterval(updateTimer, 1000);
    paused = false;
}

function stopTimer() {
    if (working < 0) {
      pauseBreakVideo();
    } else {
      pauseFocusVideo();
    }
    document.getElementById("pause").innerHTML = "START"
    document.getElementById("pause").classList.remove('pause');
    document.getElementById("pause").classList.add('start');
    document.getElementById("pause").onclick = startTimer;
    document.getElementById("pause").id = "start";
    clearInterval(myTimer);
    paused = true;
}

function updateTimer() {
    if (time > 0){
        time -= 1000;
        displayTimer(time);
    } else {
        switchTimer();
    }
    updateProgress();
}

// reduce duplicate code later

function switchTimer() {
    working *= -2; 
    var power = interval * 2
    if (working === -Math.pow(2,power)) { 
      pauseFocusVideo();
      showFocusMask();
      hideBreakMask();
        if (paused == false) {
            playBreakVideo();
        }
        time = longbreak;
        document.getElementById("pomodoro-button").style.backgroundColor="#FFFFFF";
        document.getElementById("shortbreak-button").style.backgroundColor="#FFFFFF";
        document.getElementById("longbreak-button").style.backgroundColor="#E8E8E8";
        working = -1
    } else if (working < 0) {
      pauseFocusVideo();
      showFocusMask();
      hideBreakMask();
        if (paused == false) {
            playBreakVideo();
        }
        time = shortbreak;
        document.getElementById("pomodoro-button").style.backgroundColor="#FFFFFF";
        document.getElementById("shortbreak-button").style.backgroundColor="#E8E8E8";
        document.getElementById("longbreak-button").style.backgroundColor="#FFFFFF";
    } else {
      pauseBreakVideo();
      showBreakMask();
      hideFocusMask();
        if (paused == false) {
            playFocusVideo();
        }
        time = pomodoro;
        document.getElementById("shortbreak-button").style.backgroundColor="#FFFFFF";
        document.getElementById("longbreak-button").style.backgroundColor="#FFFFFF";
        document.getElementById("pomodoro-button").style.backgroundColor="#E8E8E8";
    }
    displayTimer()
}

// merge the following 3 functions later

function choosePomodoro() {
    working = 2; 
    document.getElementById("pomodoro-button").style.backgroundColor="#E8E8E8";
    document.getElementById("shortbreak-button").style.backgroundColor="#FFFFFF";
    document.getElementById("longbreak-button").style.backgroundColor="#FFFFFF";
    time = pomodoro;
    pauseBreakVideo();
    showBreakMask();
    hideFocusMask();
    if (paused == false) {
        playFocusVideo();
    }
    displayTimer();
}

function chooseShortBreak() {
    working *= -2; 
    document.getElementById("pomodoro-button").style.backgroundColor="#FFFFFF";
    document.getElementById("shortbreak-button").style.backgroundColor="#E8E8E8";
    document.getElementById("longbreak-button").style.backgroundColor="#FFFFFF";
    time = shortbreak;
    pauseFocusVideo();
    showFocusMask();
    hideBreakMask();
    if (paused == false) {
        playBreakVideo();
    }
    displayTimer();
}

function chooseLongBreak() {
    working *= -2; 
    document.getElementById("pomodoro-button").style.backgroundColor="#FFFFFF";
    document.getElementById("shortbreak-button").style.backgroundColor="#FFFFFF";
    document.getElementById("longbreak-button").style.backgroundColor="#E8E8E8";
    time = longbreak;
    pauseFocusVideo();
    showFocusMask();
    hideBreakMask();
    if (paused == false) {
        playBreakVideo();
    }
    displayTimer();
}

// for testing purposes
function skipForward() {
    switchTimer();
}
  
function displayTimer() {
    t = milli2minsec(time);
    document.getElementById("timer").innerHTML = t;
    document.title = t + " - TomatoTube";
}

// URL handling

function submitFocusURL() {
    document.getElementById("focus-player").style = "visibility: visible";
    showFocusMask();
    if (document.getElementById('focus-URL').value !== '') {
        focusPlayer.cueVideoById(document.getElementById('focus-URL').value.slice(-11));
      }
}

function submitBreakURL() {
    document.getElementById("break-player").style = "visibility: visible";
    showBreakMask();
    if (document.getElementById('break-URL').value !== '') {
        breakPlayer.cueVideoById(document.getElementById('break-URL').value.slice(-11));
      }
}