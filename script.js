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
        indexHamburgerBtn.addEventListener('click', () => {
            indexDropdownMenu.classList.toggle('show');
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
        hamburgerBtn.addEventListener('click', () => {
            dropdownMenu.classList.toggle('show');
        });
    }

    // Placeholder for export functions
    const savePdfBtn = document.getElementById('save-pdf-btn');
    const exportSheetsBtn = document.getElementById('export-sheets-btn');
    if(savePdfBtn) savePdfBtn.addEventListener('click', () => alert('Save as PDF functionality would be implemented here.'));
    if(exportSheetsBtn) exportSheetsBtn.addEventListener('click', () => alert('Export to Google Sheets requires API integration.'));
    
    // --- SCHEDULING PAGE LOGIC ---
    if (document.getElementById('schedule-form')) {
        const scheduleForm = document.getElementById('schedule-form');
        const scheduleTableBody = document.getElementById('schedule-table-body');

        // Load existing data from localStorage when the page opens
        loadScheduleData();

        scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const sceneData = {
                number: document.getElementById('scene-number').value,
                description: document.getElementById('scene-description').value,
                type: document.getElementById('scene-type').value,
                location: document.getElementById('scene-location').value,
                pages: parseFloat(document.getElementById('scene-pages').value).toFixed(1)
            };
            
            addSceneToTable(sceneData);
            saveScheduleData(); // Save after adding a new scene
            scheduleForm.reset();
        });
    }

    // --- BUDGETING PAGE LOGIC ---
    if (document.getElementById('budget-form')) {
        const budgetForm = document.getElementById('budget-form');
        const currencySelect = document.getElementById('currency-select');
        
        // Load existing data from localStorage when the page opens
        loadBudgetData();
        
        // Retrieve currency from localStorage or default to USD
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
            saveBudgetData(); // Save after adding a new item
            budgetForm.reset();
        });
    }
});

// =================================================================
// --- DATA PERSISTENCE & HANDLING FUNCTIONS ---
// =================================================================

// --- SCHEDULE DATA FUNCTIONS ---
function addSceneToTable(sceneData) {
    const scheduleTableBody = document.getElementById('schedule-table-body');
    const newRow = scheduleTableBody.insertRow();
    newRow.innerHTML = `
        <td data-label="Scene">${sceneData.number}</td>
        <td data-label="Description">${sceneData.description}</td>
        <td data-label="Type">${sceneData.type}</td>
        <td data-label="Location">${sceneData.location}</td>
        <td data-label="Pages">${sceneData.pages}</td>
        <td data-label="Action"><button class="btn-danger" onclick="deleteRow(this, 'schedule')">Delete</button></td>
    `;
}

function saveScheduleData() {
    const scheduleTableBody = document.getElementById('schedule-table-body');
    const rows = scheduleTableBody.querySelectorAll('tr');
    const scheduleData = [];
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const scene = {
            number: cells[0].textContent,
            description: cells[1].textContent,
            type: cells[2].textContent,
            location: cells[3].textContent,
            pages: cells[4].textContent,
        };
        scheduleData.push(scene);
    });
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
}

function loadScheduleData() {
    const scheduleData = JSON.parse(localStorage.getItem('scheduleData')) || [];
    scheduleData.forEach(scene => addSceneToTable(scene));
}

// --- BUDGET DATA FUNCTIONS ---
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
    const budgetData = JSON.parse(localStorage.getItem('budgetData')) || [];
    budgetData.forEach(item => addBudgetItemToTable(item));
}

// --- GLOBAL HELPER FUNCTIONS ---
function deleteRow(button, type) {
    button.closest('tr').remove();
    if (type === 'schedule') {
        saveScheduleData();
    } else if (type === 'budget') {
        saveBudgetData();
    }
}

