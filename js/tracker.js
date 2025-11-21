// Expense Tracker
class Expense {
    constructor(description, amount, category, date) {
    this.id = this.getDate(); 
    this.description = description;
    this.amount = this.parseAmount(amount);
    this.category = category;
    this.date = date;
    this.createdAt = new Date().toISOString();
  }

  //getDate
getDate() {
  return Date.now() + Math.random();
}

  // Validate Expense
  isValid() {
    return this.description && typeof this.amount === 'number' && !isNaN(this.amount) && this.amount >= 0 && this.category && this.date;
  }

  // Format Currency
  parseAmount(value) {
    const amount = parseFloat(value);
    // Check if valid number
    if (isNaN(amount)) {
        return 0;
    }
    // Ensure positive and round to 2 decimals
    return Math.max(0, Math.round(amount * 100) / 100);
}
}
class FileHandler {
  constructor() {
    this.supportedFormats = [
      "application/json",
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/webp",
      "image/jpg",
    ];
    this.OCR_API_KEY = 'K85150228188957';
  }

  // validate file
  isValidFile(file) {
    return this.supportedFormats.includes(file.type);
  }


  // Handle file upload
  async handleUpload(file) {
    try {
        // validate file
      if (this.isValidFile(file)) {

        // check and handle json file
        if (file.type === "application/json") {

            // read json
          return new Promise((resolve, reject) => {
            const jsonReader = new FileReader();
            jsonReader.onload = () => {
              try {
                const JsonData = JSON.parse(jsonReader.result);

                // process data
                this.processData(JsonData)
                resolve(JsonData);
                ui.alert('success', 'File uploaded successfully', 'success');
            } catch (err) {
                reject(err);
                ui.alert('danger', err.message, 'error');
              }
            };
            // handle error
            jsonReader.onerror = () => {
              reject(jsonReader.error);
            };

            // read and resolve
            jsonReader.readAsText(file);
          });

        }

        // handle pdf and image files
        if (file.type === `application/pdf` || file.type.startsWith(`image/`)) 
        {
          
          // convert to base64
          const base64 = await this.fileToBase64(file);
          const cleanBase64 = base64.split(',')[1];

          // send request to ocr Api
          const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            headers: {
            'apikey': this.OCR_API_KEY,
          },
            body: this.buildFormData(cleanBase64, file.type)
        });

          // handle response
          if (ocrData.IsErroredOnProcessing) {
            ui.alert('danger', ocrData.ErrorMessage, 'error');
          }

          const fullText = ocrData.ParsedResults[0].ParsedText;
          if (!fullText.trim()) {
          ui.alert('danger', 'No text found in the image', 'error');
      }

          // process data
          const rawExpense = this.extractExpenseFromText(fullText);
          this.processData(rawExpense);
        }
      }
    } catch (err) {
      console.error(err);
      ui.alert('danger', err.message, 'error');
    }
  }

  // Convert file to base64
    fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  buildFormData(base64, fileType) {
    const formData = new FormData();
    formData.append('base64Image', `data:${fileType};base64,${base64}`);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2');
    return formData;
  }

    // Format Expense data
    formatData(data) {
      return {
      description: data.description || '',
      amount: parseFloat(data.amount) || 0,
      category: data.category || '',
      date: data.date || new Date().toISOString(),
      };
    }

    //processData
    processData(data) {
    const expenses = Array.isArray(data) ? data : [data];
  
  expenses.forEach(expense => {
      const formatted = this.formatData(expense); 
      const expenseObj = new Expense(
        formatted.description,
        formatted.amount,
        formatted.category,
        formatted.date
      );

      // Formatted data
      if(expenseObj.isValid()) {
        expenseManager.expenses.unshift({
          id: expenseObj.id,
          description: expenseObj.description,
          amount: expenseObj.amount,
          category: expenseObj.category,
          date: expenseObj.date
        });
      } else {
        console.warn('Invalid expense skipped:', item);
        ui.alert('danger', 'Invalid data format', 'error');
      }
    });
    
    ui.displayUI();
    ui.alert('success', `${expenses.length} expense(s) added successfully!`, 'success');
  }
  
    extractExpenseFromText(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const lowerText = text.toLowerCase();

    let amount = 0;
    let date = new Date().toISOString().split('T')[0];
    let description = 'Expense';

    // Find largest amount
    const amountRegex = /₦?\s?([0-9,]+(\.[0-9]{1,2})?)/g;
    const amounts = [...text.matchAll(amountRegex)]
      .map(m => parseFloat(m[1].replace(/,/g, '')))
      .filter(n => n > 0);

    if (amounts.length > 0) {
      amount = Math.max(...amounts);
    }

    // Find date 
    const datePatterns = [
      /\b(\d{4}[-\/]\d{2}[-\/]\d{2})\b/,
      /\b(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})\b/,
      /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}/i
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        try {
          const parsed = new Date(match[0]);
          if (!isNaN(parsed)) {
            date = parsed.toISOString().split('T')[0];
            break;
          }
        } catch {}
      }
    }

    // Guess description from keywords
    const keywords = {
      food: ['restaurant', 'kfc', 'chicken', 'rice', 'food', 'lunch', 'dinner', 'shawarma', 'pizza'],
      transport: ['uber', 'bolt', 'taxi', 'fuel', 'petrol', 'bus', 'transport', 'danfo'],
      shopping: ['shoprite', 'market', 'store', 'mall', 'clothes', 'shoe'],
      utilities: ['airtime', 'data', 'electricity', 'nepa', 'dstv', 'gotv', 'internet'],
      entertainment: ['cinema', 'netflix', 'drink', 'bar', 'club'],
      health: ['pharmacy', 'drug', 'hospital', 'clinic']
    };

    let detectedCategory = 'Other';
    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => lowerText.includes(word))) {
        detectedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        break;
      }
    }

    // Fallback description: first non-empty line or "Receipt expense"
    description = (lines && lines[0] ? lines[0].slice(0, 50) : '') || 'Receipt expense';
    if (description.toLowerCase().includes('total') || description.length < 3) {
      description = lines.find(l => l.length > 10 && !l.match(/₦|total|amount/i)) || 'Expense';
    }

    return {
      description: description.trim(),
      amount: parseFloat(amount.toFixed(2)),
      category: detectedCategory,
      date
    };
  }
}


