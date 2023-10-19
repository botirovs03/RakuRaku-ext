// content_script.js
console.log("CopyToClipboard script loaded.");
let node = document.createElement("button");
node.id = "MyScript";
node.innerHTML = "Option Copy";
node.style.position = "Fixed";
node.style.right = "0";
node.style.top = "0";
node.onclick = function () {
  // Get the table element by its class name
  var table = document.querySelectorAll(".estimate_list")[1];

  // Initialize variables to store extracted data
  var optionItem = "";
  var content = "";
  var productCode = "";
  var quantity = "";
  var unit = "";
  var originalPrice = "";
  var sellingPrice = "";
  var sellingPriceAmount = "";

  // Get all rows in the table body
  var rows = table.querySelectorAll("tbody tr");

  // Create a variable to store the copied data
  var copiedData = "オプション項目\n";

  // Iterate over rows
  rows.forEach(function (row) {
    // Get all cells in the row
    var cells = row.querySelectorAll("td");

    // Extract data from cells
    if (cells.length >= 3) {
      optionItem = cells[2].textContent.trim();
    }

    if (cells.length >= 8) {
      productCode = cells[1].textContent.trim();
      quantity = cells[3].textContent.trim();
      unit = cells[4].textContent.trim();
      originalPrice = cells[5].textContent.trim();
      sellingPrice = cells[6].textContent.trim();
      sellingPriceAmount = cells[7].textContent.trim();
    }

    // Build the copied data in the desired format

    // Build the copied data in the desired format
    if (productCode) {
      copiedData += "商品コード　" + productCode + "\n";
    }
    if (optionItem) {
      copiedData += "内容（品名・規格・作業等）　" + optionItem + "\n";
    }
    if (quantity) {
      copiedData += "数量　　　" + quantity + "\n";
    }
    if (unit) {
      copiedData += "単位　　　" + unit + "\n";
    }
    if (originalPrice) {
      copiedData += "原単価　　" + originalPrice + "\n";
    }
    if (sellingPrice) {
      copiedData += "売単価　　" + sellingPrice + "\n";
    }
    if (sellingPriceAmount) {
      copiedData += "売価金額　" + sellingPriceAmount + "\n\n";
    } else {
      copiedData += "\n";
    }
  });

  // Copy the extracted data to the clipboard
  var textArea = document.createElement("textarea");
  textArea.value = copiedData;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);

  // Alert to notify that data has been copied
  console.log("Data copied to clipboard");
};
document.body.appendChild(node);

///////////////////////////////////////////////////////////////////////

let GetDatas = document.createElement("button");
GetDatas.id = "GetDatas";
GetDatas.innerHTML = "GetDatas";
GetDatas.style.position = "fixed"; // Note the lowercase "fixed"
GetDatas.style.right = "0";
GetDatas.style.top = "20px"; // Add "px" to specify the top position in pixels

GetDatas.onclick = function () {
  // content_scriptRich.js
  const dataToSend = GetData();
  buttonize();
  chrome.runtime.sendMessage({ source: "getdatas", data: dataToSend });
};

// Append the button to the document body
document.body.appendChild(GetDatas);

function GetData() {
  // Initialize an object to store the extracted data
  const dataObject = {};

  // Select the first table element
  const table = document.querySelector("table.detail");

  // Check if the table exists on the page
  if (table) {
    const rows = table.querySelectorAll("tr");

    rows.forEach((row) => {
      const headerText = row.querySelector("th").textContent.trim();
      const cellText = row.querySelector("td").textContent.trim();

      if (headerText === "案件名") {
        // Extract the case name and store it in the object
        dataObject.caseName = cellText;
      } else if (headerText === "取引先") {
        // Extract the client name and store it in the object
        dataObject.clientName = cellText.split(" ")[0];
      }
    });
  }

  // Select the second table element
  const table2 = document.querySelectorAll("table.detail")[1];

  // Check if the table exists on the page
  if (table2) {
    const rows = table2.querySelectorAll("tr");

    rows.forEach((row) => {
      const headerText = row.querySelector("th").textContent.trim();
      const cellText = row.querySelector("td").textContent.trim();

      if (headerText === "見積番号") {
        dataObject.quotationNumber = cellText;
      } else if (headerText === "見積日") {
        dataObject.date = cellText;
      } else if (headerText === "納入期日") {
        dataObject.deliveryDate = cellText;
      } else if (headerText === "納品方法") {
        dataObject.deliveryMethod = cellText;
      } else if (headerText === "有効期限") {
        dataObject.validityPeriod = cellText;
      }
    });
  }

  // Select the third table element
  const table3 = document.querySelectorAll("table.detail")[3];

  // Check if the table exists on the page
  if (table3) {
    const rows = table3.querySelectorAll("tr");

    rows.forEach((row) => {
      const headerText = row.querySelector("th").textContent.trim();
      const cellText = row.querySelector("td").textContent.trim();

      if (headerText === "原価合計金額") {
        dataObject.costTotal = cellText;
      } else if (headerText === "売価合計金額(税抜)") {
        dataObject.sellingPriceExcludingTax = cellText;
      } else if (headerText === "売価合計金額(税込)") {
        dataObject.sellingPriceIncludingTax = cellText;
      } else if (headerText === "消費税額") {
        if (cellText == "含まず") {
          dataObject.isFukumazu = true;
        } else {
          dataObject.isFukumazu = false;
        }
      }
    });
  }

  // Output the result object to the console
  console.log(dataObject);

  // Return the data object
  return dataObject;
}

