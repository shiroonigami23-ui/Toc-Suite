// ai-auth.js

let isAuthenticated = false;
const CORRECT_PASSWORD = "Shiro";
let currentResolver = null; // Stores the promise resolver function

/**
 * Attaches event listeners to the AI Auth Modal buttons.
 */
function setupAiAuthModalListeners() {
    const modal = document.getElementById('aiAuthModal');
    const input = document.getElementById('aiPasswordInput');
    const confirmBtn = document.getElementById('aiAuthConfirm');
    const cancelBtn = document.getElementById('aiAuthCancel');

    if (!modal || !input || !confirmBtn || !cancelBtn) return;
    
    // Handle Enter keypress for quick submission
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUnlockAttempt();
        }
    });

    confirmBtn.addEventListener('click', handleUnlockAttempt);
    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        if (currentResolver) {
            currentResolver(false); // Resolve with failure on cancel
        }
        currentResolver = null;
    });
}

/**
 * Handles the user's attempt to enter the password.
 */
function handleUnlockAttempt() {
    const modal = document.getElementById('aiAuthModal');
    const input = document.getElementById('aiPasswordInput');
    const password = input.value.trim();

    // Reset descriptive message to default
    const message = modal.querySelector('.modal-description');
    
    if (password === CORRECT_PASSWORD) {
        isAuthenticated = true;
        
        if (window.customAlert) {
            window.customAlert("Success!", "AI Generator Unlocked for this session!");
        } else {
            alert("AI Generator Unlocked for this session!");
        }
        
        modal.style.display = 'none';
        if (currentResolver) {
            currentResolver(true); // Resolve with success
        }
    } else {
        input.value = '';
        input.focus();
        
        // Indicate failure visually
        if (message) {
             message.innerHTML = 
            'Incorrect password. Try again! <span style="color:' + window.getComputedStyle(document.body).getPropertyValue('--danger') + ';">(Hint: Check the case!)</span>';
        }
         }
}

/**
 * Checks if the user has authenticated in the current session.
 * If not, shows the stylish modal prompt and waits for input.
 * @returns {Promise<boolean>} Resolves to true if authentication succeeds or is already active.
 */
export function authenticateAiAccess() {
    if (isAuthenticated) {
        return Promise.resolve(true);
    }

    const modal = document.getElementById('aiAuthModal');
    const input = document.getElementById('aiPasswordInput');
    const originalMessage = modal.querySelector('.modal-description');

    if (!modal || !input) {
         // Fallback or error state
        return Promise.resolve(false); 
    }
    
    // Reset modal state
    input.value = '';
    originalMessage.textContent = "Please enter the one-time password to unlock AI generation features for this session.";

    modal.style.display = 'flex';
    input.focus();

    // Return a Promise that resolves when the user clicks 'Unlock' or 'Cancel'
    return new Promise((resolve) => {
        currentResolver = resolve;
    });
}

// Global initialization to attach listeners once the DOM is ready
document.addEventListener("DOMContentLoaded", setupAiAuthModalListeners);
