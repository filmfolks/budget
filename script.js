document.addEventListener('DOMContentLoaded', () => {
    
    // --- Global & Shared Elements ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    
    // --- INDEX PAGE LOGIC ---
    const indexHamburgerBtn = document.getElementById('hamburger-btn-index');
    const indexDropdownMenu = document.getElementById('index-dropdown-menu');
    const saveProjectBtn = document.getElementById('save-project-btn');
    const openProjectBtn = document.getElementById('open-project-btn');
    const fileInput = document.getElementById('file-input');

    if (indexHamburgerBtn) {
        indexHamburgerBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent document click from closing immediately
            indexDropdownMenu.classList.toggle('show');
        });
        // Close dropdown if clicked outside
        document.addEventListener('click', (event) => {
            if (!indexDropdownMenu.contains(event.target) && !indexHamburgerBtn.contains(event.target)) {
                indexDropdownMenu.classList.remove('show');
            }
        });
    }

    if (saveProjectBtn) {
        saveProjectBtn.addEventListener('click', saveProjectFile);
    }
    
    if (openProjectBtn) {
        openProjectBtn.addEventListener('click', () => {
            fileInput.click(); // Trigger the hidden file input
        });
        fileInput.addEventListener('change', openProjectFile);
    }
    
    // Hamburger Menu Logic (for internal pages)
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent document click from closing immediately
            dropdownMenu.classList.toggle('show');
        });
        // Close dropdown if clicked outside
        document.addEventListener('click', (event) => {
            if (!dropdownMenu.contains(event.target) && !hamburgerBtn.contains(event.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }

    // Placeholder for export functions
    const savePdfBtn = document.getElementById('save-pdf-btn');
    const exportSheetsBtn = document.getElementById('export-sheets-btn');
    if(savePdfBtn) savePdfBtn.addEventListener('click', () => alert('Save as PDF functionality would be implemented here.'));
    if(exportSheetsBtn) exportSheetsBtn.addEventListener('click', () => alert('Export to Google Sheets requires API integration.'));
    
   // --- SCHEDULING PAGE LOGIC (RE-ARCHITECTED) ---
    if (document.getElementById('schedule-form')) {
        const scheduleForm = document.getElementById('schedule-form');
        
        // On page load, load data into the central array and render the UI
        loadScheduleData();

        scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newScene = {
                id: Date.now(), // Unique ID for each scene
                number: document.getElementById('scene-number').value,
                heading: document.getElementById('scene-heading').value,
                date: document.getElementById('scene-date').value,
                time: document.getElementById('scene-time').value,
                type: document.getElementById('scene-type').value,
                location: document.getElementById('scene-location').value,
                pages: document.getElementById('scene-pages').value,
                duration: document.getElementById('scene-duration').value,
                status: document.getElementById('scene-status').value,
                cast: document.getElementById('scene-cast').value,
                equipment: document.getElementById('scene-equipment').value
            };
            
            // Add the new scene to our central data array
            scheduleData.push(newScene);
            
            // Save the updated array to localStorage
            saveScheduleData();
            
            // Re-render the entire list of scenes from the array
            renderSchedule();
            
            scheduleForm.reset();
        });
    }
});

// =================================================================
// --- NEW SCHEDULE DATA MANAGEMENT ---
// =================================================================

// The "Single Source of Truth" for all schedule data
let scheduleData = [];

