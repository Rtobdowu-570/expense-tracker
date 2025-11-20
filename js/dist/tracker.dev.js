"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Expense Tracker
var Expense =
/*#__PURE__*/
function () {
  function Expense(description, amount, category, date) {
    _classCallCheck(this, Expense);

    this.id = this.getDate();
    this.description = description;
    this.amount = this.parseAmount(amount);
    this.category = category;
    this.date = date;
    this.createdAt = new Date().toISOString();
  } //getDate


  _createClass(Expense, [{
    key: "getDate",
    value: function getDate() {
      return Date.now() + Math.random();
    } // Validate Expense

  }, {
    key: "isValid",
    value: function isValid() {
      return this.description && typeof this.amount === 'number' && !isNaN(this.amount) && this.amount >= 0 && this.category && this.date;
    } // Format Currency

  }, {
    key: "parseAmount",
    value: function parseAmount(value) {
      var amount = parseFloat(value); // Check if valid number

      if (isNaN(amount)) {
        return 0;
      } // Ensure positive and round to 2 decimals


      return Math.max(0, Math.round(amount * 100) / 100);
    }
  }]);

  return Expense;
}();

var FileHandler =
/*#__PURE__*/
function () {
  function FileHandler() {
    _classCallCheck(this, FileHandler);

    this.supportedFormats = ["application/json", "application/pdf", "image/png", "image/jpeg", "image/gif", "image/webp", "image/jpg"];
  } // validate file


  _createClass(FileHandler, [{
    key: "isValidFile",
    value: function isValidFile(file) {
      return this.supportedFormats.includes(file.type);
    } // Handle file upload

  }, {
    key: "handleUpload",
    value: function handleUpload(file) {
      var _this = this;

      var base64, response, _data, formattedData, expense;

      return regeneratorRuntime.async(function handleUpload$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;

              if (!this.isValidFile(file)) {
                _context.next = 19;
                break;
              }

              if (!(file.type === "application/json")) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", new Promise(function (resolve, reject) {
                var jsonReader = new FileReader();

                jsonReader.onload = function () {
                  try {
                    var jsonData = JSON.parse(jsonReader.result); // process data

                    _this.processData(jsonData);

                    resolve(jsonData);
                    ui.alert('success', 'File uploaded successfully', 'success');
                  } catch (err) {
                    reject(err);
                    ui.alert('danger', err.message, 'error');
                  }
                }; // handle error


                jsonReader.onerror = function () {
                  reject(jsonReader.error);
                }; // read and resolve


                jsonReader.readAsText(file);
              }));

            case 4:
              if (!(file.type === "application/pdf" || file.type.startsWith("image/"))) {
                _context.next = 19;
                break;
              }

              _context.next = 7;
              return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                var reader = new FileReader(); // onload

                reader.onload = function () {
                  resolve(reader.result);
                }; // onerror


                reader.onerror = function () {
                  reject(reader.error);
                };

                reader.readAsDataURL(file);
              }));

            case 7:
              base64 = _context.sent;
              _context.next = 10;
              return regeneratorRuntime.awrap(fetch("".concat(window.location.origin, "/api/extract-expense"), {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  file: base64,
                  fileType: file.type
                })
              }));

            case 10:
              response = _context.sent;

              if (response.ok) {
                _context.next = 13;
                break;
              }

              throw new Error("Error extracting expense from file");

            case 13:
              _context.next = 15;
              return regeneratorRuntime.awrap(response.json());

            case 15:
              _data = _context.sent;
              formattedData = this.formatData(_data);
              expense = new Expense(formattedData.description, formattedData.amount, formattedData.category, formattedData.date); // validate Formatted data

              if (expense.isValid()) {
                expenseManager.expenses.unshift({
                  id: expense.id,
                  description: expense.description,
                  amount: expense.amount,
                  category: expense.category,
                  date: expense.date
                });
                ui.displayUI();
                ui.alert('success', 'File extracted successfully', 'success');
              } else {
                ui.alert('danger', 'Invalid extracted data format', 'error');
              }

            case 19:
              _context.next = 25;
              break;

            case 21:
              _context.prev = 21;
              _context.t0 = _context["catch"](0);
              console.error(_context.t0);
              ui.alert('danger', _context.t0.message, 'error');

            case 25:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[0, 21]]);
    } // Format Expense data

  }, {
    key: "formatData",
    value: function formatData(data) {
      return {
        description: data.description || '',
        amount: parseFloat(data.amount) || 0,
        category: data.category || '',
        date: data.date || new Date().toISOString()
      };
    } //processData

  }, {
    key: "processData",
    value: function processData(JsonData) {
      var _this2 = this;

      var expenses = Array.isArray(JsonData) ? data : [JsonData];
      expenses.forEach(function (expense) {
        var formatted = _this2.formatData(expense);

        var expenseObj = new Expense(formatted.description, formatted.amount, formatted.category, formatted.date); // Formatted data

        if (expenseObj.isValid()) {
          expenseManager.expenses.unshift({
            id: expenseObj.id,
            description: expenseObj.description,
            amount: expenseObj.amount,
            category: expenseObj.category,
            date: expenseObj.date
          });
        } else {
          ui.alert('danger', 'Invalid data format', 'error');
        }
      });
      ui.displayUI();
      ui.alert('success', 'File uploaded successfully', 'success');
    }
  }]);

  return FileHandler;
}(); // Expense Manager


