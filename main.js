import { initializeState, setRenderFunction } from './state.js';
import { initializeUI } from './ui.js';
import { renderAll } from './renderer.js';
import { initializeLibrary } from './library-loader.js';

// --- Global Functions for Multi-Studio Environment ---

// FIX: Expose FA setMachine globally (used by FA file.js and FA conversion animation)
import { setMachine } from './state.js';
window.setFaMachine = setMachine;

// Function to handle loading of FA Studio
function loadFaStudio(machineData) {
    if (machineData) {
        setMachine(machineData); // Use the FA setter
    }
    initializeUI();
    initializeLibrary(); 
}
window.loadFaStudio = loadFaStudio; 


// NOTE: Moore/Mealy Studio must define and initialize itself separately
// Its initialization functions (like initializeMMUI) are imported by unified_main.js
// but since we are modifying files locally, we will keep the core logic simple.


// --- Main Application Startup ---
document.addEventListener("DOMContentLoaded", () => {
    const splashScreen = document.getElementById('splashScreen');
    const mainApp = document.getElementById('mainApp');
    
    // FIX: Update the selectors to match the HTML buttons ('FA' and 'MM')
    const faButton = document.querySelector('.splash-nav-btn[data-target="FA"]');
    const mmButton = document.querySelector('.splash-nav-btn[data-target="MM"]');
    
    // Assuming renderAll is for the FA studio visualization panel by default
    setRenderFunction(renderAll);

    // This is the common function to hide the splash screen and start the FA app
    const startFaApp = () => {
        if (mainApp) mainApp.style.display = 'block';

        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            // Load the FA studio logic
            loadFaStudio();
        }, 0); 
    };
    
    // --- Splash Screen Navigation ---
    if (splashScreen && mainApp) {
        // Find the button that is likely auto-clicked if a unified_main.js isn't loaded
        
        // FIX: The FA studio should only start when its button is clicked
        if (faButton) {
            faButton.addEventListener('click', () => {
                splashScreen.style.opacity = '0';
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                    startFaApp();
                }, 800); 
            });
        }
        
        // We need a proper loader for the MM Studio as well, likely provided by unified_main.js
        if (mmButton) {
             mmButton.addEventListener('click', async () => {
                splashScreen.style.opacity = '0';
                setTimeout(async () => {
                    splashScreen.style.display = 'none';
                    // The MM Studio needs to load its HTML content and run its own initialization
                    // Assuming this is done by a unified_main.js or similar logic that loads 'mealy_moore_studio.html' content
                    // Since I don't have unified_main.js, I rely on the existing environment setup.
                    // For now, let's ensure the MM studio buttons are clickable and try to trigger the MM initialization.
                    
                    // Fallback attempt: if MM Studio UI function exists (from moore_mealy_ui.js) call it
                    if (window.initializeMMUI) {
                        window.initializeMMUI(); // Assumes MM studio UI is loaded/ready
                    }
                }, 800); 
            });
        }
        
        // Default start (if no unified_main or external loader)
        if (!faButton && !mmButton) {
             startFaApp(); // This will try to load FA studio if no buttons are found, relying on external HTML injection
        }
    }
});