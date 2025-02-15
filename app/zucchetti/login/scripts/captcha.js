/**
 ** Functionalities related to the CAPTCHA algorithm.
 */

/**
 ** BEHAVIORAL CAPTCHA SECTION
 */

// Whether to clear the console after each monitor analysis
let shouldClearConsole = true;

/**
 * ! TRACK MOUSE
 */
class MouseMonitor {
    // Overall score for mouse movement
    static SCORE = 0;

    constructor() {
        // Initialize starting coordinates for the mouse
        this.startX = 0;
        this.startY = 0;

        // Initialize last coordinates of the mouse
        this.lastX = 0;
        this.lastY = 0;

        // Initialize the total distance the mouse has moved
        this.totalDistance = 0;

        // Initialize the last time the mouse moved
        this.lastTime = Date.now();

        // Initialize speed to zero
        this.speed = 0;

        // Flag to check if the mouse is currently moving
        this.mouseMoving = false;

        // Timer to detect when the mouse stops moving
        this.stopTimer = null;

        // Sensibility factor to determine straight-line movement
        this.sensibility = 0.25;

        // Initialize the smoothness factor for smoothing the score
        this.smoothness = 0.1;

        // Smoothed score to prevent fluctuations
        this.smoothedScore = 0;
    }

    /**
     * This method allows to calculate the Euclidean distance between two points
     * @param {Number} x1 - x-coordinate of the first point.
     * @param {Number} y1 - y-coordinate of the first point.
     * @param {Number} x2 - x-coordinate of the second point.
     * @param {Number} y2 - y-coordinate of the second point.
     * @returns The distance between the two points in a straight line.
     */
    calculateDistance(x1, y1, x2, y2) {
        // Formula: sqrt((x2 - x1)^2 + (y2 - y1)^2)
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    /**
     * This method allows to smooth the score (moving average).
     * @param {Number} currentScore - The current score to smooth.
     * @returns The smoothed score based on the current score and the smoothness factor, together with the previously smoothed scores.
     */
    smoothenScore(currentScore) {
        // Smooth the score using a moving average
        this.smoothedScore = this.smoothedScore * (1 - this.smoothness) + currentScore * this.smoothness;

        // Return the smoothed score
        return this.smoothedScore;
    }

    /**
     * This method starts tracking the mouse movement by adding an event listener to the document.
     */
    startTracking() {
        // Add an event listener to track mouse movements
        document.addEventListener('mousemove', this.whileMouseIsMoving.bind(this));
    }

    /**
     * This method stops tracking the mouse movement by removing the event listener from the document.
     */
    stopTracking() {
        // Remove the event listener to stop tracking the mouse movements
        document.removeEventListener('mousemove', this.whileMouseIsMoving.bind(this));

        // If a timer is set (always should be), clear it
        if (this.stopTimer) {
            // Clear the timer to detect when the mouse stops moving
            clearTimeout(this.stopTimer);
        }
    }

    /**
     * This method tracks the mouse movement and calculates the speed, distance and straight-line movement of the mouse.
     * @param {Event} event - The event object that contains the mouse movement data.
     */
    whileMouseIsMoving(event) {
        // Get the current time
        const currentTime = Date.now();

        // If the mouse is not moving
        if (!this.mouseMoving) {
            // Capture the start position when the mouse starts to move
            this.startX = event.clientX;
            this.startY = event.clientY;

            // Set the mouseMoving flag to true
            this.mouseMoving = true;

            // Set the last position to the start position
            this.lastX = this.startX;
            this.lastY = this.startY;
        } else {    // If the mouse is moving
            // Calculate distance traveled in this movement
            const distance = this.calculateDistance(this.lastX, this.lastY, event.clientX, event.clientY);

            // Accumulate distance
            this.totalDistance += distance;

            // Update the last position
            this.lastX = event.clientX;
            this.lastY = event.clientY;

            // Calculate the time elapsed (in seconds)
            const timeElapsed = (currentTime - this.lastTime) / 1000;
            
            // Calculate speed (distance / time)
            this.speed = timeElapsed > 0 ? distance / timeElapsed : 0;

            // Update the last time
            this.lastTime = currentTime;
        }

        // Clear the timer to detect when the mouse stops moving
        clearTimeout(this.stopTimer);

        // Set a new timer to detect when the mouse stops moving
        this.stopTimer = setTimeout(() => this.onMouseStop(), 100);
    }

    /**
     * This method calculates the score based on the mouse movement and speed, and updates the MouseMonitor's score.
     * @returns Early exit if the movement is too small (below a threshold).
     */
    onMouseStop() {
        // Calculate the straight-line distance from the starting point to the stopping point
        const straightLineDistance = this.calculateDistance(this.startX, this.startY, this.lastX, this.lastY);

        // Calculate the difference between the total distance and the straight-line distance
        const difference = Math.abs(this.totalDistance - straightLineDistance);

        // Determine if the movement is a straight line based on the difference and the sensibility
        let isStraightLine = difference < this.sensibility ? "Yes" : "No";

        // Check whether the console should be cleared
        if (shouldClearConsole) {
            // Clear the console to show the monitor more easily
            console.clear();
        }

        // Create a formatted output for the mouse movement analysis
        let output = 
        `==================================================\n` +
        `              Mouse Movement Monitor\n` +
        `==================================================\n`;

        // Define a minimum movement threshold (below which the movement is ignored)
        const MIN_MOVEMENT_THRESHOLD = 50; // px

        // Check whether the movement is too small to be considered
        if (this.totalDistance < MIN_MOVEMENT_THRESHOLD) {
            // Add a message to the output to show the traveled distance and the threshold
            output +=
            'Movement too small (< ' + MIN_MOVEMENT_THRESHOLD + 'px), ignored.\n' +
            'Total Distance Traveled: ' + this.totalDistance.toFixed(2) + '\n' +
            '==================================================\n'

            // Log the formatted output as no further analysis is needed
            console.log(output);

            // Exit early
            return;
        }

        // Add the rest of the analysis to the formatted output
        output +=
        `Start Coordinates: (${this.startX}, ${this.startY})\n` +
        `End Coordinates: (${this.lastX}, ${this.lastY})\n` +
        `--------------------------------------------------\n` +
        `Total Distance Traveled: ${this.totalDistance.toFixed(2)}px\n` +
        `Straight-Line Distance: ${straightLineDistance.toFixed(2)}px\n` +
        `--------------------------------------------------\n` +
        `Sensibility: ${this.sensibility}\n` +
        `Difference: ${difference.toFixed(2)}\n` +
        `--------------------------------------------------\n` +
        `Speed: ${this.speed.toFixed(2)} px/s\n` +
        `==================================================\n` +
        `             Is a straight line: ${isStraightLine}\n` +
        `==================================================\n`;

        /**
         ** Scoring System
         */
        // Contains the score that will be added to the MouseMonitor's score this time
        let currentMotionScore = 0;

        /* High speeds add more to the score */
        // Max speed before the movement is considered suspicious
        const MAX_SPEED_THRESHOLD = 2000; // px/s

        // Check if the speed is too high
        if (this.speed > MAX_SPEED_THRESHOLD) {
            // Increase the score by a fixed amount plus a small contribution based on the speed
            currentMotionScore += 20 + (this.speed / 5000);
        }

        /* Straight-line movements add more to the score */
        // Check if the movement is a straight-line
        if (isStraightLine === "Yes") {
            // Increase the score by a fixed amount plus the difference
            currentMotionScore += 40 + difference;
        }

        /* Human-like movements reduce the score */
        // If the difference is greater than the sensibility, we can deduct some of the score
        if (difference > this.sensibility) {
            // Decrease the score by a fixed amount plus a small contribution based on the difference (which is capped at 5)
            currentMotionScore -= 10 + Math.min(difference, 5);
        }

        // The new score will be the sum of the current MouseMonitor's score and the current motion score
        let newScore = MouseMonitor.SCORE + currentMotionScore;

        // The new score will be smoothened to prevent fluctuations
        newScore = this.smoothenScore(newScore);

        // Cap the smoothed score between 0 and 100
        newScore = keepBetween(0, 100, newScore);

        // Fix the number to two decimal digits
        newScore = toFixedNumber(newScore, 2);

        // Set the MouseMonitor's score to the new calculated score
        MouseMonitor.SCORE = newScore;

        // Add the score to the formatted output
        output += `                  Score: ${MouseMonitor.SCORE}%\n`;
        output += `==================================================`;

        // Output the results
        console.log(output);

        // Calculate the overall score
        RISK_MONITOR.calculateRiskLevel(MouseMonitor.SCORE, TypingMonitor.SCORE);

        // Reset the total distance for the next movement
        this.totalDistance = 0;

        // Reset the mouse moving flag to false
        this.mouseMoving = false;
    }
}

// Initialize the MouseMonitor
const MOUSE_TRACKER = new MouseMonitor();

// Start tracking the mouse movement
MOUSE_TRACKER.startTracking();


/**
 * ! TRACK TYPING
 */
class TypingMonitor {
    // Overall score for typing
    static SCORE = 0;