function buttonize() {
  var estimate_list = [];
  // Get a reference to the table
  var table = document.querySelector(".estimate_list");

  // Get all rows in the table, excluding the header row
  var rows = table.querySelectorAll("tr:not(:first-child)");

  // Add a click event listener to each cell in the first column (index 0)
  // Add a click event listener to each cell in the first column (index 0)
  rows.forEach(function (row) {
    var estimateData = {};
    // Check if the row has only one cell with colspan="9"
    var cells = row.querySelectorAll("td");
    if (cells.length === 1 && cells[0].colSpan === 9) {
      var firstCell = row.querySelector("td:first-child");
      firstCell.addEventListener("click", function () {
        // Get values from other cells in the same row
        var description = row.querySelector("td:first-child").textContent;

        estimateData = {
          description: description,
          isHeader: true,
        };
        console.log(estimateData);
        estimate_list.push(estimateData);
        chrome.runtime.sendMessage({ source: "estimate", data: estimateData });
      });

      return; // Skip this row
    } else if (cells.length != 9) {
      return; // Skip this row
    }

    var firstCell = row.querySelector("td:first-child");
    firstCell.addEventListener("click", function () {
      // Get values from other cells in the same row
      var productCode = row.querySelector("td:nth-child(2)").textContent;
      var description = row.querySelector("td:nth-child(3)").textContent;
      var quantity = row.querySelector("td:nth-child(4)").textContent;
      var unit = row.querySelector("td:nth-child(5)").textContent;
      var unitPrice = row.querySelector("td:nth-child(6)").textContent;
      var sellingPrice = row.querySelector("td:nth-child(7)").textContent;
      var profitMargin = row.querySelector("td:nth-child(8)").textContent;
      var sellingAmount = row.querySelector("td:nth-child(9)").textContent;

      estimateData = {
        productCode: productCode,
        description: description,
        quantity: quantity,
        unit: unit,
        unitPrice: unitPrice,
        sellingPrice: sellingPrice,
        profitMargin: profitMargin,
        sellingAmount: sellingAmount,
      };
      console.log(estimateData);
      estimate_list.push(estimateData);
      chrome.runtime.sendMessage({ source: "estimate", data: estimateData });
    });
  });
  console.log(estimate_list);
}

function getEstimates() {
  var estimate_list = [];
  // Get a reference to the table
  var table = document.querySelector(".estimate_list");

  // Get all rows in the table, excluding the header row
  var rows = table.querySelectorAll("tr:not(:first-child)");

  // Add a click event listener to each cell in the first column (index 0)
  // Add a click event listener to each cell in the first column (index 0)
  rows.forEach(function (row) {
    var estimateData = {};
    // Check if the row has only one cell with colspan="9"
    var cells = row.querySelectorAll("td");
    if (cells.length === 1 && cells[0].colSpan === 9) {
      // Get values from other cells in the same row
      var description = row.querySelector("td:first-child").textContent;

      estimateData = {
        description: description,
        isHeader: true,
      };
      estimate_list.push(estimateData);
      chrome.runtime.sendMessage({ source: "estimate", data: estimateData });

      return; // Skip this row
    } else if (cells.length != 9) {
      return; // Skip this row
    }

    // Get values from other cells in the same row
    var productCode = row.querySelector("td:nth-child(2)").textContent;
    var description = row.querySelector("td:nth-child(3)").textContent;
    var quantity = row.querySelector("td:nth-child(4)").textContent;
    var unit = row.querySelector("td:nth-child(5)").textContent;
    var unitPrice = row.querySelector("td:nth-child(6)").textContent;
    var sellingPrice = row.querySelector("td:nth-child(7)").textContent;
    var profitMargin = row.querySelector("td:nth-child(8)").textContent;
    var sellingAmount = row.querySelector("td:nth-child(9)").textContent;

    estimateData = {
      productCode: productCode,
      description: description,
      quantity: quantity,
      unit: unit,
      unitPrice: unitPrice,
      sellingPrice: sellingPrice,
      profitMargin: profitMargin,
      sellingAmount: sellingAmount,
    };
    if (estimateData.description.trim() != "") {
      estimate_list.push(estimateData);
    }
    chrome.runtime.sendMessage({ source: "estimate", data: estimateData });
  });
  return estimate_list;
}

let Check = document.createElement("button");
Check.id = "Check";
Check.innerHTML = "Check";
Check.style.position = "fixed"; // Note the lowercase "fixed"
Check.style.right = "0";
Check.style.top = "40px"; // Add "px" to specify the top position in pixels

Check.onclick = function () {
  buttonize();
  // content_scriptRich.js
  const contentData = GetData();
  const estimates = getEstimates();
  chrome.runtime.sendMessage({
    source: "check",
    data: { contentData, estimates },
  });
};

document.body.appendChild(Check);