// Expense Manager
class ExpenseManager {
  constructor() {
    this.expenses = [];
  }
  totalExpenses() {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  totalNumberOfExpenses() {
    return this.expenses.length
  }

  averageExpense() {
    return this.expenses.length > 0 ? this.totalExpenses() / this.totalNumberOfExpenses() : 0;
  }

  // Top Category (occurs most)
  topCategory() {
  // Check BEFORE the loop, not inside it
  if (this.expenses.length === 0) {
    return '-';
  }

  const categoryCount = {};
  this.expenses.forEach((expense) => {
    if (categoryCount[expense.category]) {
      categoryCount[expense.category] += 1;            
    } else {
      categoryCount[expense.category] = 1;
    }
  });
  
  // Also check if categoryCount is empty
  const entries = Object.entries(categoryCount);
  if (entries.length === 0) {
    return '-';
  }
  
  return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
}
}


// UI
class UI {
  constructor(expenseManager) {
    this.expenseManager = expenseManager;
  }

  displayUI() {
    const totalExpense = document.querySelector('#totalExpenses');
    const transactionCount = document.querySelector('#transactionCount');
    const averageTransaction = document.querySelector('#avgTransaction')
    const expenseList = document.querySelector('#expensesList')
    const topCategory = document.querySelector('#topCategory')

    // output expense
    expenseList.innerHTML = '';

    //loop through the expenses
    expenseManager.expenses.forEach((expense) => {
        expenseList.innerHTML += `
                <div class="expense-item">
                    <div class="expense-date">${expense.date}</div>
                    <div class="expense-category">${expense.category}</div>
                    <div class="expense-description">${expense.description}</div>
                    <div class="expense-amount">${expense.amount}</div>
                </div>`
    });

    // display total expenses 
    totalExpense.textContent = `₦${this.expenseManager.totalExpenses().toFixed(2)}`

    // transaction count 
    transactionCount.textContent = `${this.expenseManager.totalNumberOfExpenses()}`

    // average transaction 
    averageTransaction.textContent = `₦${this.expenseManager.averageExpense()}`;

    // top category
    topCategory.textContent = ` ${this.expenseManager.topCategory()}`;

  }
  