var ExpenseManager =
/*#__PURE__*/
function () {
  function ExpenseManager() {
    _classCallCheck(this, ExpenseManager);

    this.expenses = [];
  }

  _createClass(ExpenseManager, [{
    key: "totalExpenses",
    value: function totalExpenses() {
      return this.expenses.reduce(function (total, expense) {
        return total + expense.amount;
      }, 0);
    }
  }, {
    key: "totalNumberOfExpenses",
    value: function totalNumberOfExpenses() {
      return this.expenses.length;
    }
  }, {
    key: "averageExpense",
    value: function averageExpense() {
      return this.expenses.length > 0 ? this.totalExpenses() / this.totalNumberOfExpenses() : 0;
    } // Top Category (occurs most)

  }, {
    key: "topCategory",
    value: function topCategory() {
      // Check BEFORE the loop, not inside it
      if (this.expenses.length === 0) {
        return '-';
      }

      var categoryCount = {};
      this.expenses.forEach(function (expense) {
        if (categoryCount[expense.category]) {
          categoryCount[expense.category] += 1;
        } else {
          categoryCount[expense.category] = 1;
        }
      }); // Also check if categoryCount is empty

      var entries = Object.entries(categoryCount);

      if (entries.length === 0) {
        return '-';
      }

      return entries.reduce(function (a, b) {
        return a[1] > b[1] ? a : b;
      })[0];
    }
  }]);

  return ExpenseManager;
}(); // UI


