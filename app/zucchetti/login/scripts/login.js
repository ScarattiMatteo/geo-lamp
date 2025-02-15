/**
 ** Functionalities related to the login.
 */

'use strict';

// Contains the current shown login step
let currentStep = 'role';

// Contains the currently selected "role" of the role step
let selectedRole = null;

/**
 *! Step selection
 */
/**
 * This function changes the currently shown login step based on the input.
 * @param {String} step - The name of the step to go to ('role', 'credentials' or 'captcha').
 */
function goToStep(step) {
    // Remove the .active class from all steps
    deactivateAllSteps();

    // Add the .active class to the input step
    activateStep(step);

    // Update the current step to match the one in input
    currentStep = step;
}

/**
 * This function removes the .active class from all steps.
 */
function deactivateAllSteps() {
    // Get all of the login steps
    const loginSteps = document.querySelectorAll('#login-form > div');

    // For each step, remove the .active class
    loginSteps.forEach(loginStep => loginStep.classList.remove('active'));
}

/**
 * This function adds the .activate class to the current step based on the input.
 * @param {String} step - The name of the step to activate ('role', 'credentials' or 'captcha').
 */
function activateStep(step) {
    // Add the .active class to the current step
    document.getElementById(`${step}-step`).classList.add('active');
}

/**
 *! Role selection
 */
/**
 * This function selects a role based on the input role.
 * @param {String} role - The name of the role to select (//TODO: add list of available role names).
 */
function selectRole(role) {
    // Remove the .selected class from all roles
    deselectAllRoles();

    // Add the .selected class to the role in input
    selectRoleTab(role);

    // Update the current role to match the one in input
    selectedRole = role;

    // Check if the "Next" button should be enabled (a role has been selected)
    validateStep(currentStep);
}

/**
 * This function removes the .selected class from all roles
 */
function deselectAllRoles() {
    // Get all of the role tabs
    const roleTabs = document.querySelectorAll('.role-tab');

    // Get all the role tabs' inputs
    const radioInputs = document.querySelectorAll('.role-tab input');

    // For each tab, remove the .selected class
    roleTabs.forEach(tab => tab.classList.remove('selected'));

    // Deselect each input
    radioInputs.forEach(input => input.checked = false);
}

/**
 * This function adds the .selected class to the role based on the input.
 * @param {String} role - The name of the role to select (//TODO: add list of available role names).
 */
function selectRoleTab(role) {
    // Check the radio input of the role
    document.querySelector(`#${role} input`).checked = true;

    // Give the .selected class to the role in input
    document.getElementById(role).classList.add('selected');
}

/**
 *! Steps validation
 */
/**
 * This function checks whether the current step has been successfully validated.
 * @param {String} step - The name of the step to activate ('role', 'credentials' or 'captcha').
 */
function validateStep(step) {
    // Contains the "Next" button of the current step
    const nextButton = document.querySelector(`#${step}-step .next-button`);

    // Based on the step, we need to check the individual fields
    switch (step) {
        case 'role':
            // The "Next" button will be enabled when the user has selected a role
            nextButton.disabled = !selectedRole;

            break;


        case 'credentials':
            // Contains the password field
            const passwordField = document.getElementById('password');

            // Contains the password requirements container
            const passwordRequirements = document.getElementById('password-requirements');

            // Contains the "First Name" field's value
            const firstName = document.getElementById('first-name').value;

            // Contains the "Last Name" field's value
            const lastName = document.getElementById('last-name').value;

            // Contains the "Password" field's value
            const password = passwordField.value;

            // Boolean for whether the password is valid or not
            const passwordValid = validatePassword(password);

            // If the user has started typing something in the password field (the length of the password value is greater than "0")
            if (password.length > 0) {
                // Toggle the .valid-password class if the password is valid
                passwordField.classList.toggle('valid-password', passwordValid);

                // Toggle the .invalid-password class if the password is invalid
                passwordField.classList.toggle('invalid-password', !passwordValid);

                // Activate the password requirements list when the user starts typing
                passwordRequirements.classList.toggle('active', !passwordValid);
            } else {    // Otherwise (if the password field is empty)
                // Remove both the .valid-password and .invalid-password classes
                passwordField.classList.remove('valid-password', 'invalid-password');

                // Deactivate the password requirements list when password field is empty typing
                passwordRequirements.classList.remove('active');
            }

            const verifyButton = document.querySelector("#credentials-step div.navigation-buttons button:nth-of-type(2)");

            verifyButton.disabled= !(firstName && lastName && password && passwordValid);

            break;


        case 'captcha':
            // Contains the "CAPTCHA" field's value
            const captcha = document.getElementById('captcha').value;

            // Contains the button
            const submitButton = document.querySelector('.submit-button');

            // The button will be enabled when the CAPTCHA has exactly 5 characters
            submitButton.disabled = captcha.length !== 5;

            break;


        default:
            // If the step is not recognized, warn
            console.warn(`Couldn't validate step "${step}"!`)

            break;
    }
}

