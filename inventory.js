
// Global state
let currentSheetUrl = '';
let currentSheetName = '';
let tableHeaders = [];
let tableData = [];
let inventoryRows = [];

// DOM References
const formContainer = document.getElementById('form-container');
const dataTableContainer = document.getElementById('data-table-container');
const inventoryForm = document.getElementById('inventory-form');
const sheetSelect = document.getElementById('sheet-select');
const addDataBtn = document.getElementById('add-data-btn');
const cancelBtn = document.getElementById('cancel-btn');
const addRowBtn = document.getElementById('add-row-btn');
const goHomeBtn = document.getElementById('go-home-btn');
const dateInput = document.getElementById('date-input');
const formRows = document.getElementById('form-rows');

// Initialize the application
function init() {
  // Set up event listeners
  sheetSelect.addEventListener('change', handleSheetChange);
  addDataBtn.addEventListener('click', showForm);
  cancelBtn.addEventListener('click', hideForm);
  addRowBtn.addEventListener('click', addRow);
  goHomeBtn.addEventListener('click', () => window.location.href = 'https://abdermb98.github.io/home/');
  inventoryForm.addEventListener('submit', handleFormSubmit);
  
  // Default sheet on first load
  if (sheetSelect.value) {
    handleSheetChange({ target: { value: sheetSelect.value } });
  }
  
  // Initialize the inventory rows with one default row
  resetInventoryRows();
}

// Handle sheet selection change
async function handleSheetChange(event) {
  currentSheetUrl = event.target.value;
  currentSheetName = sheetSelect.options[sheetSelect.selectedIndex].text;
  await loadTableData(currentSheetUrl);
}

// Load table data from Google Sheet
async function loadTableData(url) {
  try {
    const response = await fetch(`${url}?getData=true`);
    const data = await response.json();
    
    if (data.status === 'error') {
      showToast(data.message, 'error');
      return;
    }
    
    tableHeaders = data.data[0];
    tableData = data.data.slice(1);
    
    renderDataTable();
  } catch (error) {
    console.error('Failed to load data:', error);
    showToast('Failed to load data from Google Sheet', 'error');
  }
}

// Show the form
function showForm() {
  formContainer.classList.remove('hidden');
  resetInventoryRows();
}

// Hide the form
function hideForm() {
  formContainer.classList.add('hidden');
}

// Initialize inventory rows with default row
function resetInventoryRows() {
  inventoryRows = [{
    parcelle: "P40 CEBOLLINO",
    type: "BRUT",
    brut: "",
    fini: "",
    superficie: "",
    coupe: "COUPE 1",
    semaine: 0
  }];
  
  renderFormRows();
}

// Add a new row to the form
function addRow() {
  // Clone the last row for convenience
  const lastRow = inventoryRows[inventoryRows.length - 1];
  
  inventoryRows.push({
    parcelle: lastRow.parcelle,
    type: lastRow.type,
    brut: "",
    fini: "",
    superficie: "",
    coupe: lastRow.coupe,
    semaine: lastRow.semaine
  });
  
  renderFormRows();
}

// Remove a row from the form
function removeRow(index) {
  if (inventoryRows.length === 1) {
    return; // Don't remove if it's the last row
  }
  
  inventoryRows.splice(index, 1);
  renderFormRows();
}

// Handle form field changes
function handleRowChange(index, field, value) {
  if (field === "type" && value === "BRUT") {
    // When type is BRUT, reset the fini field
    inventoryRows[index] = {
      ...inventoryRows[index],
      [field]: value,
      fini: 0
    };
  } else {
    inventoryRows[index] = {
      ...inventoryRows[index],
      [field]: value
    };
  }
  
  // If type is BRUT, disable the fini field
  if (field === "type") {
    const finiInput = document.getElementById(`fini-${index}`);
    if (finiInput) {
      finiInput.disabled = value === "BRUT";
      if (value === "BRUT") {
        finiInput.value = "0";
      }
    }
  }
  
  // Update week number when date changes
  if (field === 'date') {
    const date = new Date(value);
    const weekNum = getWeekNumber(date);
    
    inventoryRows.forEach((row, i) => {
      inventoryRows[i].semaine = weekNum;
    });
  }
}

