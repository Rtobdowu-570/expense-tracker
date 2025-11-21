"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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
    this.OCR_API_KEY = 'K85150228188957';
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

      var base64, cleanBase64, ocrResponse, fullText, rawExpense;
      return regeneratorRuntime.async(function handleUpload$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;

              if (!this.isValidFile(file)) {
                _context.next = 17;
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
                    var JsonData = JSON.parse(jsonReader.result); // process data

                    _this.processData(JsonData);

                    resolve(JsonData);
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
                _context.next = 17;
                break;
              }

              _context.next = 7;
              return regeneratorRuntime.awrap(this.fileToBase64(file));

            case 7:
              base64 = _context.sent;
              cleanBase64 = base64.split(',')[1]; // send request to ocr Api

              _context.next = 11;
              return regeneratorRuntime.awrap(fetch('https://api.ocr.space/parse/image', {
                method: 'POST',
                headers: {
                  'apikey': this.OCR_API_KEY
                },
                body: this.buildFormData(cleanBase64, file.type)
              }));

            case 11:
              ocrResponse = _context.sent;

              // handle response
              if (ocrData.IsErroredOnProcessing) {
                ui.alert('danger', ocrData.ErrorMessage, 'error');
              }

              fullText = ocrData.ParsedResults[0].ParsedText;

              if (!fullText.trim()) {
                ui.alert('danger', 'No text found in the image', 'error');
              } // process data


              rawExpense = this.extractExpenseFromText(fullText);
              this.processData(rawExpense);

            case 17:
              _context.next = 23;
              break;

            case 19:
              _context.prev = 19;
              _context.t0 = _context["catch"](0);
              console.error(_context.t0);
              ui.alert('danger', _context.t0.message, 'error');

            case 23:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[0, 19]]);
    } // Convert file to base64

  }, {
    key: "fileToBase64",
    value: function fileToBase64(file) {
      return new Promise(function (resolve, reject) {
        var reader = new FileReader();

        reader.onload = function () {
          return resolve(reader.result);
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  }, {
    key: "buildFormData",
    value: function buildFormData(base64, fileType) {
      var formData = new FormData();
      formData.append('base64Image', "data:".concat(fileType, ";base64,").concat(base64));
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');
      formData.append('scale', 'true');
      formData.append('OCREngine', '2');
      return formData;
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
    value: function processData(data) {
      var _this2 = this;

      var expenses = Array.isArray(data) ? data : [data];
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
          console.warn('Invalid expense skipped:', item);
          ui.alert('danger', 'Invalid data format', 'error');
        }
      });
      ui.displayUI();
      ui.alert('success', "".concat(expenses.length, " expense(s) added successfully!"), 'success');
    }
  }, {
    key: "extractExpenseFromText",
    value: function extractExpenseFromText(text) {
      var lines = text.split('\n').map(function (l) {
        return l.trim();
      }).filter(Boolean);
      var lowerText = text.toLowerCase();
      var amount = 0;
      var date = new Date().toISOString().split('T')[0];
      var description = 'Expense'; // Find largest amount

      var amountRegex = /₦?\s?([0-9,]+(\.[0-9]{1,2})?)/g;

      var amounts = _toConsumableArray(text.matchAll(amountRegex)).map(function (m) {
        return parseFloat(m[1].replace(/,/g, ''));
      }).filter(function (n) {
        return n > 0;
      });

      if (amounts.length > 0) {
        amount = Math.max.apply(Math, _toConsumableArray(amounts));
      } // Find date 


      var datePatterns = [/\b(\d{4}[-\/]\d{2}[-\/]\d{2})\b/, /\b(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})\b/, /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}/i];

      for (var _i = 0, _datePatterns = datePatterns; _i < _datePatterns.length; _i++) {
        var pattern = _datePatterns[_i];
        var match = text.match(pattern);

        if (match) {
          try {
            var parsed = new Date(match[0]);

            if (!isNaN(parsed)) {
              date = parsed.toISOString().split('T')[0];
              break;
            }
          } catch (_unused) {}
        }
      } // Guess description from keywords


      var keywords = {
        food: ['restaurant', 'kfc', 'chicken', 'rice', 'food', 'lunch', 'dinner', 'shawarma', 'pizza'],
        transport: ['uber', 'bolt', 'taxi', 'fuel', 'petrol', 'bus', 'transport', 'danfo'],
        shopping: ['shoprite', 'market', 'store', 'mall', 'clothes', 'shoe'],
        utilities: ['airtime', 'data', 'electricity', 'nepa', 'dstv', 'gotv', 'internet'],
        entertainment: ['cinema', 'netflix', 'drink', 'bar', 'club'],
        health: ['pharmacy', 'drug', 'hospital', 'clinic']
      };
      var detectedCategory = 'Other';

      for (var _i2 = 0, _Object$entries = Object.entries(keywords); _i2 < _Object$entries.length; _i2++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
            category = _Object$entries$_i[0],
            words = _Object$entries$_i[1];

        if (words.some(function (word) {
          return lowerText.includes(word);
        })) {
          detectedCategory = category.charAt(0).toUpperCase() + category.slice(1);
          break;
        }
      } // Fallback description: first non-empty line or "Receipt expense"


      description = (lines && lines[0] ? lines[0].slice(0, 50) : '') || 'Receipt expense';

      if (description.toLowerCase().includes('total') || description.length < 3) {
        description = lines.find(function (l) {
          return l.length > 10 && !l.match(/₦|total|amount/i);
        }) || 'Expense';
      }

      return {
        description: description.trim(),
        amount: parseFloat(amount.toFixed(2)),
        category: detectedCategory,
        date: date
      };
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