// Validate each input whenever it changes
document.getElementById('first-name')?.addEventListener('input', () => validateStep('credentials'));    // The "First Name" field in the "Credentials" step
document.getElementById('last-name')?.addEventListener('input', () => validateStep('credentials'));     // The "Last Name" field in the "Credentials" step
document.getElementById('password')?.addEventListener('input', () => validateStep('credentials'));      // The "Password" field in the "Credentials" step
document.getElementById('captcha')?.addEventListener('input', () => validateStep('captcha'));           // The "CAPTCHA" field in the "CAPTCHA" step

// Add event listener to the body to deselect any role when clicking outside of the login box
document.addEventListener('click', (event) => {
    // If the event hasn't been triggered by an element inside of the login box and we are in the "role" step
    if (!document.getElementById('login-steps-container').contains(event.target) && currentStep === 'role') {
        // Remove the .selected class from all roles
        deselectAllRoles();

        // Set the current role to NULL
        selectedRole = null;

        // Check the steps for the current step (to update the "Next" button of the "role" step)
        validateStep(currentStep);
    }
});

// On load, make the first step (the "role" step) visible by adding the .active class to it
document.getElementById('role-step').classList.add('active');


/**
 *! Chips functions
 *  This part of the code is dedicated to the handling of the notification chips.
 */

/**
 * This class let's you create chips that can be shown as notifications.
 * Methods:
 * - add
 * - remove
 */
class Chip {
    constructor() {
        // Find the chips container
        this.container = document.querySelector('#chips-container');

        // Throw an error if we can't find the container
        if (!this.container) {
            // Throw the error
            throw new Error('#chips-container not found in the document.');
        }

        // Store the reference to the created chip (will be null initially)
        this.chip = null;

        // Flag to indicate if the chip is being added or removed
        this.isAnimating = false;
    }

