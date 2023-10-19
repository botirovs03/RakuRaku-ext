// content_script.js
console.log("CopyToClipboard script loaded.");
let node = document.createElement("button");
node.id = "MyScript";
node.innerHTML = "Option Copy";
node.style.position = "Fixed";
node.style.right = "0";
node.style.top = "0";
node.style.zIndex = "10000";
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
GetDatas.style.zIndex = "10000";

GetDatas.onclick = function () {
  // content_scriptRich.js
  const dataToSend = GetData();
  dataToSend.system = "SpreadOffice";
  buttonize();
  chrome.runtime.sendMessage({ source: "getdatas", data: dataToSend });
};

// Append the button to the document body
document.body.appendChild(GetDatas);

function GetData() {
  // Initialize an object to store the extracted data
  const dataObject = {};
  let all = document.querySelectorAll("#r2-companyText");
  let caseName = document
    .querySelector("#r2-table-subject")
    .querySelector("#r2-companyText");
  // Check if the table exists on the page
  dataObject.caseName = caseName.textContent;

  dataObject.quotationNumber = all[1].textContent;

  dataObject.date = all[0].textContent;
  dataObject.deliveryDate = all[4].textContent;
  dataObject.deliveryMethod = all[6].textContent;
  dataObject.validityPeriod = all[5].textContent;

  let allPrices = document.querySelectorAll('[id^="ItemEdit"]');
  // if (headerText === "原価合計金額") {
  dataObject.costTotal = allPrices[3].textContent;
  // } else if (headerText === "売価合計金額(税抜)") {
  dataObject.sellingPriceExcludingTax = allPrices[0].textContent;
  // } else if (headerText === "売価合計金額(税込)") {
  dataObject.sellingPriceIncludingTax = allPrices[2].textContent;
  // } else if (headerText === "消費税額") {
  if (
    dataObject.sellingPriceExcludingTax == dataObject.sellingPriceIncludingTax
  ) {
    dataObject.isFukumazu = true;
  } else {
    dataObject.isFukumazu = false;
  }
  dataObject.bikou = document.querySelector(
    ".EstimateViewLeftItem_note"
  ).innerText;

  console.log(dataObject);

  // Return the data object
  return dataObject;
}

