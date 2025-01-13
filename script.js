let timeLeft = 25 * 60; // 25 minutes in seconds for work mode
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const modeToggle = document.getElementById('mode-toggle');
const bell = document.getElementById('bell');
const originalTitle = document.title;
const timerProgress = document.querySelector('.timer-progress');
const CIRCUMFERENCE = 2 * Math.PI * 45; // 45 is the radius of our circle

function updateProgress(timeLeft, totalTime) {
    const progress = timeLeft / totalTime;
    const dashoffset = CIRCUMFERENCE * (1 - progress);
    timerProgress.style.strokeDasharray = CIRCUMFERENCE;
    timerProgress.style.strokeDashoffset = dashoffset;
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    document.title = `(${timeString}) ${originalTitle}`;
    
    const totalTime = isWorkTime ? 25 * 60 : 5 * 60;
    updateProgress(timeLeft, totalTime);
}

function startTimer() {
    if (timerId === null) {
        startButton.textContent = 'Pause';
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                startButton.textContent = 'Start';
                bell.play();
                setTimeout(() => {
                    bell.pause();
                    bell.currentTime = 0;
                    switchMode();
                }, 3000);
            }
        }, 1000);
    } else {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
    startButton.textContent = 'Start';
    updateDisplay();
    document.title = originalTitle;
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
    modeText.textContent = isWorkTime ? 'Rest' : 'Work';
    document.querySelector('.timer-container').classList.toggle('rest-mode');
    updateDisplay();
}

modeToggle.addEventListener('change', function() {
    if (this.checked) {
        modeText.textContent = 'Rest';
        timeLeft = 5 * 60; // Rest mode - 5 minutes
        isWorkTime = false;
        document.querySelector('.timer-container').classList.add('rest-mode');
    } else {
        modeText.textContent = 'Work';
        timeLeft = 25 * 60; // Work mode - 25 minutes
        isWorkTime = true;
        document.querySelector('.timer-container').classList.remove('rest-mode');
    }
    
    // Reset timer state
    clearInterval(timerId);
    timerId = null;
    startButton.textContent = 'Start';
    
    // Update display immediately
    updateDisplay();
});

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

// Initialize with work mode (25 minutes)
timeLeft = 25 * 60;
isWorkTime = true;
modeText.textContent = 'Work';
updateDisplay();

// Add event listeners
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer); 