var UI =
/*#__PURE__*/
function () {
  function UI(expenseManager) {
    _classCallCheck(this, UI);

    this.expenseManager = expenseManager;
  }

  _createClass(UI, [{
    key: "displayUI",
    value: function displayUI() {
      var totalExpense = document.querySelector('#totalExpenses');
      var transactionCount = document.querySelector('#transactionCount');
      var averageTransaction = document.querySelector('#avgTransaction');
      var expenseList = document.querySelector('#expensesList');
      var topCategory = document.querySelector('#topCategory'); // output expense

      expenseList.innerHTML = ''; //loop through the expenses

      expenseManager.expenses.forEach(function (expense) {
        expenseList.innerHTML += "\n                <div class=\"expense-item\">\n                    <div class=\"expense-date\">".concat(expense.date, "</div>\n                    <div class=\"expense-category\">").concat(expense.category, "</div>\n                    <div class=\"expense-description\">").concat(expense.description, "</div>\n                    <div class=\"expense-amount\">").concat(expense.amount, "</div>\n                </div>");
      }); // display total expenses 

      totalExpense.textContent = "\u20A6".concat(this.expenseManager.totalExpenses().toFixed(2)); // transaction count 

      transactionCount.textContent = "".concat(this.expenseManager.totalNumberOfExpenses()); // average transaction 

      averageTransaction.textContent = "\u20A6".concat(this.expenseManager.averageExpense()); // top category

      topCategory.textContent = " ".concat(this.expenseManager.topCategory());
    } // Add expense to the manager

  }, {
    key: "addExpense",
    value: function addExpense() {
      var date = document.querySelector('#date').value;
      var category = document.querySelector('#category').value;
      var description = document.querySelector('#description').value;
      var amount = new Expense('', document.querySelector('#amount').value, '', '').parseAmount(document.querySelector('#amount').value);

      if (date && category && description && !isNaN(amount)) {
        var expense = {
          id: Date.now() + Math.random(),
          date: date,
          category: category,
          description: description,
          amount: Math.round(amount * 100) / 100
        };
        this.expenseManager.expenses.unshift(expense);
        this.displayUI();
        this.clearExpenses();
      }
    } // clear expenses

  }, {
    key: "clearExpenses",
    value: function clearExpenses() {
      var date = document.querySelector('#date');
      var category = document.querySelector('#category');
      var description = document.querySelector('#description');
      var amount = document.querySelector('#amount');
      date.value = '';
      category.value = '';
      description.value = '';
      amount.value = '';
    } // Alert (className, message,  type)

  }, {
    key: "alert",
    value: function alert(className, message, type) {
      try {
        var alert = document.createElement('div'); // set classname

        alert.className = "alert ".concat(className); // set message

        alert.textContent = message; // set type

        alert.type = type;

        if (type === 'success') {
          alert.classList.add('success');
        } else {
          alert.classList.add('error');
        } //get the container element


        var container = document.querySelector('.container');
        var main = document.querySelector('.main-content');
        container.insertBefore(alert, main);
        setTimeout(function () {
          alert.remove();
        }, 2000);
      } catch (err) {
        console.error(err);
      }
    }
  }]);

  return UI;
}(); // Expense manager instance


var expenseManager = new ExpenseManager();
var ui = new UI(expenseManager); // Storage

var Store = function Store() {
  _classCallCheck(this, Store);
}; // Event Listeners
// on load


document.addEventListener('DOMContentLoaded', function () {
  ui.displayUI();
  ui.alert('success', 'Dom loaded successfully', 'success');
}); // add expense

document.querySelector('#addExpense').addEventListener('click', function () {
  ui.addExpense();
  ui.alert('success', 'Expense added successfully', 'success');
}); // clear expenses

document.querySelector('#clear').addEventListener('click', function () {
  ui.clearExpenses();
  ui.alert('success', 'Expenses cleared successfully', 'success');
}); // file upload 

document.querySelector('#browseBtn').addEventListener('click', function () {
  document.querySelector('#fileInput').click();
}); // Handle file selection separately

document.querySelector('#fileInput').addEventListener('change', function (e) {
  var file = e.target.files[0];

  if (file) {
    // Display file name
    document.querySelector('#fileNameDisplay').textContent = "Selected: ".concat(file.name); // Upload file

    var fileHandler = new FileHandler();
    fileHandler.handleUpload(file);
  }
}); // file upload drag and drop

var uploadArea = document.querySelector('#uploadArea');
uploadArea.addEventListener('dragover', function (e) {
  e.preventDefault();
  uploadArea.classList.add('drag-over');
}); // Remove highlight when dragging leaves

uploadArea.addEventListener('dragleave', function (e) {
  e.preventDefault();

  if (e.target === uploadArea) {
    uploadArea.classList.remove('drag-over');
  }
}); // Handle the actual file drop

uploadArea.addEventListener('drop', function (e) {
  e.preventDefault();
  uploadArea.classList.remove('drag-over'); // Get the dropped file

  var file = e.dataTransfer.files[0];

  if (file) {
    // Display file name
    document.querySelector('#fileNameDisplay').textContent = "Selected: ".concat(file.name); // Upload the file

    var fileHandler = new FileHandler();
    fileHandler.handleUpload(file);
  } else {
    ui.alert('danger', 'No file selected', 'error');
  }
});
//# sourceMappingURL=tracker.dev.js.map
