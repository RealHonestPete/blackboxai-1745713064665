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

    startCapture() {
        this.overlay.classList.add('active');
        this.isCapturing = false;
        this.captureBtn.disabled = true;

        // Add temporary event listeners for selection
        const mouseDownHandler = (e) => {
            this.isCapturing = true;
            const rect = this.overlay.getBoundingClientRect();
            this.startPos = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            this.selectionArea.style.left = `${this.startPos.x}px`;
            this.selectionArea.style.top = `${this.startPos.y}px`;
            this.selectionArea.style.width = '0';
            this.selectionArea.style.height = '0';
            this.selectionArea.classList.add('active');

            const mouseMoveHandler = (e) => {
                if (!this.isCapturing) return;
                this.updateSelection(e);
            };

            const mouseUpHandler = () => {
                if (!this.isCapturing) return;
                this.isCapturing = false;
                this.endSelection();
                
                // Remove temporary event listeners
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            };

            // Add temporary move and up handlers
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        };

        // Add mousedown handler
        this.overlay.addEventListener('mousedown', mouseDownHandler, { once: true });
    }

    updateSelection(e) {
        const rect = this.overlay.getBoundingClientRect();
        const currentPos = {
            x: Math.min(Math.max(e.clientX - rect.left, 0), rect.width),
            y: Math.min(Math.max(e.clientY - rect.top, 0), rect.height)
        };

        const width = currentPos.x - this.startPos.x;
        const height = currentPos.y - this.startPos.y;

        const left = width < 0 ? currentPos.x : this.startPos.x;
        const top = height < 0 ? currentPos.y : this.startPos.y;

        this.selectionArea.style.left = `${left}px`;
        this.selectionArea.style.top = `${top}px`;
        this.selectionArea.style.width = `${Math.abs(width)}px`;
        this.selectionArea.style.height = `${Math.abs(height)}px`;

        // Update coordinates display
        this.coordinates.textContent = `${Math.round(currentPos.x)}, ${Math.round(currentPos.y)}`;
    }

    endSelection() {
        if (!this.isCapturing) return;
        
        this.isCapturing = false;
        this.overlay.classList.remove('active');
        
        // Get the final selection dimensions
        const selection = this.selectionArea.getBoundingClientRect();
        const overlay = this.overlay.getBoundingClientRect();
        
        this.clientBounds = {
            x: selection.left - overlay.left,
            y: selection.top - overlay.top,
            width: selection.width,
            height: selection.height
        };

        // Update preview
        this.previewSelection.style.left = '10%';
        this.previewSelection.style.top = '10%';
        this.previewSelection.style.width = '80%';
        this.previewSelection.style.height = '80%';
        this.previewSelection.classList.add('active');

        // Update status and dimensions display
        this.captureStatus.textContent = 'Client captured successfully!';
        this.captureStatus.classList.remove('text-gray-400');
        this.captureStatus.classList.add('text-green-400');
        this.capturePosition.textContent = `${Math.round(this.clientBounds.x)}, ${Math.round(this.clientBounds.y)}`;
        this.captureSize.textContent = `${Math.round(this.clientBounds.width)} x ${Math.round(this.clientBounds.height)}`;

        // Reset selection area
        this.selectionArea.classList.remove('active');
        
        // Enable start button and update preview
        this.startStopBtn.disabled = false;
        this.startStopBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        this.clientPreview.classList.add('captured');
        this.captureBtn.disabled = false;
    }

    updateButtonStates() {
        this.startStopBtn.disabled = !this.clientBounds;
        if (!this.clientBounds) {
            this.startStopBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            this.startStopBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    async botLoop() {
        if (!this.isRunning) return;

        try {
            // Bot states
            const states = {
                TUTORIAL: 'tutorial',
                COMBAT: 'combat',
                LOOT: 'loot'
            };
            
            let currentState = states.TUTORIAL;
            
            // Bot logic simulation
            switch(currentState) {
                case states.TUTORIAL:
                    this.statusText.textContent = 'Completing Tutorial Island...';
                    // Tutorial island completion logic would go here
                    break;
                    
                case states.COMBAT:
                    this.statusText.textContent = 'Fighting chickens...';
                    // Combat logic would go here
                    break;
                    
                case states.LOOT:
                    this.statusText.textContent = 'Collecting feathers...';
                    // Looting logic would go here
                    break;
            }
            
            // Simulate bot actions (remove in actual implementation)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Continue the bot loop if still running
            if (this.isRunning) {
                requestAnimationFrame(() => this.botLoop());
            }
        } catch (error) {
            console.error('Bot error:', error);
            this.statusText.textContent = 'Error: ' + error.message;
            this.stopBot();
        }
    }
}

// Initialize the bot when the page loads
window.addEventListener('load', () => {
    window.bot = new RunescapeBot();
});