    // Speed below this might be considered too fast
    SPEED_THRESHOLD = 50; // ms

    // Speed below this might be considered too consistent
    CONSISTENCY_THRESHOLD = 20; // ms

    // If a character is repeated more than this, it is ignored
    REPEATING_THRESHOLD = 3;

    // Number of entries to track for speeds
    SPEED_HISTORY_LENGTH = 16;

    // Contains the last time at which a key was pressed
    lastKeyTime = null;

    // The last length of the text
    lastLength = 0;

    // The list of the last couple of speeds
    typingSpeeds = [];

    /**
     * This method checks the typing behavior of the user in a specific input element passed as parameter.
     * @param {Element} inputElement - The input text element to check the typing behavior for.
     * @returns Early return for either no characters typed, or if the user is inputting repeated characters.
     */
    checkTypingBehavior(inputElement) {
        // Contains the current time at which a key is pressed
        const currentTime = Date.now();

        // Calculate the time elapsed since the last key press (if it is defined, aka: not the first input)
        const timeBetweenKeys = currentTime - (this.lastKeyTime ?? currentTime);

        // Update the current length
        const currentLength = inputElement.value.length;
        
        // Contains the number of characters typed (usually 1, but if something is pasted in, then it will be more)
        const charactersTyped = currentLength - this.lastLength;

        // The current text content typed in
        const currentText = inputElement.value;

        // Update last keystroke details
        this.lastKeyTime = currentTime;
        this.lastLength = currentLength;

        // Start an output
        let output = '';

        // Return early if the input is empty
        if (charactersTyped < 0) { return; }

        // Check whether the console should be cleared
        if (shouldClearConsole) {
            // Clear the console to show the monitor more easily
            console.clear();
        }

        // Check whether the last REPEATING_THRESHOLD characters are the same. If they are, we consider this a repetition
        const hasRepeatingCharacters = currentText.slice(-this.REPEATING_THRESHOLD).split('').every(char => char === currentText.slice(-1))

        // If the text is long enough to allow for repetition and it has repeating characters
        if (currentText.length > this.REPEATING_THRESHOLD && hasRepeatingCharacters) {
            // Attach a warning to the output
            output += `==================================================\n`;
            output += '! Repeating Characters !\n';
            output += `==================================================\n`;

            // Output immediately
            console.log(output);

            // Return early
            return; 
        }

        // Push the current time difference between keystrokes into typingSpeeds
        if (timeBetweenKeys > 0) {
            this.typingSpeeds.push(timeBetweenKeys);
        }

        // Keep only the latest SPEED_HISTORY_LENGTH typing speeds
        if (this.typingSpeeds.length > this.SPEED_HISTORY_LENGTH) {
            // Delete the oldest one
            this.typingSpeeds.shift();
        }

        // Calculate average speed (average = (sum of all speeds) / (number of speeds))
        const averageSpeed = this.typingSpeeds.reduce((sum, speed) => sum + speed, 0) / this.typingSpeeds.length;

        // Build a single output message for all information
        output += `==================================================\n`;
        output += `             Typing behavior Monitor\n`;
        output += `==================================================\n`;
        output += `                    ${inputElement.getAttribute('placeholder')}                    \n`;
        output += `==================================================\n`;
        output += `Time Between Keys: ${timeBetweenKeys}ms\n`;
        output += `Average Speed [${this.typingSpeeds.length}/${this.SPEED_HISTORY_LENGTH}]: ${averageSpeed.toFixed(2)}ms\n`;
        output += `==================================================\n`;

        // The "tune" factor of the speed check. The lesser the tune, the more impact the speed will have on the score
        const speedTuner = 5;

        // If the average speed is too low (fast typing)
        if (averageSpeed < this.SPEED_THRESHOLD) {
            // Prepare the additional score that will be added
            let additionalScore = 0;
            
            // If the time between the last two keys is too fast
            if (timeBetweenKeys < this.SPEED_THRESHOLD) {
                // Calculate the additional score as the difference between the speed threshold and the time between the keys.
                // The lower the time between keys (higher speed), the more will be added.
                // All is tuned by a set quotient.
                additionalScore = (this.SPEED_THRESHOLD - timeBetweenKeys) / speedTuner;

                // Add the additional score to the final score
                TypingMonitor.SCORE += additionalScore;
            }
            
            // Keep the score inside bounds
            TypingMonitor.SCORE = keepBetween(0, 100, TypingMonitor.SCORE);

            // Fix the number to two decimal digits
            TypingMonitor.SCORE = toFixedNumber(TypingMonitor.SCORE, 2);
            
            // Add warning and added score to the output
            output += `! Fast Typing ! Added Score: ${additionalScore.toFixed(2)}\n`;
            output += `==================================================\n`;
        } else {
            // Prepare the score that will be subtracted
            let subtractedScore = 0;

            // If instead the time between this and the last key is more than average and the difference is less than the threshold
            if (timeBetweenKeys > averageSpeed && (timeBetweenKeys - averageSpeed) < this.SPEED_THRESHOLD) {
                // Subtract the difference and apply a stronger tune (on average, we deduct less points than we add)
                subtractedScore = (timeBetweenKeys - averageSpeed) / (speedTuner * 2);

                // Subtract the score from the final score
                TypingMonitor.SCORE -= subtractedScore;
            }

            // Keep the score inside bounds
            TypingMonitor.SCORE = keepBetween(0, 100, TypingMonitor.SCORE);
 
            // Fix the number to two decimal digits
            TypingMonitor.SCORE = toFixedNumber(TypingMonitor.SCORE, 2);

            // Add warning and subtracted score to the output
            output += `! Slower Typing ! Subtracted Score: ${subtractedScore.toFixed(2)}\n`;
            output += `==================================================\n`;
        }

        // The "tune" factor of the consistency check. The lesser the tune, the more impact the consistency will have on the score
        const consistencyTuner = 8;

        // Detect if the time between each keystroke is suspiciously constant
        const constantTyping = this.typingSpeeds.every((speed) => Math.abs(speed - averageSpeed) < this.CONSISTENCY_THRESHOLD);

        // If the typing is constant and the recorded speeds are more than 1 (no consistency otherwise)
        if (constantTyping && this.typingSpeeds.length > 1) {
            // Prepare the additional score that will be added.
            // AS = (Ct - |last_speed - average|) / c_tuner
            let additionalScore = (this.CONSISTENCY_THRESHOLD - Math.abs(this.typingSpeeds.slice(-1) - averageSpeed)) / consistencyTuner;
            
            // Add the additional score to the final score
            TypingMonitor.SCORE += additionalScore;
            
            // Keep the score inside bounds
            TypingMonitor.SCORE = keepBetween(0, 100, TypingMonitor.SCORE);
 
            // Fix the number to two decimal digits
            TypingMonitor.SCORE = toFixedNumber(TypingMonitor.SCORE, 2);
            
            // Add warning and added score to the output
            output += `! Consistent Typing ! Additional Score: ${additionalScore.toFixed(2)}\n`;
            output += `==================================================\n`;
        }

        // Add overall score to the output
        output += `                  Score: ${TypingMonitor.SCORE}%\n`;
        output += `==================================================\n`;

        // Print the full output all at once
        console.log(output);

        // Calculate the overall score
        RISK_MONITOR.calculateRiskLevel(MouseMonitor.SCORE, TypingMonitor.SCORE);
    }