    /**
     * This method creates the HTML Elements structure of the notification chip and adds it to the #chips-container.
     * @param {String} iconName - The Google Icon's name of the icon we want to use.
     * @param {String} message - The message of the notification.
     * @param {String} backgroundColor - The color of the background of the notification.
     * @param {String} textColor - The color of the text of the notification.
     * @param {String} iconColor - The color of the icon of the notification.
     * @returns Undefined if the Chip instance has already created the chip.
     */
    add(iconName, message, backgroundColor, textColor, iconColor) {
        // If this chip has already been created or is animating, return as we don't want to create another
        if (this.chip || this.isAnimating) { return; }

        // Set the flag to indicate animation is in progress
        this.isAnimating = true;

        // Create the div wrapper for the chip
        const divWrapper = document.createElement('div');

        // Add the classes to the div wrapper
        divWrapper.classList.add('chip', 'default-interaction-behavior');

        // Set the background color based on the input
        divWrapper.style.backgroundColor = backgroundColor ?? 'var(--light)';

        // Create the icon div
        const iconDiv = document.createElement('div');

        // Add Google Icons class
        iconDiv.classList.add('material-symbols-rounded');

        // Set the icon name based on the input (if iconName is Undefined or Null, default to 'sentiment_excited')
        iconDiv.textContent = iconName ?? 'sentiment_excited';

        // Set the color of the icon based on the input
        iconDiv.style.color = iconColor ?? 'var(--darkest)';

        // Set the color of the icon based on the input
        iconDiv.style.backgroundColor = textColor ?? 'var(--lightest)';

        // Create the message span
        const messageSpan = document.createElement('span');

        // Set the text message based on the input (if message is Undefined or Null, default to 'Placeholder')
        messageSpan.textContent = message ?? 'Placeholder';

        // Set the color of the message based on the input
        messageSpan.style.color = textColor ?? 'var(--darkest)';

        // Append the icon element to the div wrapper
        divWrapper.appendChild(iconDiv);

        // Append the message element to the div wrapper
        divWrapper.appendChild(messageSpan);

        // Append the chip to the container
        this.container.appendChild(divWrapper);

        // I have no clue why, but the animation only shows this way, removing the timeout doesn't play it
        setTimeout(() => {
            // Play the animation
            divWrapper.classList.add('show');

            // Reset the flag after animation
            this.isAnimating = false;
        }, 0);  // There is no delay at all either

        // Store the created chip reference to this instance
        this.chip = divWrapper;
    }

    /**
     * This method removes the chip.
     */
    remove() {
        // If a chip was created and not animating...
        if (this.chip && !this.isAnimating) {
            // Set the flag to indicate animation is in progress
            this.isAnimating = true

            this.chip.classList.remove('show');

            setTimeout(() => {
                // Remove the chip from the container
                this.container?.removeChild(this.chip);

                // Reset reference to prevent further removal
                this.chip = null;

                // Reset the flag after animation
                this.isAnimating = false;
            }, 750);
        }
    }
}


/**
 *! Show password
 */

// Contains the notification chip for when a password contains an invalid character
const invalidPasswordChip = new Chip;

/**
 * This function checks if the password in input is valid and meets the criteria.
 *
 * Criteria:
 *
 * The password must be at least eight characters long and contain at least:
 * - One uppercase letter;
 * - One number;
 * - One special character (such as "#", "@", "!", etc.).
 *
 * @param {String} password - The password value.
 * @returns True or False, whether the password is valid or not.
 */