// Renders the entire list of scene strips from the scheduleData array
function renderSchedule() {
    const container = document.getElementById('scene-strips-container');
    if (!container) return;
    
    container.innerHTML = ''; // Clear the current display

    scheduleData.forEach(scene => {
        const stripWrapper = document.createElement('div');
        stripWrapper.className = 'scene-strip-wrapper';
        stripWrapper.dataset.id = scene.id;

        const statusClass = scene.status.toLowerCase();

        stripWrapper.innerHTML = `
            <div class="scene-strip" id="scene-strip-${scene.id}">
                <div class="strip-item"><strong>#${scene.number}</strong></div>
                <div class="strip-item">${scene.heading}</div>
                <div class="strip-item">${scene.date}</div>
                <div class="strip-item">${scene.time}</div>
                <div class="strip-item">${scene.type}. ${scene.location}</div>
                <div class="strip-item">Pages: <strong>${scene.pages || 'N/A'}</strong></div>
                <div class="strip-item">Duration: <strong>${scene.duration || 'N/A'}</strong></div>
                <div class="strip-item">Cast: <strong>${scene.cast || 'N/A'}</strong></div>
                <div class="strip-item">Equipment: <strong>${scene.equipment || 'N/A'}</strong></div>
                <div class="strip-item"><span class="strip-status ${statusClass}">${scene.status}</span></div>
            </div>
            <div class="scene-actions">
                <button class="share-btn-strip" title="Share as Image"><i class="fas fa-share-alt"></i></button>
                <button class="btn-danger" title="Delete Scene"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        // Add event listeners directly to the new buttons
        stripWrapper.querySelector('.btn-danger').addEventListener('click', () => deleteScene(scene.id));
        stripWrapper.querySelector('.share-btn-strip').addEventListener('click', () => shareScene(scene.id));
        
        container.appendChild(stripWrapper);
    });
}

// Loads data from localStorage into our central array
function loadScheduleData() {
    const savedData = localStorage.getItem('scheduleData');
    scheduleData = savedData ? JSON.parse(savedData) : [];
    renderSchedule();
}

// Saves the central array to localStorage
function saveScheduleData() {
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
}

// Deletes a scene by its ID, saves, and re-renders
function deleteScene(id) {
    if (confirm('Are you sure you want to delete this scene?')) {
        scheduleData = scheduleData.filter(scene => scene.id !== id);
        saveScheduleData();
        renderSchedule();
    }
}

// Shares a scene as an image using html2canvas and the Web Share API
async function shareScene(id) {
    const stripElement = document.getElementById(`scene-strip-${id}`);
    if (!stripElement) return;

    try {
        const canvas = await html2canvas(stripElement, {
            backgroundColor: '#111827', // Match the app's background
            scale: 2 // Higher resolution image
        });
        
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        
        const file = new File([blob], `scene_${id}.png`, { type: 'image/png' });
        
        // Use the Web Share API if available (great for mobile)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: `Shooting Schedule - Scene`,
                text: `Details for scene.`
            });
        } else {
            // Fallback for desktop browsers
            alert("Share API not supported. On mobile, this would open the native share dialog. As a fallback, you can right-click the image to save it.");
            const imgUrl = URL.createObjectURL(blob);
            window.open(imgUrl, '_blank');
        }
    } catch (error) {
        console.error('Sharing failed:', error);
        alert('Could not generate image for sharing. Please try again.');
    }
}


    // --- BUDGETING PAGE LOGIC ---
    if (document.getElementById('budget-form')) {
        const budgetForm = document.getElementById('budget-form');
        const currencySelect = document.getElementById('currency-select');
        
        loadBudgetData();
        
        let currentCurrency = localStorage.getItem('userCurrency') || 'USD';
        currencySelect.value = currentCurrency;
        
        currencySelect.addEventListener('change', () => {
            currentCurrency = currencySelect.value;
            localStorage.setItem('userCurrency', currentCurrency);
            document.getElementById('item-cost').placeholder = `Cost (${getCurrencySymbol(currentCurrency)})`;
            updateTotalBudget();
        });

        document.getElementById('item-cost').placeholder = `Cost (${getCurrencySymbol(currentCurrency)})`;
        
        budgetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const cost = parseFloat(document.getElementById('item-cost').value);
            if (isNaN(cost)) {
                alert('Please enter a valid cost.');
                return;
            }

            const budgetData = {
                description: document.getElementById('item-description').value,
                category: document.getElementById('item-category').value,
                cost: cost
            };

            addBudgetItemToTable(budgetData);
            saveBudgetData();
            budgetForm.reset();
        });
    }
});

// =================================================================
// --- DATA PERSISTENCE & HANDLING FUNCTIONS ---
// =================================================================

// --- SCHEDULE DATA FUNCTIONS (UPDATED FOR SCENE CARDS) ---
function addSceneCard(sceneData) {
    const sceneCardsContainer = document.getElementById('scene-cards-container');
    const sceneCard = document.createElement('div');
    sceneCard.className = 'scene-card';
    sceneCard.dataset.id = sceneData.id; // Store ID on the element

    const statusClass = sceneData.status.toLowerCase();

    // The inner HTML of the scene card, including the share button
    sceneCard.innerHTML = `
        <div class="scene-card-info">
            <div class="scene-card-item"><strong>${sceneData.number}</strong>: ${sceneData.heading}</div>
            <div class="scene-card-item"><i class="fas fa-calendar-alt"></i> ${sceneData.date}</div>
            <div class="scene-card-item"><i class="fas fa-clock"></i> ${sceneData.time}</div>
            <div class="scene-card-item"><i class="fas fa-map-marker-alt"></i> ${sceneData.type}. ${sceneData.location}</div>
            <div class="scene-card-item"><i class="fas fa-hourglass-half"></i> ${sceneData.duration || 'N/A'}</div>
            <div class="scene-card-item"><i class="fas fa-users"></i> ${sceneData.cast || 'N/A'}</div>
            <div class="scene-card-item"><i class="fas fa-camera"></i> ${sceneData.equipment || 'N/A'}</div>
        </div>
        <div class="scene-card-actions">
            <span class="scene-card-status ${statusClass}">${sceneData.status}</span>
            <button class="share-btn" onclick="shareSceneAsImageCard(event, ${sceneData.id})"><i class="fab fa-whatsapp"></i></button>
            <button class="btn-danger" onclick="deleteSceneCard(this)">Delete</button>
        </div>
    `;
    sceneCardsContainer.prepend(sceneCard); // Add to the top
}

function saveScheduleData() {
    const sceneCardsContainer = document.getElementById('scene-cards-container');
    if (!sceneCardsContainer) return;

    const sceneCards = sceneCardsContainer.querySelectorAll('.scene-card');
    const scheduleData = [];
    sceneCards.forEach(card => {
        // Reconstruct the scene object from the card's displayed text and dataset
        const scene = {
            id: parseInt(card.dataset.id),
            number: card.querySelector('.scene-card-item strong').textContent.split(':')[0].trim(),
            heading: card.querySelector('.scene-card-item strong').nextSibling.textContent.split(':')[1].trim(), // More robust parsing needed here if heading can contain ':'
            date: card.querySelector('.fa-calendar-alt').nextSibling.textContent.trim(),
            time: card.querySelector('.fa-clock').nextSibling.textContent.trim(),
            location: card.querySelector('.fa-map-marker-alt').nextSibling.textContent.split('. ')[1].trim(),
            type: card.querySelector('.fa-map-marker-alt').nextSibling.textContent.split('. ')[0].trim(),
            duration: card.querySelector('.fa-hourglass-half').nextSibling.textContent.trim(),
            cast: card.querySelector('.fa-users').nextSibling.textContent.trim(),
            equipment: card.querySelector('.fa-camera').nextSibling.textContent.trim(),
            status: card.querySelector('.scene-card-status').textContent.trim(),
            // pages is not displayed on card, so it needs to be explicitly saved if important
            // For now, let's assume it's implicit, or re-add it to the card.
            // For robust saving, you might want to store more data on `dataset` attributes.
        };
        scheduleData.push(scene);
    });
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
}

function loadScheduleData() {
    if (!document.getElementById('scene-cards-container')) return;
    const scheduleData = JSON.parse(localStorage.getItem('scheduleData')) || [];
    // Important: Render in reverse to maintain order when prepending
    scheduleData.slice().reverse().forEach(scene => addSceneCard(scene));
}

// --- BUDGET DATA FUNCTIONS (Same as before) ---
function addBudgetItemToTable(budgetData) {
    const budgetTableBody = document.getElementById('budget-table-body');
    const newRow = budgetTableBody.insertRow();
    newRow.innerHTML = `
        <td data-label="Description">${budgetData.description}</td>
        <td data-label="Category">${budgetData.category}</td>
        <td class="align-right" data-label="Cost" data-cost="${budgetData.cost}">${formatCurrency(budgetData.cost)}</td>
        <td data-label="Action"><button class="btn-danger" onclick="deleteRow(this, 'budget')">Delete</button></td>
    `;
    updateTotalBudget();
}

function saveBudgetData() {
    const budgetTableBody = document.getElementById('budget-table-body');
    if (!budgetTableBody) return;
    const rows = budgetTableBody.querySelectorAll('tr');
    const budgetData = [];
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const item = {
            description: cells[0].textContent,
            category: cells[1].textContent,
            cost: parseFloat(cells[2].getAttribute('data-cost'))
        };
        budgetData.push(item);
    });
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
    updateTotalBudget();
}

function loadBudgetData() {
    if (!document.getElementById('budget-table-body')) return;
    const budgetData = JSON.parse(localStorage.getItem('budgetData')) || [];
    budgetData.forEach(item => addBudgetItemToTable(item));
}

// --- GLOBAL HELPER FUNCTIONS ---
function deleteRow(button, type) {
    button.closest('tr').remove();
    if (type === 'schedule') { // This path is now for budget only
        saveScheduleData(); // Will not be called for budget anymore
    } else if (type === 'budget') {
        saveBudgetData();
    }
}

// New function to delete scene cards
function deleteSceneCard(button) {
    button.closest('.scene-card').remove();
    saveScheduleData(); // Save state after deletion
}


// --- PROJECT FILE SAVE/LOAD FUNCTIONS ---
function saveProjectFile() {
    // Ensure all current data is saved to localStorage before bundling
    if (document.getElementById('schedule-form')) saveScheduleData();
    if (document.getElementById('budget-form')) saveBudgetData();

    const projectData = {
        projectName: "My Film Project",
        saveDate: new Date().toISOString(),
        version: "1.0",
        scheduleData: JSON.parse(localStorage.getItem('scheduleData')) || [],
        budgetData: JSON.parse(localStorage.getItem('budgetData')) || [],
        // Add other data sections here as you build them
        // storyboardData: JSON.parse(localStorage.getItem('storyboardData')) || [],
        // scriptData: localStorage.getItem('scriptData') || "",
        // notesData: localStorage.getItem('notesData') || ""
    };
    const jsonString = JSON.stringify(projectData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MyProject.filmproj';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    const indexDropdownMenu = document.getElementById('index-dropdown-menu');
    if (indexDropdownMenu) {
        indexDropdownMenu.classList.remove('show');
    }
}

function openProjectFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const projectData = JSON.parse(e.target.result);
            
            // Clear current data and load new data into localStorage
            localStorage.setItem('scheduleData', JSON.stringify(projectData.scheduleData || []));
            localStorage.setItem('budgetData', JSON.stringify(projectData.budgetData || []));
            // Add other data sections here
            
            alert('Project loaded successfully! Please refresh the page or navigate to the schedule or budget pages to see the data.');
            
            // Optional: Immediately refresh page to display new data
            // window.location.reload(); 

        } catch (error) {
            console.error("Error loading project file:", error);
            alert('Error: Could not read the project file. Please ensure it is a valid .filmproj file. Details: ' + error.message);
        }
    };
    reader.readAsText(file);
    const indexDropdownMenu = document.getElementById('index-dropdown-menu');
    if (indexDropdownMenu) {
        indexDropdownMenu.classList.remove('show');
    }
}


// --- BUDGET-SPECIFIC UTILITY FUNCTIONS ---
function updateTotalBudget() {
    if (!document.getElementById('budget-table-body')) return;
    const totalBudgetEl = document.getElementById('total-budget');
    const costCells = document.getElementById('budget-table-body').querySelectorAll('[data-cost]');
    let total = 0;
    costCells.forEach(cell => {
        total += parseFloat(cell.dataset.cost);
    });
    totalBudgetEl.textContent = formatCurrency(total);
}

function formatCurrency(amount) {
    const currentCurrency = localStorage.getItem('userCurrency') || 'USD';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currentCurrency,
    }).format(amount);
}

function getCurrencySymbol(currencyCode) {
    const symbols = { 'USD': '$', 'EUR': '€', 'INR': '₹', 'GBP': '£' };
    return symbols[currencyCode] || '$';
}

// --- NEW: Share Function (WhatsApp) ---
function shareSceneAsImageCard(event, sceneId) {
    event.stopPropagation(); // Prevent the card from being interacted with further if applicable
    const sceneCardElement = document.querySelector(`.scene-card[data-id="${sceneId}"]`);
    if (!sceneCardElement) {
        alert("Scene card not found for sharing.");
        return;
    }

    // Extract text content for sharing
    const sceneNumber = sceneCardElement.querySelector('.scene-card-item strong').textContent.split(':')[0].trim();
    const sceneHeading = sceneCardElement.querySelector('.scene-card-item strong').nextSibling.textContent.split(':')[1].trim();
    const sceneDate = sceneCardElement.querySelector('.fa-calendar-alt').nextSibling.textContent.trim();
    const sceneTime = sceneCardElement.querySelector('.fa-clock').nextSibling.textContent.trim();
    const sceneLocation = sceneCardElement.querySelector('.fa-map-marker-alt').nextSibling.textContent.split('. ')[1].trim();
    const sceneType = sceneCardElement.querySelector('.fa-map-marker-alt').nextSibling.textContent.split('. ')[0].trim();
    const sceneDuration = sceneCardElement.querySelector('.fa-hourglass-half').nextSibling.textContent.trim();
    const sceneCast = sceneCardElement.querySelector('.fa-users').nextSibling.textContent.trim();
    const sceneEquipment = sceneCardElement.querySelector('.fa-camera').nextSibling.textContent.trim();
    const sceneStatus = sceneCardElement.querySelector('.scene-card-status').textContent.trim();

    // Construct the message for WhatsApp
    // Note: WhatsApp doesn't support sharing HTML/CSS as an image directly from web.
    // It only allows text, links, or pre-rendered images (if you integrate a server-side image generation).
    // For now, we'll send a well-formatted text message.
    const whatsappMessage = `🎬 FilmPro Schedule Update! 🎬\n\n` +
                            `*Scene ${sceneNumber}*: ${sceneHeading}\n` +
                            `📅 *Date*: ${sceneDate}\n` +
                            `⏰ *Time*: ${sceneTime}\n` +
                            `📍 *Location*: ${sceneType}. ${sceneLocation}\n` +
                            `⏳ *Duration*: ${sceneDuration}\n` +
                            `👥 *Cast*: ${sceneCast}\n` +
                            `🎥 *Equipment*: ${sceneEquipment}\n` +
                            `✅ *Status*: ${sceneStatus}\n\n` +
                            `#FilmPro #ShootingSchedule`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');

    // To truly share as an "image card",
