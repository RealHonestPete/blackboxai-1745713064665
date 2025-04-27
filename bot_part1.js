class RunescapeBot {
    constructor() {
        this.isRunning = false;
        this.startTime = null;
        this.clientBounds = null;
        this.timerInterval = null;
        this.isCapturing = false;
        this.startPos = { x: 0, y: 0 };

        // UI Elements
        this.timerDisplay = document.getElementById('timer');
        this.startStopBtn = document.getElementById('startStopBtn');
        this.captureBtn = document.getElementById('captureBtn');
        this.captureStatus = document.getElementById('captureStatus');
        this.statusText = document.getElementById('statusText');
        this.clientPreview = document.getElementById('clientPreview');
        this.statusDot = document.querySelector('.status-dot');
        this.overlay = document.getElementById('captureOverlay');
        this.selectionArea = document.getElementById('selectionArea');
        this.previewSelection = document.getElementById('previewSelection');
        this.coordinates = document.getElementById('coordinates');
        this.capturePosition = document.getElementById('capturePosition');
        this.captureSize = document.getElementById('captureSize');

        // Bind event listeners
        this.startStopBtn.addEventListener('click', () => this.toggleBot());
        this.captureBtn.addEventListener('click', () => this.startCapture());

        // Initialize
        this.updateButtonStates();
    }

    toggleBot() {
        this.isRunning = !this.isRunning;
        
        if (this.isRunning) {
            this.startBot();
        } else {
            this.stopBot();
        }
        
        this.updateButtonStates();
    }

    startBot() {
        if (!this.clientBounds) {
            alert('Please capture the game client first!');
            this.isRunning = false;
            this.updateButtonStates();
            return;
        }

        this.startTime = Date.now();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
        
        this.startStopBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Bot';
        this.startStopBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
        this.startStopBtn.classList.add('bg-red-600', 'hover:bg-red-700');
        
        this.statusText.textContent = 'Bot is running...';
        this.statusDot.classList.remove('stopped');
        this.statusDot.classList.add('running');
        
        // Start the bot loop
        this.botLoop();
    }

    stopBot() {
        clearInterval(this.timerInterval);
        this.startTime = null;
        
        this.startStopBtn.innerHTML = '<i class="fas fa-play"></i> Start Bot';
        this.startStopBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
        this.startStopBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        
        this.statusText.textContent = 'Bot stopped';
        this.statusDot.classList.remove('running');
        this.statusDot.classList.add('stopped');
    }

    updateTimer() {
        if (!this.startTime) return;
        
        const elapsed = Date.now() - this.startTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        this.timerDisplay.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