// --- PROJECT FILE SAVE/LOAD FUNCTIONS ---
function saveProjectFile() {
    const projectData = {
        projectName: "My Film Project",
        saveDate: new Date().toISOString(),
        version: "1.0",
        scheduleData: JSON.parse(localStorage.getItem('scheduleData')) || [],
        budgetData: JSON.parse(localStorage.getItem('budgetData')) || [],
        // Add other data sections here as you build them
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
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const projectData = JSON.parse(e.target.result);
            // Save loaded data into localStorage
            localStorage.setItem('scheduleData', JSON.stringify(projectData.scheduleData || []));
            localStorage.setItem('budgetData', JSON.stringify(projectData.budgetData || []));
            // Add other data sections here
            alert('Project loaded successfully! Navigate to the schedule or budget pages to see the data.');
        } catch (error) {
            alert('Error: Could not read the project file. Please ensure it is a valid .filmproj file.');
        }
    };
    reader.readAsText(file);
    // Hide the dropdown menu after selecting a file
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


 // --- SCHEDULING PAGE LOGIC (UPDATED) ---
    if (document.getElementById('schedule-form')) {
        const scheduleForm = document.getElementById('schedule-form');

        loadScheduleData();

        scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Gather all data from the new form fields
            const sceneData = {
                number: document.getElementById('scene-number').value,
                heading: document.getElementById('scene-heading').value,
                type: document.getElementById('scene-type').value,
                location: document.getElementById('scene-location').value,
                pages: parseFloat(document.getElementById('scene-pages').value).toFixed(1),
                date: document.getElementById('scene-date').value,
                time: document.getElementById('scene-time').value,
                duration: document.getElementById('scene-duration').value,
                status: document.getElementById('scene-status').value,
                cast: document.getElementById('scene-cast').value,
                equipment: document.getElementById('scene-equipment').value
            };
            
            addSceneToTable(sceneData);
            saveScheduleData(); // Save after adding a new scene
            scheduleForm.reset();
        });
    }

    // ... (keep the rest of your script, but replace the schedule functions below)
});


// =================================================================
// --- DATA PERSISTENCE & HANDLING FUNCTIONS (REPLACE THE OLD SCHEDULE FUNCTIONS) ---
// =================================================================

// --- SCHEDULE DATA FUNCTIONS ---
function addSceneToTable(sceneData) {
    const scheduleTableBody = document.getElementById('schedule-table-body');
    const newRow = scheduleTableBody.insertRow();
    // Rebuild the table row to include all new fields and data-labels for mobile
    newRow.innerHTML = `
        <td data-label="Scene">${sceneData.number}</td>
        <td data-label="Scene Heading">${sceneData.heading}</td>
        <td data-label="Date">${sceneData.date}</td>
        <td data-label="Time">${sceneData.time}</td>
        <td data-label="Duration">${sceneData.duration}</td>
        <td data-label="Cast">${sceneData.cast}</td>
        <td data-label="Equipment">${sceneData.equipment}</td>
        <td data-label="Status">${sceneData.status}</td>
        <td data-label="Action"><button class="btn-danger" onclick="deleteRow(this, 'schedule')">Delete</button></td>
    `;
}

function saveScheduleData() {
    const scheduleTableBody = document.getElementById('schedule-table-body');
    if (!scheduleTableBody) return;
    const rows = scheduleTableBody.querySelectorAll('tr');
    const scheduleData = [];
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        // Rebuild the scene object to save all new fields
        const scene = {
            number: cells[0].textContent,
            heading: cells[1].textContent,
            date: cells[2].textContent,
            time: cells[3].textContent,
            duration: cells[4].textContent,
            cast: cells[5].textContent,
            equipment: cells[6].textContent,
            status: cells[7].textContent
        };
        scheduleData.push(scene);
    });
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
}

function loadScheduleData() {
    if (!document.getElementById('schedule-table-body')) return;
    const scheduleData = JSON.parse(localStorage.getItem('scheduleData')) || [];
    scheduleData.forEach(scene => addSceneToTable(scene));
}

