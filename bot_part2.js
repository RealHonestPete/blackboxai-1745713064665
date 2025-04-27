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
</create_file>
