document.addEventListener('DOMContentLoaded', () => {
    
    // --- Global & Shared Elements ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const currencySelect = document.getElementById('currency-select');
    
    // Retrieve currency from localStorage or default to USD
    let currentCurrency = localStorage.getItem('userCurrency') || 'USD';
    
    // --- Shared Functions ---

    // Hamburger Menu Logic
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


    // Settings Modal Logic
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => settingsModal.style.display = 'block');
    }
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => settingsModal.style.display = 'none');
    }
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            localStorage.setItem('userCurrency', currencySelect.value);
            currentCurrency = currencySelect.value;
            alert('Settings saved!');
            settingsModal.style.display = 'none';
            // If on budget page, we need to re-render the costs
            if (document.getElementById('budget-table-body')) {
                updateTotalBudget();
            }
        });
    }
    
    // Close modal if clicking outside of it
    window.onclick = (event) => {
        if (event.target == settingsModal) {
            settingsModal.style.display = "none";
        }
    };


    // --- Page Specific Logic ---
    
    // SCHEDULING PAGE LOGIC
    if (document.getElementById('schedule-form')) {
        const scheduleForm = document.getElementById('schedule-form');
        const scheduleTableBody = document.getElementById('schedule-table-body');

        scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const sceneNumber = document.getElementById('scene-number').value;
            const description = document.getElementById('scene-description').value;
            const type = document.getElementById('scene-type').value;
            const location = document.getElementById('scene-location').value;
            const pages = parseFloat(document.getElementById('scene-pages').value).toFixed(1);

            const newRow = scheduleTableBody.insertRow();
            // *** UPDATED: Added data-label attributes for mobile view ***
            newRow.innerHTML = `
                <td data-label="Scene">${sceneNumber}</td>
                <td data-label="Description">${description}</td>
                <td data-label="Type">${type}</td>
                <td data-label="Location">${location}</td>
                <td data-label="Pages">${pages}</td>
                <td data-label="Action"><button class="btn-danger" onclick="deleteRow(this)">Delete</button></td>
            `;
            scheduleForm.reset();
        });
    }

    // BUDGETING PAGE LOGIC
    if (document.getElementById('budget-form')) {
        const budgetForm = document.getElementById('budget-form');
        const budgetTableBody = document.getElementById('budget-table-body');
        const totalBudgetEl = document.getElementById('total-budget');
        
        // On page load, set the correct currency in the placeholder
        document.getElementById('item-cost').placeholder = `Cost (${getCurrencySymbol(currentCurrency)})`;
        
        budgetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const description = document.getElementById('item-description').value;
            const category = document.getElementById('item-category').value;
            const cost = parseFloat(document.getElementById('item-cost').value);

            if (isNaN(cost)) {
                alert('Please enter a valid cost.');
                return;
            }

            const newRow = budgetTableBody.insertRow();
            // *** UPDATED: Added data-label attributes for mobile view ***
            newRow.innerHTML = `
                <td data-label="Description">${description}</td>
                <td data-label="Category">${category}</td>
                <td class="align-right" data-label="Cost" data-cost="${cost}">${formatCurrency(cost)}</td>
                <td data-label="Action"><button class="btn-danger" onclick="deleteRow(this)">Delete</button></td>
            `;
            budgetForm.reset();
            updateTotalBudget();
        });
        
        window.updateTotalBudget = () => {
            const costCells = budgetTableBody.querySelectorAll('[data-cost]');
            let total = 0;
            costCells.forEach(cell => {
                const cost = parseFloat(cell.dataset.cost);
                total += cost;
                cell.textContent = formatCurrency(cost); // Re-format existing cells with current currency
            });
            totalBudgetEl.textContent = formatCurrency(total);
        };
        
        updateTotalBudget(); // Initial calculation
    }
    
    // --- Global Functions needed on multiple pages ---
    
    window.deleteRow = (button) => {
        const row = button.closest('tr');
        row.remove();
        // If it's a budget row, update the total
        if (row.querySelector('[data-cost]')) {
            updateTotalBudget();
        }
    };
    
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currentCurrency,
        }).format(amount);
    };
    
    const getCurrencySymbol = (currencyCode) => {
        const symbols = { 'USD': '$', 'EUR': '€', 'INR': '₹', 'GBP': '£' };
        return symbols[currencyCode] || '$';
    }
});