// Render form rows
function renderFormRows() {
  formRows.innerHTML = '';
  
  inventoryRows.forEach((row, index) => {
    const rowElement = document.createElement('div');
    rowElement.className = 'form-row';
    
    rowElement.innerHTML = `
      <div>
        <select 
          id="parcelle-${index}" 
          class="select"
          required
        >
          <option value="P40 CEBOLLINO">P40 CEBOLLINO</option>
          <option value="P41 CEBOLLINO">P41 CEBOLLINO</option>
          <option value="P42 CEBOLLINO">P42 CEBOLLINO</option>
          <option value="P43 CEBOLLINO">P43 CEBOLLINO</option>
          <option value="P44 CEBOLLINO">P44 CEBOLLINO</option>
          <option value="P45 HABANERO">P45 HABANERO</option>
          <option value="P46 CEBOLLINO">P46 CEBOLLINO</option>
          <option value="P47 CEBOLLINO">P47 CEBOLLINO</option>
          <option value="P48 ESTRAGON">P48 ESTRAGON</option>
          <option value="P49 CEBOLLINO">P49 CEBOLLINO</option>
          <option value="P50 CEBOLLINO">P50 CEBOLLINO</option>
          <option value="P51 CEBOLLINO">P51 CEBOLLINO</option>
          <option value="P52 ESTRAGON">P52 ESTRAGON</option>
          <option value="P53 ESTRAGON">P53 ESTRAGON</option>
          <option value="P54 CEBOLLINO">P54 CEBOLLINO</option>
          <option value="P55 CEBOLLINO">P55 CEBOLLINO</option>
          <option value="P56 CEBOLLINO">P56 CEBOLLINO</option>
          <option value="P57 CEBOLLINO">P57 CEBOLLINO</option>
          <option value="P58 CEBOLLINO">P58 CEBOLLINO</option>
          <option value="P59 CEBOLLINO">P59 CEBOLLINO</option>
          <option value="P60 CEBOLLINO">P60 CEBOLLINO</option>
          <option value="P61 CEBOLLINO">P61 CEBOLLINO</option>
          <option value="P62 CEBOLLINO">P62 CEBOLLINO</option>
          <option value="P63 CEBOLLINO">P63 CEBOLLINO</option>
        </select>
      </div>
      
      <div>
        <select 
          id="type-${index}" 
          class="select"
          required
        >
          <option value="BRUT">BRUT</option>
          <option value="FINI (MONOJO)">FINI (MONOJO)</option>
          <option value="FINI (GRAMMAGE)">FINI (GRAMMAGE)</option>
        </select>
      </div>
      
      <div>
        <input 
          type="number" 
          id="brut-${index}" 
          class="input" 
          placeholder="TOTAL BRUT" 
          required
        />
      </div>
      
      <div>
        <input 
          type="number" 
          id="fini-${index}" 
          class="input" 
          placeholder="TOTAL FINI" 
          ${row.type === "BRUT" ? 'disabled' : ''}
        />
      </div>
      
      <div>
        <input 
          type="number" 
          id="superficie-${index}" 
          class="input" 
          placeholder="SUPERFICIE" 
          required
        />
      </div>
      
      <div>
        <select 
          id="coupe-${index}" 
          class="select"
          required
        >
          <option value="COUPE 1">COUPE 1</option>
          <option value="COUPE 2">COUPE 2</option>
          <option value="COUPE 3">COUPE 3</option>
          <option value="COUPE 4">COUPE 4</option>
          <option value="COUPE 5">COUPE 5</option>
          <option value="COUPE 6">COUPE 6</option>
          <option value="COUPE 7">COUPE 7</option>
        </select>
      </div>
      
      <div>
        <button 
          type="button" 
          class="remove-row-btn" 
          onclick="removeRow(${index})"
        >
          ✕
        </button>
      </div>
    `;
    
    formRows.appendChild(rowElement);
    
    // Set values for the row
    document.getElementById(`parcelle-${index}`).value = row.parcelle;
    document.getElementById(`type-${index}`).value = row.type;
    document.getElementById(`brut-${index}`).value = row.brut;
    document.getElementById(`fini-${index}`).value = row.fini;
    document.getElementById(`superficie-${index}`).value = row.superficie;
    document.getElementById(`coupe-${index}`).value = row.coupe;
    
    // Add event listeners
    document.getElementById(`parcelle-${index}`).addEventListener('change', (e) => {
      handleRowChange(index, 'parcelle', e.target.value);
    });
    
    document.getElementById(`type-${index}`).addEventListener('change', (e) => {
      handleRowChange(index, 'type', e.target.value);
    });
    
    document.getElementById(`brut-${index}`).addEventListener('change', (e) => {
      handleRowChange(index, 'brut', e.target.value ? parseFloat(e.target.value) : '');
    });
    
    document.getElementById(`fini-${index}`).addEventListener('change', (e) => {
      handleRowChange(index, 'fini', e.target.value ? parseFloat(e.target.value) : '');
    });
    
    document.getElementById(`superficie-${index}`).addEventListener('change', (e) => {
      handleRowChange(index, 'superficie', e.target.value ? parseFloat(e.target.value) : '');
    });
    
    document.getElementById(`coupe-${index}`).addEventListener('change', (e) => {
      handleRowChange(index, 'coupe', e.target.value);
    });
  });
}

