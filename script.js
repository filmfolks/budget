// =================================================================
// --- GLOBAL INITIALIZATION & EVENT LISTENERS ---
// =================================================================

// The "Single Source of Truth" for all schedule data.
// This array holds the scene objects, is saved to localStorage, and is used to render the UI.
let scheduleData = [];

document.addEventListener('DOMContentLoaded', () => {
    
    // --- INDEX PAGE LOGIC ---
    const indexHamburgerBtn = document.getElementById('hamburger-btn-index');
    const indexDropdownMenu = document.getElementById('index-dropdown-menu');
    const saveProjectBtn = document.getElementById('save-project-btn');
    const openProjectBtn = document.getElementById('open-project-btn');
    const fileInput = document.getElementById('file-input');

    if (indexHamburgerBtn) {
        indexHamburgerBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            indexDropdownMenu.classList.toggle('show');
        });
    }
    if (saveProjectBtn) {
        saveProjectBtn.addEventListener('click', saveProjectFile);
    }
    if (openProjectBtn) {
        openProjectBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', openProjectFile);
    }

    // --- INTERNAL PAGES LOGIC (Schedule, Budget) ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
    }
    
    // Close dropdowns if clicked outside
    document.addEventListener('click', (event) => {
        if (indexDropdownMenu && !indexDropdownMenu.contains(event.target) && !indexHamburgerBtn.contains(event.target)) {
            indexDropdownMenu.classList.remove('show');
        }
        if (dropdownMenu && !dropdownMenu.contains(event.target) && !hamburgerBtn.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }
    });

    const savePdfBtn = document.getElementById('save-pdf-btn');
    if (savePdfBtn) savePdfBtn.addEventListener('click', () => alert('Save as PDF functionality would be implemented here.'));
    
    const exportSheetsBtn = document.getElementById('export-sheets-btn');
    if (exportSheetsBtn) exportSheetsBtn.addEventListener('click', () => alert('Export to Google Sheets requires API integration.'));
    

    // --- SCHEDULING PAGE LOGIC ---
    if (document.getElementById('schedule-form')) {
        const scheduleForm = document.getElementById('schedule-form');
        // On page load, load data into the global array and render the UI
        loadScheduleData();

        scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Create a new scene object directly from the form field values
            const newScene = {
                id: Date.now(),
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
            
            // Add the new scene object to our central data array
            scheduleData.push(newScene);
            
            // Save the entire updated array to localStorage
            saveScheduleData();
            
            // Re-render the complete list of scenes from the array
            renderSchedule();
            
            // Reset the form for the next entry
            scheduleForm.reset();
        });
    }

    // --- BUDGETING PAGE LOGIC ---
    if (document.getElementById('budget-form')) {
        const budgetForm = document.getElementById('budget-form');
        const currencySelect = document.getElementById('currency-select');
        
        loadBudgetData(); // Load and render budget data
        
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


// --- SCHEDULING PAGE LOGIC ---
    if (document.getElementById('schedule-form')) {
        const scheduleForm = document.getElementById('schedule-form');
        const contactInput = document.getElementById('scene-contact');
        
        // Load data, which will also populate the 'lastContactPerson' variable
        loadScheduleData();
        // Set the contact field to the last known value
        if(contactInput) contactInput.value = lastContactPerson;

        scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Create a new scene object, including the new contact field
            const newScene = {
                id: Date.now(),
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
                equipment: document.getElementById('scene-equipment').value,
                contact: document.getElementById('scene-contact').value, // Get new contact value
            };
            
            // Remember this contact for the next scene
            lastContactPerson = newScene.contact;

            scheduleData.push(newScene);
            saveScheduleData();
            renderSchedule();
            
            scheduleForm.reset();
            // After resetting, restore the contact person's name
            document.getElementById('scene-contact').value = lastContactPerson;
        });
    }
});


// =================================================================
// --- SCHEDULE DATA MANAGEMENT ---
// =================================================================

/**
 * Loads data from localStorage, updates the central scheduleData array,
 * sets the lastContactPerson, and renders the UI.
 */
function loadScheduleData() {
    const savedData = localStorage.getItem('scheduleData');
    scheduleData = savedData ? JSON.parse(savedData) : [];
    // If there's saved data, set the last known contact person
    if (scheduleData.length > 0) {
        lastContactPerson = scheduleData[scheduleData.length - 1].contact || '';
    }
    renderSchedule();
}

/**
 * Saves the central array (including contact info) to localStorage.
 */
function saveScheduleData() {
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
}

/**
 * Renders the scene strips from the central data array.
 * This function does not need major changes.
 */
function renderSchedule() {
    // ... (This function remains the same as the previous version)
    const container = document.getElementById('scene-strips-container');
    if (!container) return;
    container.innerHTML = '';
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
        
        stripWrapper.querySelector('.btn-danger').addEventListener('click', () => deleteScene(scene.id));
        stripWrapper.querySelector('.share-btn-strip').addEventListener('click', () => shareScene(scene.id));
        
        container.appendChild(stripWrapper);
    });
}

/**
 * Deletes a scene and updates the UI.
 * This function does not need changes.
 */
