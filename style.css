/* --- Global Styles --- */
:root {
    --primary-color: #3b82f6; /* A vibrant blue */
    --background-color: #111827; /* Darker background */
    --surface-color: #1f2937; /* Lighter gray for cards/tables */
    --text-color: #f3f4f6; /* Light gray text */
    --border-color: #374151;
    --success-color: #22c55e;
    --danger-color: #ef4444;
    --warning-color: #f59e0b;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    margin: 0;
    font-size: 16px;
}

/* --- Header Styles --- */
.main-header {
    background-color: var(--surface-color);
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--border-color);
    text-align: center;
}
.main-header .header-left, .main-header .header-right {
    flex: 1;
}
.main-header .header-left { text-align: left; }
.main-header .header-right { text-align: right; }
.main-header .header-center { flex: 3; }
.main-header h1 { margin: 0; }
.main-header p { margin: 5px 0 0; color: #9ca3af; }

.page-header {
    background-color: var(--surface-color);
    padding: 15px 30px;
    display: flex;
    align-items: center; /* Align items vertically in center */
    border-bottom: 2px solid var(--border-color);
}
.page-header .header-left { 
    display: flex; 
    align-items: center; 
    gap: 15px; 
    margin-right: auto; /* Push content to the right */
}
.page-header .header-right { 
    display: flex; 
    align-items: center; 
    gap: 15px; 
    margin-left: auto; /* Push content to the left */
}
.page-header h2 { margin: 0; }
.page-header .icon-btn { margin-right: 0; } /* Ensure hamburger is extreme left */


/* --- Homepage Styles --- */
.home-body { display: flex; flex-direction: column; min-height: 100vh; }
.home-container { text-align: center; margin: auto; padding: 20px; }
.home-container h2 { font-size: 2rem; }
.choice-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    margin-top: 20px;
}
.choice-card {
    background-color: var(--surface-color);
    padding: 40px;
    border-radius: 12px;
    text-decoration: none;
    color: var(--text-color);
    border: 1px solid var(--border-color);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.choice-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.4);
    border-color: var(--primary-color);
}
.choice-card h3 { margin: 15px 0 10px; font-size: 1.5rem; }
.choice-card p { color: #9ca3af; font-size: 0.9rem; line-height: 1.5; }

/* --- Currency Selector on Budget Page --- */
.currency-selector-wrapper select {
    background-color: var(--background-color);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    font-size: 0.9rem;
    font-weight: 600;
    padding: 5px 8px;
    border-radius: 6px;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
.currency-selector-wrapper select:focus {
    outline: none;
    border-color: var(--primary-color);
}

/* --- General Content Styles --- */
.container { max-width: 1400px; margin: 20px auto; padding: 0 20px; }
.section { background-color: var(--surface-color); padding: 25px; border-radius: 8px; border: 1px solid var(--border-color); }
.section-header h2 { font-size: 1.5rem; margin: 0; }

/* --- Form & Input Styling --- */
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px; }
input, select { width: 100%; padding: 10px; background-color: #374151; border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-color); font-size: 0.95rem; box-sizing: border-box; }
input::placeholder { color: #9ca3af; }

/* --- Buttons --- */
button, .btn-secondary { padding: 10px 20px; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; text-decoration: none; border: none; }
.btn-primary { background-color: var(--primary-color); color: white; }
.btn-danger { background-color: var(--danger-color); color: white; font-size: 0.8rem; padding: 5px 10px; }
.btn-secondary { background-color: #4b5563; color: white; }
.icon-btn { background: none; border: none; color: #9ca3af; font-size: 1.5rem; cursor: pointer; }
.icon-btn:hover { color: var(--text-color); }

/* --- Hamburger Menu Dropdown --- */
.dropdown-container {
    position: relative;
    display: inline-block;
}
.dropdown-content { display: none; position: absolute; background-color: #374151; min-width: 220px; box-shadow: 0 8px 16px rgba(0,0,0,0.5); z-index: 10; border-radius: 6px; overflow: hidden; margin-top: 10px; left: 0; }
.dropdown-content a { color: var(--text-color); padding: 12px 16px; text-decoration: none; display: flex; align-items: center; gap: 10px; }
.dropdown-content a:hover { background-color: var(--primary-color); }
.show { display: block; }

/* --- Budget Summary --- */
.budget-summary { margin-top: 25px; padding: 20px; background-color: var(--background-color); border-radius: 8px; text-align: right; }
.budget-summary h3 { margin: 0; font-size: 1.8rem; font-weight: 700; }
.budget-summary span { color: var(--success-color); }

/* --- Floating Label Styles for Date/Time Inputs --- */
.input-wrapper {
    position: relative;
}

.input-wrapper label {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    color: #9ca3af; /* Placeholder text color */
    pointer-events: none; /* Allows you to click through the label to the input */
    transition: all 0.2s ease-in-out;
    background-color: var(--surface-color); /* Matches input background */
    padding: 0 4px; /* Ensure no text is cut off */
    z-index: 1; /* Ensure label is above input when moved */
}

.input-wrapper input {
    position: relative;
    z-index: 2; /* Ensure input is on top for interaction */
    background-color: #374151; /* Explicitly set for date/time */
}

/* When the input is focused or contains a valid value, 
  move the label up and change its color.
*/
.input-wrapper .has-label:focus ~ label,
.input-wrapper .has-label:valid ~ label {
    top: -8px; /* Move it completely above the input */
    left: 8px;
    transform: translateY(0);
    font-size: 0.75rem; /* 12px */
    color: var(--primary-color);
}

/* Style for new date/time inputs */
input[type="date"], input[type="time"] {
    color-scheme: dark;
    -webkit-appearance: none;
}


/*
=========================================
--- NEW: Scene Card Styles ---
=========================================
*/
.scene-cards-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
}

.scene-card {
    background-color: var(--background-color); /* Slightly darker than form */
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 15px;
    display: flex;
    flex-wrap: wrap; /* Allow items to wrap on smaller screens */
    align-items: center;
    gap: 10px 20px; /* Vertical and horizontal gap */
    justify-content: space-between;
    transition: all 0.3s ease-in-out;
}

.scene-card-info {
    flex-grow: 1; /* Allows info to take up available space */
    display: flex;
    flex-wrap: wrap;
    gap: 5px 15px;
    align-items: center;
}

.scene-card-item {
    font-size: 0.95rem;
    color: var(--text-color);
    display: flex;
    align-items: center;
    gap: 5px;
}

.scene-card-item strong {
    color: var(--primary-color);
}

.scene-card-item i {
    color: #9ca3af; /* Icon color */
}

.scene-card-actions {
    display: flex;
    gap: 10px;
    align-items: center;
}

.scene-card-status {
    padding: 4px 10px;
    border-radius: 5px;
    font-size: 0.8rem;
    font-weight: 600;
}
.scene-card-status.pending { background-color: var(--warning-color); color: #111827; }
.scene-card-status.incomplete { background-color: var(--danger-color); }
.scene-card-status.done { background-color: var(--success-color); }

/* Share Button Specific */
.share-btn {
    background: none;
    border: none;
    color: #25D366; /* WhatsApp Green */
    font-size: 1.4rem;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1; /* Prevent extra space */
}
.share-btn:hover {
    color: #128C7E; /* Darker WhatsApp green on hover */
}


/* --- Mobile Responsiveness --- */
@media (max-width: 768px) {
    body { padding: 5px; font-size: 14px; }
    .home-container h2 { font-size: 1.5rem; }
    .choice-container { grid-template-columns: 1fr; gap: 15px; }
    .choice-card { padding: 20px; }
    .choice-card h3 { font-size: 1.2rem; }
    .main-header { padding: 15px; }
    .main-header h1 { font-size: 1.5rem; }
    .main-header p { font-size: 0.8rem; }

    .page-header { padding: 10px 15px; flex-wrap: wrap; justify-content: space-between; }
    .page-header .header-left, .page-header .header-right { 
        width: auto; /* Allow natural sizing */
        gap: 10px; 
    }
    .page-header .header-left { 
        order: 1; 
        margin-right: 0; /* No auto margin to push left */
    }
    .page-header h2 { 
        order: 3; /* Move title below buttons on small screens */
        width: 100%;
        text-align: center;
        margin-top: 10px;
    }
    .page-header .header-right { 
        order: 2; 
        margin-left: 0; /* No auto margin to push right */
    }
    .btn-secondary { padding: 8px 12px; font-size: 0.9rem; }

    /* Scene Card Mobile Adjustments */
    .scene-card {
        flex-direction: column; /* Stack items vertically */
        align-items: flex-start;
        padding: 10px;
        gap: 8px;
    }
    .scene-card-info {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        gap: 5px;
    }
    .scene-card-actions {
        width: 100%;
        justify-content: flex-end; /* Push action buttons to the right */
        gap: 8px;
        margin-top: 10px;
        padding-top: 8px;
        border-top: 1px dotted var(--border-color); /* Separator */
    }

    .form-grid { grid-template-columns: 1fr; }
    .budget-summary h3 { font-size: 1.2rem; }
}