// Handle date change
dateInput.addEventListener('change', (e) => {
  const date = new Date(e.target.value);
  if (!isNaN(date.getTime())) {
    const weekNum = getWeekNumber(date);
    
    // Update all rows
    inventoryRows.forEach((row, index) => {
      inventoryRows[index].semaine = weekNum;
    });
  }
});

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const date = dateInput.value;
  
  if (!date) {
    showToast('Veuillez sélectionner une date', 'error');
    return;
  }
  
  if (!currentSheetUrl) {
    showToast('Veuillez sélectionner une feuille Google', 'error');
    return;
  }
  
  // Validate all rows
  const invalidRow = inventoryRows.findIndex(row => 
    row.brut === "" || row.superficie === ""
  );
  
  if (invalidRow !== -1) {
    showToast(`Veuillez remplir tous les champs obligatoires à la ligne ${invalidRow + 1}`, 'error');
    return;
  }
  
  // Submit all rows
  let allSuccess = true;
  let submittedCount = 0;
  
  for (const row of inventoryRows) {
    // Calculate derived values
    const brutVal = Number(row.brut);
    const finiVal = row.type === "BRUT" ? 0 : Number(row.fini);
    const superficieVal = Number(row.superficie);
    
    const rBrut = (brutVal / superficieVal).toFixed(3);
    const rFini = row.type !== "BRUT" ? (finiVal / superficieVal).toFixed(3) : "0";
    const ecart = row.type !== "BRUT" ? (((1 - (finiVal / brutVal)) * 100).toFixed(0)) + "%" : "0%";
    
    const entryData = {
      date,
      parcelle: row.parcelle,
      type: row.type,
      brut: brutVal,
      fini: finiVal,
      superficie: superficieVal,
      coupe: row.coupe,
      semaine: row.semaine,
      rBrut,
      rFini,
      ecart
    };
    
    // Send to Google Sheet
    try {
      const success = await submitEntryToSheet(currentSheetUrl, entryData);
      
      if (success) {
        // Send Telegram notification
        await sendTelegramNotification({
          date,
          parcelle: row.parcelle,
          type: row.type,
          superficie: superficieVal,
          brut: brutVal,
          fini: finiVal,
          rBrut,
          rFini,
          ecart
        });
        
        submittedCount++;
      } else {
        allSuccess = false;
        break;
      }
    } catch (error) {
      console.error('Error submitting entry:', error);
      allSuccess = false;
      break;
    }
  }
  
  if (allSuccess) {
    showToast(`${submittedCount} entrées ajoutées avec succès`, 'success');
    hideForm();
    loadTableData(currentSheetUrl);
  } else {
    showToast("Erreur lors de l'ajout des données", 'error');
  }
}

// Submit entry to Google Sheet
async function submitEntryToSheet(sheetUrl, entry) {
  try {
    const data = {
      date: entry.date,
      stockInitial: entry.parcelle,
      entree: entry.type,
      sortie: entry.brut.toString(),
      stockFinal: entry.fini.toString(),
      observation: entry.superficie.toString(),
      coupre: entry.coupe,
      weeknumber: entry.semaine.toString()
    };
    
    const response = await fetch(sheetUrl, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    await response.json();
    return true;
  } catch (error) {
    console.error("Error submitting data:", error);
    return false;
  }
}

// Send Telegram notification
async function sendTelegramNotification(data) {
  const token = "7914915084:AAFy5X26pPqYwDJU84jgBWWRt_7PqgPBvQg";
  const chatId = "-1002408201424";

  const message1 =
    `📅 *Date* : ${data.date}\n` +
    `🌱 *Parcelle* : ${data.parcelle}\n` +
    `📦 *Type* : ${data.type}\n` +
    `🌾 *Superficie* : ${data.superficie} m²\n` +
    `⚖️ *Brut* : ${data.brut} kg\n` +
    `📊 *R. Brut* : ${data.rBrut} kg/m²\n`;

  const message2 =
    message1 +
    `✅ *Fini* : ${data.fini} kg\n` +
    `📊 *R. Fini* : ${data.rFini} kg/m²\n` +
    `📉 *Écart* : ${data.ecart}`;

  const finalMessage = data.type === "BRUT" ? message1 : message2;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: finalMessage,
        parse_mode: "Markdown"
      })
    });

    return response.ok;
  } catch (error) {
    console.error("Telegram Error:", error);
    return false;
  }
}