function buttonize() {
  var estimate_list = [];
  // Get a reference to the table

  // Get all rows in the table, excluding the header row
  var rows = document.querySelectorAll("#EstimateItemViews_items [class$=tr]");

  // Add a click event listener to each cell in the first column (index 0)
  // Add a click event listener to each cell in the first column (index 0)
  rows.forEach(function (row) {
    var estimateData = {};

    if (row.getAttribute("data-form") == "EstimateItemViewRowHeader") {
      var firstCell = row.querySelectorAll("div")[5];
      firstCell.addEventListener("click", function () {
        // Get values from other cells in the same row
        var description = row.querySelectorAll("div")[5].innerText;

        estimateData = {
          description: description,
          isHeader: true,
        };
        console.log(estimateData);
        estimate_list.push(estimateData);
        chrome.runtime.sendMessage({ source: "estimate", data: estimateData });
      });

      return; // Skip this row
    } else if (row.getAttribute("data-form") == "EstimateItemViewRowSubtotal") {
      return; // Skip this row
    }

    var firstCell = row.querySelectorAll("div")[4];
    firstCell.addEventListener("click", function () {
      // Get values from other cells in the same row
      var productCode = row.querySelectorAll("div")[4].innerText;
      var description = row.querySelectorAll("div")[5].innerText;
      var quantity = row.querySelectorAll("div")[6].innerText;
      var unit = row.querySelectorAll("div")[7].innerText;
      var unitPrice = "";
      var sellingPrice = row.querySelectorAll("div")[8].innerText;
      // var profitMargin = row.querySelector("td:nth-child(8)").textContent;
      // var sellingAmount = row.querySelector("td:nth-child(9)").textContent;

      estimateData = {
        productCode: productCode,
        description: description,
        quantity: quantity,
        unit: unit,
        unitPrice: unitPrice,
        sellingPrice: sellingPrice,
        // profitMargin: profitMargin,
        // sellingAmount: sellingAmount,
      };
      console.log(estimateData);
      estimate_list.push(estimateData);
      chrome.runtime.sendMessage({ source: "estimate", data: estimateData });
    });
  });

  // Get all rows in the table, excluding the header row
  var rows2 = document.querySelectorAll("#EstimateCostViews [class$=tr]");

  // Add a click event listener to each cell in the first column (index 0)
  // Add a click event listener to each cell in the first column (index 0)
  rows2.forEach(function (row) {
    var estimateData = {};
    console.log(row.getAttribute("data-form"));
    console.log(row.getAttribute("data-form") == "EstimateCostViewRowSubtotal");
    if (row.getAttribute("data-form") == "EstimateCostViewRowHeader") {
      var firstCell = row.querySelectorAll("div")[5];
      firstCell.addEventListener("click", function () {
        // Get values from other cells in the same row
        var description = row.querySelectorAll("div")[5].innerText;

        estimateData = {
          description: description,
          isHeader: true,
        };
        console.log(estimateData);
        estimate_list.push(estimateData);
        chrome.runtime.sendMessage({ source: "estimate", data: estimateData });
      });

      return; // Skip this row
    } else if (row.getAttribute("data-form") == "EstimateCostViewRowSubtotal") {
      return; // Skip this row
    }

    var firstCell = row.querySelectorAll("div")[4];
    firstCell.addEventListener("click", function () {
      // Get values from other cells in the same row
      var productCode = row.querySelectorAll("div")[4].innerText;
      var description = row.querySelectorAll("div")[5].innerText;
      var quantity = row.querySelectorAll("div")[7].innerText;
      var unit = row.querySelectorAll("div")[8].innerText;
      var unitPrice = row.querySelectorAll("div")[9].innerText;
      var sellingPrice = "";
      // var profitMargin = row.querySelector("td:nth-child(8)").textContent;
      // var sellingAmount = row.querySelector("td:nth-child(9)").textContent;

      estimateData = {
        productCode: productCode,
        description: description,
        quantity: quantity,
        unit: unit,
        unitPrice: unitPrice,
        sellingPrice: sellingPrice,
        // profitMargin: profitMargin,
        // sellingAmount: sellingAmount,
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
  // Get all rows in the table, excluding the header row
  var rows = document.querySelectorAll("#EstimateItemViews_items [class$=tr]");

  // Add a click event listener to each cell in the first column (index 0)
  // Add a click event listener to each cell in the first column (index 0)
  rows.forEach(function (row) {
    var estimateData = {};

    if (row.getAttribute("data-form") == "EstimateItemViewRowHeader") {
      var firstCell = row.querySelectorAll("div")[5];
      // Get values from other cells in the same row
      var description = row.querySelectorAll("div")[5].innerText;

      estimateData = {
        description: description,
        isHeader: true,
      };
      console.log(estimateData);
      estimate_list.push(estimateData);
      chrome.runtime.sendMessage({ source: "estimate", data: estimateData });

      return; // Skip this row
    } else if (row.getAttribute("data-form") == "EstimateItemViewRowSubtotal") {
      return; // Skip this row
    }

    var firstCell = row.querySelectorAll("div")[4];
    // Get values from other cells in the same row
    var productCode = row.querySelectorAll("div")[4].innerText;
    var description = row.querySelectorAll("div")[5].innerText;
    var quantity = row.querySelectorAll("div")[6].innerText;
    var unit = row.querySelectorAll("div")[7].innerText;
    var unitPrice = "";
    var sellingPrice = row.querySelectorAll("div")[8].innerText;
    // var profitMargin = row.querySelector("td:nth-child(8)").textContent;
    // var sellingAmount = row.querySelector("td:nth-child(9)").textContent;

    estimateData = {
      productCode: productCode,
      description: description,
      quantity: quantity,
      unit: unit,
      unitPrice: unitPrice,
      sellingPrice: sellingPrice,
      // profitMargin: profitMargin,
      // sellingAmount: sellingAmount,
    };
    console.log(estimateData);
    estimate_list.push(estimateData);
    chrome.runtime.sendMessage({ source: "estimate", data: estimateData });
  });

  // Get all rows in the table, excluding the header row
  var rows = document.querySelectorAll("#EstimateCostViews [class$=tr]");

  // Add a click event listener to each cell in the first column (index 0)
  // Add a click event listener to each cell in the first column (index 0)
  rows.forEach(function (row) {
    var estimateData = {};

    if (row.getAttribute("data-form") == "EstimateCostViewRowHeader") {
      var firstCell = row.querySelectorAll("div")[5];
      // Get values from other cells in the same row
      var description = row.querySelectorAll("div")[5].innerText;

      estimateData = {
        description: description,
        isHeader: true,
      };
      console.log(estimateData);
      estimate_list.push(estimateData);
      chrome.runtime.sendMessage({ source: "estimate", data: estimateData });

      return; // Skip this row
    } else if (row.getAttribute("data-form") == "EstimateCostViewRowSubtotal") {
      return; // Skip this row
    }

    var firstCell = row.querySelectorAll("div")[4];
    // Get values from other cells in the same row
    var productCode = row.querySelectorAll("div")[4].innerText;
    var description = row.querySelectorAll("div")[5].innerText;
    var quantity = row.querySelectorAll("div")[7].innerText;
    var unit = row.querySelectorAll("div")[8].innerText;
    var unitPrice = row.querySelectorAll("div")[9].innerText;
    var sellingPrice = "";
    // var profitMargin = row.querySelector("td:nth-child(8)").textContent;
    // var sellingAmount = row.querySelector("td:nth-child(9)").textContent;

    estimateData = {
      productCode: productCode,
      description: description,
      quantity: quantity,
      unit: unit,
      unitPrice: unitPrice,
      sellingPrice: sellingPrice,
      // profitMargin: profitMargin,p
      // sellingAmount: sellingAmount,
    };
    console.log(estimateData);
    estimate_list.push(estimateData);
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
Check.style.zIndex = "10000";

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
