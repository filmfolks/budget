document.addEventListener('DOMContentLoaded', () => {
    
    // --- Global & Shared Elements ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    
    // Placeholder for new index page hamburger button
    const indexHamburgerBtn = document.getElementById('hamburger-btn-index');
    if (indexHamburgerBtn) {
        indexHamburgerBtn.addEventListener('click', () => {
            alert('Navigation menu would open here.');
        });
    }

    // --- Shared Functions ---
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

    // --- REMOVED SETTINGS MODAL LOGIC ---
    
    // --- Page Specific Logic ---
    
    // SCHEDULING PAGE LOGIC (No changes here)
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
        const currencySelect = document.getElementById('currency-select');
        
        // Retrieve currency from localStorage or default to USD
        let currentCurrency = localStorage.getItem('userCurrency') || 'USD';
        
        // *** NEW: Set dropdown to saved currency on page load ***
        currencySelect.value = currentCurrency;
        
        // *** NEW: Event listener for the currency dropdown ***
        currencySelect.addEventListener('change', () => {
            currentCurrency = currencySelect.value;
            localStorage.setItem('userCurrency', currentCurrency);
            // Update placeholder and totals when currency changes
            document.getElementById('item-cost').placeholder = `Cost (${getCurrencySymbol(currentCurrency)})`;
            updateTotalBudget();
        });

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
        
        window.formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currentCurrency,
            }).format(amount);
        };
    
        window.getCurrencySymbol = (currencyCode) => {
            const symbols = { 'USD': '$', 'EUR': '€', 'INR': '₹', 'GBP': '£' };
            return symbols[currencyCode] || '$';
        }
        
        updateTotalBudget(); // Initial calculation
    }
    
    // --- Global Functions needed on multiple pages ---
    window.deleteRow = (button) => {
        const row = button.closest('tr');
        row.remove();
        if (row.querySelector('[data-cost]')) {
            updateTotalBudget();
        }
    };
});