function validatePassword(password) {
    /*
        REGEX explanation:
        ^ -> asserts that the check begins from the start of the string;

        [A-Z] -> ensures that at least one uppercase letter (from "A" to "Z") exists in the string.
        The `.*` before it ensures that there can be any amount of characters (even none) before it;

        \d -> ensures that at least one digit (dictated by `\d`, from "0" to "9") exists in the string.
        The `.*` before it ensures that there can be any amount of characters (even none) before it;

        [!@#$%^&*_\-+=|:;.,\?~`] -> ensures that at least one digit (of the list "!", "@", "#", "$",
        "%", "^", "&", "*", "_", "-", "+", "=", "|", ":", ";", ",", ".", "?", "~", "`") exists in the string.
        The `\` in the list are only there to escape the `-` and `?` characters and are not accepted in the list.
        The same goes for "/". The `.*` before it ensures that there can be any amount of characters (even none) before it.
    */
    // Check if the text has any uppercase letters
    const hasUppercase = /[A-Z]/.test(password);

    // Check if the text has any digits letters
    const hasNumber = /\d/.test(password);

    // Check if the text has any special characters
    const hasSpecial = /[!@#$%^&*_\-+=|:;.,\?~`]/.test(password);

    // Check if teh text is longer than 8 characters
    const isLongEnough = password.length >= 8;

    // Check for invalid characters (any character not in the allowed set)
    const hasInvalidChars = /[^A-Za-z0-9!@#$%^&*_\-+=|:;.,\?~`]/.test(password);

    // Update the requirements list
    document.getElementById("length").classList.toggle("satisfied", isLongEnough);
    document.getElementById("uppercase").classList.toggle("satisfied", hasUppercase);
    document.getElementById("number").classList.toggle("satisfied", hasNumber);
    document.getElementById("special").classList.toggle("satisfied", hasSpecial);

    // Return false if there are invalid characters
    if (hasInvalidChars) {
        // Add the chip with an icon and message
        invalidPasswordChip.add(
            'sentiment_dissatisfied',                       // Icon name
            'The password contains an invalid character!',  // Message
            '#be5454',                                      // Background color
            'var(--lightest)',                              // Text color
            '#712c2c'                                       // Icon color
        );

        return false;
    } else {
        // Remove the chip if the password is now valid
        invalidPasswordChip.remove();
    }

    // Return whether or not the password passes the REGEX test
    return isLongEnough && hasUppercase && hasNumber && hasSpecial;
}

/**
 * This function allows to toggle between visible text and hidden text in the password input field.
 */
function togglePassword() {
    // Contains the password input field
    const passwordField = document.getElementById('password');

    // Contains the "eye" toggle icon
    const eyeIcon = document.querySelector('#password-container span');

    // If the password's type is 'password' (hidden)
    if (passwordField.type === 'password') {
        // Toggle it to be visible ('text')
        passwordField.type = 'text';

        // Change the "eye" icon to be crossed
        eyeIcon.innerHTML = 'visibility_off';
    } else {
        // Toggle it to be hidden ('password')
        passwordField.type = 'password';

        // Change the "eye" icon to be visible
        eyeIcon.innerHTML = 'visibility';
    }
}


/**
 *! Behavioral CAPTCHA verification
 */
// Error notification in case the user is suspected to be a bot (by behavior)
const captchaChip = new Chip;

/**
 * This function verifies the behavioral CAPTCHA and decides whether the user should be prompted to complete the Text CAPTCHA next.
 */
function verifyCAPTCHA() {
    // Get the current behavioral CAPTCHA score the moment the user verifies
    const captchaScore = RISK_MONITOR.SCORE;

    // The threshold above which the user is considered a bot
    const captchaThreshold = 50; // %

    // The button element that will verify
    const buttonElement = document.querySelector("#credentials-step div.navigation-buttons button:nth-of-type(2)");

    // Check if the user is a bot
    if (captchaScore > captchaThreshold) {
        // If they are, go to the Text CAPTCHA step
        goToStep("captcha");

        // Add a notification chip with an icon and message
        captchaChip.add(
            'smart_toy',                    // Icon name
            'Bot-like behavior detected',   // Message
            '#be5454',                      // Background color
            'var(--lightest)',              // Text color
            '#712c2c'                       // Icon color
        );

        // Remove the notification chip after some time
        setTimeout(() => {
            // Call the 'remove' method
            captchaChip.remove();
        }, 3000);

        // Get the Text CAPTCHA input field
        const textCaptchaInput = document.querySelector('input[name="captcha"]');

        // Make the Text CAPTCHA input field required
        // (it isn't required by default, because the user might not be a bot and they could skip the Text CAPTCHA)
        textCaptchaInput.required = true;

        // Start the CAPTCHA
        textCAPTCHA.init();
    } else {    // Otherwise, if the user is not a bot
        // Add the .submit-button class to the button element
        buttonElement.classList.add("submit-button");

        // Change the button element's type to "submit"
        buttonElement.type = "submit";
    }
}


/**
 *! Text CAPTCHA verification
 */

// Contains all the functionalities related to the text CAPTCHA
const textCAPTCHA = {
    // Contains the canvas element
    canvas: document.getElementById('captcha-canvas'),

    // Contains the context of the canvas element
    context: null,

    // Contains the current CAPTCHA text
    currentText: '',

    // Contains the progress interval ID
    progressInterval: null,

    /**
     * This method sets up the CAPTCHA on start
     */
    init() {
        // Initialize the context after the DOM is fully loaded and the canvas is available
        this.context = this.canvas.getContext('2d');

        // Draw the table
        this.draw();

        // Draw the progress bar
        this.progressBar();
    },

    /**
     * This method refreshes the CAPTCHA, basically resetting it and staring a new one
     */
    refresh() {
        // If the progress bar interval started
        if (this.progressInterval) {
            // Clear the interval
            clearInterval(this.progressInterval);
        }

        // Reset the progress bar manually
        const progressBar = document.getElementById('progress-bar');
        progressBar.style.width = '100%';
        progressBar.style.backgroundColor = 'rgb(80, 180, 45)';

        // Reinitialize the canvas
        this.draw();

        // Restart the progress bar
        this.progressBar();
    },

    /**
     * This method draws the CAPTCHA
     */
    draw() {
        // Clear the canvas each new draw
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        /* Text settings */
        this.context.font = "48px Nunito";      // Font size and family
        this.context.textBaseline = "middle";   // Vertical alignment
        this.context.textAlign = "center";      // Horizontal alignment
        this.currentText = this.randomText(5);  // Generate random text
        const letterSpacing = 47.5;             // Distance between each character
        const startX = this.canvas.width / 4;   // Starting X position
        const startY = this.canvas.height / 2;  // Y position (centered)

        // Generate random lines
        this.randomLine(10);

        // Loop through each character in the random text
        for (let i = 0; i < this.currentText.length; i++) {
            // Set random color for each character
            this.context.fillStyle = this.randomColor();

            // Calculate X position for each character
            const x = startX + i * letterSpacing;

            // Draw each character
            this.context.fillText(this.currentText[i], x, startY);
        }

    },

    /**
     * This method returns a random string of characters as long as the length in input.
     * @param {Number} length - The number of characters the random text should be.
     * @returns Random string of characters.
     */
    randomText(length) {
        // Store the result random string
        let result = '';

        // List of possible characters
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!$%&?+*@#';

        // Generate random character based on the length passed
        for (let counter = 0; counter < length; counter++) {
            // Add the character at a random position of the 'characters' list to result
            result += characters[Math.floor(Math.random() * characters.length)];
        }

        // Return the resulting string
        return result;
    },

    /**
     * This method returns a random HEX color index (only darker colors, though).
     * @returns Random HEX color.
     */
    randomColor() {
        // The hex characters
        let hex = '0123456789ABCDEF';

        // The random color
        let color = '#';

        // Generate 6 random characters
        for (let i = 0; i < 6; i++) {
            color += hex[Math.floor(Math.random() * hex.length)];
        }

        // Convert hex to RGB
        let r = parseInt(color.slice(1, 3), 16);
        let g = parseInt(color.slice(3, 5), 16);
        let b = parseInt(color.slice(5, 7), 16);

        // Calculate luminance using the formula: Luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B
        let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        // If the luminance is too high (indicating a light color), regenerate the color
        // 200 is roughly the threshold for a color to be too light
        if (luminance > 200) {
            // Recursively call the function to generate a darker color
            return this.randomColor();
        }

        // Return the color
        return color;
    },

    /**
     * This method draws a certain amount of randomly colored, thick and positioned curved lines.
     * @param {Number} amount - The number of lines to draw.
     */
    randomLine(amount) {
        // Generate an amount of curved lines (if not defined, it is 5)
        for (let i = 0; i < (amount ?? 5); i++) {
            // Line ending
            this.context.lineCap = "round";

            // Start a path
            this.context.beginPath();

            // Randomly generate starting point
            const startX = Math.random() * this.canvas.width;
            const startY = Math.random() * this.canvas.height;

            // Randomly generate control points
            const controlX1 = Math.random() * this.canvas.width;
            const controlY1 = Math.random() * this.canvas.height;

            const controlX2 = Math.random() * this.canvas.width;
            const controlY2 = Math.random() * this.canvas.height;

            // Randomly generate end points
            const endX = Math.random() * this.canvas.width;
            const endY = Math.random() * this.canvas.height;

            // Move to the start position
            this.context.moveTo(startX, startY);

            // Create a bezier curve using control points
            this.context.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);

            // Random color with transparency
            this.context.strokeStyle = this.randomColor() + '69';

            // Random line width
            this.context.lineWidth = Math.random() * 3 + 1;

            // Draw line
            this.context.stroke();
        }
    },

    // Time between each refresh
    timeout: 30, // seconds

    /**
     * This function creates the interval update for the progress bar.
     */
    progressBar() {
        // The current time
        let currentTime = this.timeout;

        // How often should the progress bar update (the lower, the smoother)
        const refreshInterval = 50; // ms

        /**
         * This function updates the progress bar color and width each second
         */
        const update = () => {
            // Get the progress bar element
            const progressBar = document.getElementById('progress-bar');

            // Reduce the time by one second
            currentTime -= refreshInterval / 1000;

            // Calculate the percentage the bar should represent
            const percentage = currentTime / this.timeout;

            // Update the progress bar width
            progressBar.style.width = percentage * 100 + '%';

            // Transition from red to green
            progressBar.style.backgroundColor = `rgb(${Math.round(180 + (80 - 180) * percentage)},
                                                     ${Math.round(45 + (180 - 45) * percentage)},
                                                     45)`;

            // When the timer reaches 0
            if (currentTime <= 0) {
                // Reset countdown
                currentTime = this.timeout;

                // Reset progress bar to full width
                progressBar.style.width = '100%';

                // Refresh CAPTCHA
                this.refresh();
            }
        }

        // Set the interval and save its reference
        this.progressInterval = setInterval(update, refreshInterval);
    },

    // Contains the notification chip in case of wrong CAPTCHA input
    chip: new Chip,

    validate() {
        // The input CAPTCHA text
        const input = document.getElementById('captcha').value;

        // Button element
        const button = document.querySelector("#captcha-step div.navigation-buttons button:nth-of-type(2)");

        // If the input is different from the current CAPTCHA text and the notification isn't in the DOM
        if (input != this.currentText) {
            // Don't add a chip if it is already present
            if (this.chip.chip) { return; }

            // Add the notification
            this.chip.add(
                'sentiment_very_dissatisfied',  // Icon name
                'CAPTCHA failed!',              // Message
                '#be5454',                      // Background color
                'var(--lightest)',              // Text color
                '#712c2c'                       // Icon color
            )

            // Remove the notification chip after some time
            setTimeout(() => {
                // Call the 'remove' method
                this.chip.remove();
            }, 3000);
        } else {
            // Add the .submit-button class to the button element
            button.classList.add("submit-button");

            // Change the button element's type to "submit"
            button.type = "submit";
        }
    }
}


/**
 *! Redirect error handling
 *  This code handles any errors thrown back by the PHP.
 */
// Error notification chip that will show when an error message is present
const redirectErrorChip = new Chip;

/**
 * This function checks for any redirect errors in the localStorage.
 */
function checkRedirectErrors() {
    // If the localStorage doesn't have a 'missing_data' login error, exit the function
    if (localStorage.getItem("login_error") !== "missing_data") { return; }

    // Show a "redirect error chip"
    redirectErrorChip.add(
        'report',                       // Icon name
        'Incomplete field',             // Message
        '#be5454',                      // Background color
        'var(--lightest)',              // Text color
        '#712c2c'                       // Icon color
    )

    // Remove the notification chip after some time
    setTimeout(() => {
        // Call the 'remove' method
        redirectErrorChip.remove();
    }, 7000);

    // Remove the 'login_error' flag after showing the message to prevent it from re-triggering
    localStorage.removeItem("login_error");
}

// Check for redirection errors on load
window.onload = checkRedirectErrors;