// Render data table
function renderDataTable() {
  if (!tableHeaders.length || !tableData.length) {
    dataTableContainer.innerHTML = '<p>No data available</p>';
    return;
  }
  
  // Calculate sums for the data
  let finiSum = 0;
  let brutSum = 0;
  let superficieSum = 0;
  
  tableData.forEach(row => {
    finiSum += parseFloat(row[4]) || 0;
    brutSum += parseFloat(row[3]) || 0;
    superficieSum += parseFloat(row[5]) || 0;
  });
  
  const ecartPercentage = brutSum > 0 ? ((brutSum - finiSum) * 100 / brutSum) : 0;
  
  // Create HTML content
  let html = `
    <h2 class="table-title">: ${currentSheetName}</h2>
    
    <div class="stats-container">
      <div class="stats-grid">
        <div>T.FINI: <span>${finiSum.toFixed(0)}</span></div>
        <div>T.BRUT: <span>${brutSum.toFixed(0)}</span></div>
        <div>ECART: <span>${ecartPercentage.toFixed(0)}%</span></div>
        <div>SUP: <span>${superficieSum.toFixed(0)}M²</span></div>
      </div>
    </div>
    
    <div style="overflow-x: auto;">
      <table>
        <thead>
          <tr>
  `;
  
  // Add table headers with search inputs
  tableHeaders.forEach(header => {
    html += `
      <th>
        <div>${header}</div>
        <input type="search" placeholder="Search..." class="header-search" data-column="${tableHeaders.indexOf(header)}">
      </th>
    `;
  });
  
  html += `
          </tr>
        </thead>
        <tbody id="table-body">
  `;
  
  // Add table data
  tableData.forEach(row => {
    html += '<tr>';
    row.forEach((cell, cellIndex) => {
      html += `<td>${cellIndex === 0 ? formatDate(cell) : cell}</td>`;
    });
    html += '</tr>';
  });
  
  html += `
        </tbody>
      </table>
    </div>
  `;
  
  dataTableContainer.innerHTML = html;
  
  // Add event listeners to search inputs
  const searchInputs = document.querySelectorAll('.header-search');
  searchInputs.forEach(input => {
    input.addEventListener('input', filterTable);
  });
}

// Filter table data
function filterTable() {
  const searchInputs = document.querySelectorAll('.header-search');
  const filters = {};
  
  // Get all filter values
  searchInputs.forEach(input => {
    const column = parseInt(input.dataset.column);
    const value = input.value.toLowerCase();
    
    if (value) {
      filters[column] = value;
    }
  });
  
  // Get table body
  const tableBody = document.getElementById('table-body');
  
  // Clear table body
  tableBody.innerHTML = '';
  
  // Filter data and calculate new sums
  let finiSum = 0;
  let brutSum = 0;
  let superficieSum = 0;
  let filteredRows = 0;
  
  tableData.forEach(row => {
    let include = true;
    
    // Check if row matches all filters
    for (const [column, term] of Object.entries(filters)) {
      const cellText = String(row[column]).toLowerCase();
      if (!cellText.includes(term)) {
        include = false;
        break;
      }
    }
    
    if (include) {
      // Add row to table
      const tr = document.createElement('tr');
      
      row.forEach((cell, cellIndex) => {
        const td = document.createElement('td');
        td.textContent = cellIndex === 0 ? formatDate(cell) : cell;
        tr.appendChild(td);
      });
      
      tableBody.appendChild(tr);
      
      // Update sums
      finiSum += parseFloat(row[4]) || 0;
      brutSum += parseFloat(row[3]) || 0;
      superficieSum += parseFloat(row[5]) || 0;
      filteredRows++;
    }
  });
  
  // Update stats
  const ecartPercentage = brutSum > 0 ? ((brutSum - finiSum) * 100 / brutSum) : 0;
  
  const statsContainer = document.querySelector('.stats-grid');
  if (statsContainer) {
    statsContainer.innerHTML = `
      <div>T.FINI: <span>${finiSum.toFixed(0)}</span></div>
      <div>T.BRUT: <span>${brutSum.toFixed(0)}</span></div>
      <div>ECART: <span>${ecartPercentage.toFixed(0)}%</span></div>
      <div>SUP: <span>${superficieSum.toFixed(0)}M²</span></div>
    `;
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);