function deleteScene(id) {
    if (confirm('Are you sure you want to delete this scene?')) {
        scheduleData = scheduleData.filter(scene => scene.id !== id);
        saveScheduleData();
        renderSchedule();
    }
}


// =================================================================
// --- BUDGET DATA MANAGEMENT ---
// =================================================================

function addBudgetItemToTable(budgetData) {
    const budgetTableBody = document.getElementById('budget-table-body');
    const newRow = budgetTableBody.insertRow();
    newRow.innerHTML = `
        <td data-label="Description">${budgetData.description}</td>
        <td data-label="Category">${budgetData.category}</td>
        <td class="align-right" data-label="Cost" data-cost="${budgetData.cost}">${formatCurrency(budgetData.cost)}</td>
        <td data-label="Action"><button class="btn-danger" onclick="deleteBudgetItem(this)">Delete</button></td>
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
    const budgetTableBody = document.getElementById('budget-table-body');
    if (!budgetTableBody) return;
    const budgetData = JSON.parse(localStorage.getItem('budgetData')) || [];
    budgetTableBody.innerHTML = ''; // Clear existing rows before loading
    budgetData.forEach(item => addBudgetItemToTable(item));
}

function deleteBudgetItem(button) {
    button.closest('tr').remove();
    saveBudgetData();
}


// =================================================================
// --- PROJECT FILE SAVE/LOAD ---
// =================================================================

function saveProjectFile() {
    // Ensure the latest data from the central array is saved before bundling
    saveScheduleData(); 
    saveBudgetData();

    const projectData = {
        projectName: "My Film Project",
        saveDate: new Date().toISOString(),
        version: "1.0",
        scheduleData: scheduleData, // Use the up-to-date global array
        budgetData: JSON.parse(localStorage.getItem('budgetData')) || [],
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
}

function openProjectFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const projectData = JSON.parse(e.target.result);
            
            // Load data into localStorage
            localStorage.setItem('scheduleData', JSON.stringify(projectData.scheduleData || []));
            localStorage.setItem('budgetData', JSON.stringify(projectData.budgetData || []));
            
            alert('Project loaded successfully! Navigate to the schedule or budget pages to see the new data.');
            
            // If we are currently on the schedule page, immediately reload its data and render it
            if (document.getElementById('schedule-form')) {
                loadScheduleData();
            }
        } catch (error) {
            alert('Error: Could not read the project file.');
        }
    };
    reader.readAsText(file);
}

// =================================================================
// --- NEW AND UPDATED UTILITY FUNCTIONS ---
// =================================================================

/**
 * Formats a 24-hour time string (e.g., "14:30") to a 12-hour AM/PM format (e.g., "2:30 PM").
 */
function formatTime12Hour(timeString) {
    if (!timeString) return "N/A";
    const [hour, minute] = timeString.split(':');
    const hourInt = parseInt(hour, 10);
    const ampm = hourInt >= 12 ? 'PM' : 'AM';
    const hour12 = hourInt % 12 || 12; // Convert hour 0 to 12
    return `${hour12}:${minute} ${ampm}`;
}

/**
 * REWRITTEN: Shares a scene by generating a vertical image card from the hidden template.
 */
async function shareScene(id) {
    const template = document.getElementById('share-card-template');
    const scene = scheduleData.find(s => s.id === id); // Find the scene data from our central array

    if (!template || !scene) {
        alert("Error: Could not find scene data or template.");
        return;
    }

    // 1. Populate the hidden template with the scene's data
    template.innerHTML = `
        <div class="share-card-content">
            <div class="share-card-header">
                <h1>Scene #${scene.number}</h1>
                <h2>${scene.heading}</h2>
            </div>
            <p class="share-card-item"><strong>Date:</strong> ${scene.date}</p>
            <p class="share-card-item"><strong>Time:</strong> ${formatTime12Hour(scene.time)}</p>
            <p class="share-card-item"><strong>Location:</strong> ${scene.type}. ${scene.location}</p>
            <p class="share-card-item"><strong>Cast:</strong> ${scene.cast || 'N/A'}</p>
            <p class="share-card-item"><strong>Contact:</strong> 📞 ${scene.contact || 'N/A'}</p>
            <div class="share-card-footer">
                Generated by FilmFolks Pro
            </div>
        </div>
    `;

    // 2. Use html2canvas to convert the populated template into an image
    try {
        const canvas = await html2canvas(template, { scale: 2 });
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const file = new File([blob], `scene_${scene.number}.png`, { type: 'image/png' });
        
        // 3. Use the Web Share API to share the generated image file
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: `Shooting Schedule - Scene ${scene.number}`,
                text: `Details for Scene ${scene.number}: ${scene.heading}`
            });
        } else {
            alert("Share API not supported. This feature works best on mobile. A new tab will open with the image for you to save.");
            const imgUrl = URL.createObjectURL(blob);
            window.open(imgUrl, '_blank');
        }
    } catch (error) {
        console.error('Sharing failed:', error);
        alert('Could not generate image for sharing.');
    }
}

// =================================================================
// --- UTILITY FUNCTIONS ---
// =================================================================

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