    /**
     * This method adds the event listener for any new input to run a check on the behavior.
     * @param {Element} inputElement - The input text element.
     */
    addInputListeners(inputElement) {
        // Add the event listener
        inputElement.addEventListener('input', () => this.checkTypingBehavior(inputElement));
    }
}

// Initialize TypingMonitor for each input
const typingMonitors = {
    'first-name': new TypingMonitor(),
    'last-name': new TypingMonitor(),
    'password': new TypingMonitor()
};

// Loop through typingMonitors and add event listeners to the corresponding input fields
Object.keys(typingMonitors).forEach(key => {
    // Get the input element by its ID
    const inputElement = document.getElementById(key);

    // If the element doesn't exist, skip it
    if (!inputElement) { return; }

    // Add the event listener based 
    inputElement.addEventListener('input', () => {
        // Call the method of the respective TypingMonitor
        typingMonitors[key].checkTypingBehavior(inputElement);
    });
});


/**
 * ! RISK LEVEL
 */
/**
 ** RISK LEVEL MONITOR
 */
class RiskLevelMonitor {
    // Overall score for risk level
    static SCORE = 0;

    /* The weights must add up to 100%!!! */
    // The weight of the mouse score in the final calculation
    mouseScoreWeight = 25; // %

    // The weight of the typing score in the final calculation
    typingScoreWeight = 75; // %

    /**
     * This method combines the scores from both the MouseMonitor and TypingMonitor.
     * @param {Number} mouseScore - The score from the MouseMonitor.
     * @param {Number} typingScore - The score from the TypingMonitor.
     */
    calculateRiskLevel(mouseScore, typingScore) {
        // Combine the scores using an average (or weighted average if needed)
        this.SCORE = mouseScore * (this.mouseScoreWeight / 100) + typingScore * (this.typingScoreWeight / 100);

        // Cap the combined score between 0 and 100
        this.SCORE = keepBetween(0, 100, this.SCORE);

        // Fix the number to two decimal digits
        this.SCORE = toFixedNumber(this.SCORE, 2);

        // Classify the risk level based on the combined score
        let riskLevel = this.SCORE > 25 ? "Bot-like" : "Human-like";

        // Output the final risk level
        console.log(`Risk Level: ${riskLevel} (Score: ${this.SCORE}%)`);
    }
}

// Calculate unified risk level
const RISK_MONITOR = new RiskLevelMonitor();