  // Add expense to the manager
  addExpense() {
    const date = document.querySelector('#date').value;
    const category = document.querySelector('#category').value;
    const description = document.querySelector('#description').value;
    const amount = new Expense('', document.querySelector('#amount').value, '', '').parseAmount(document.querySelector('#amount').value);

    if (date && category && description && !isNaN(amount)) {
      const expense = {  
        id: Date.now() + Math.random(),
        date, 
        category, 
        description, 
        amount: Math.round(amount * 100) / 100 
      };
      this.expenseManager.expenses.unshift(expense);
      this.displayUI(); 
      this.clearExpenses();
    }
  }

  // clear expenses
  clearExpenses(){
    const date = document.querySelector('#date');
    const category = document.querySelector('#category');
    const description = document.querySelector('#description');
    const amount = document.querySelector('#amount');

    date.value ='';
    category.value = '';
    description.value ='';
    amount.value ='';
  }

  // Alert (className, message,  type)
  alert(className, message, type) {
    try{
    const alert = document.createElement('div');

    // set classname
    alert.className = `alert ${className}`;

    // set message
    alert.textContent = message;

    // set type
    alert.type = type;

    if(type === 'success') {
      alert.classList.add('success');
    } else {
      alert.classList.add('error');
    }

    //get the container element
    const container = document.querySelector('.container');
    const main = document.querySelector('.main-content')

    
    container.insertBefore(alert, main)
    setTimeout(() => {alert.remove();}, 2000);
  } catch (err) {
    console.error(err);
  }
}
}

  // Expense manager instance
  const expenseManager = new ExpenseManager()
  const ui = new UI(expenseManager)

// Storage
class Store {}

// Event Listeners
// on load
document.addEventListener('DOMContentLoaded', () => {
  ui.displayUI();
  ui.alert('success', 'Dom loaded successfully', 'success');
})

// add expense
document.querySelector('#addExpense').addEventListener('click', () => {
  ui.addExpense();
  ui.alert('success', 'Expense added successfully', 'success');
})

// clear expenses
document.querySelector('#clear').addEventListener('click', () => {
  ui.clearExpenses();
  ui.alert('success', 'Expenses cleared successfully', 'success');
})

// file upload 
document.querySelector('#browseBtn').addEventListener('click', () => {
  document.querySelector('#fileInput').click();
});

// Handle file selection separately
document.querySelector('#fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    // Display file name
    document.querySelector('#fileNameDisplay').textContent = `Selected: ${file.name}`;
    
    // Upload file
    const fileHandler = new FileHandler();
    fileHandler.handleUpload(file);
  }
});

// file upload drag and drop
const uploadArea = document.querySelector('#uploadArea');

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('drag-over');
});

// Remove highlight when dragging leaves
uploadArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  if (e.target === uploadArea) {
    uploadArea.classList.remove('drag-over');
  }
});

// Handle the actual file drop
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  
  // Get the dropped file
  const file = e.dataTransfer.files[0];
  
  if (file) {
    // Display file name
    document.querySelector('#fileNameDisplay').textContent = `Selected: ${file.name}`;
    
    // Upload the file
    const fileHandler = new FileHandler();
    fileHandler.handleUpload(file);
  } else {
    ui.alert('danger', 'No file selected', 'error');
  }
});
