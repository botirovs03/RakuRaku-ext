// content_script.js
console.log("Content script loaded.");
console.log("Current URL:", window.location.href);

let node = document.createElement("button");
node.id = "MyScript";
node.innerHTML = "RunScript";
node.style.position = "Absolute";
node.style.right = "0";
node.style.top = "";

node.onclick = function () {
  const tableRows = window.frames["main"].document.querySelectorAll("tr"); // Select all table rows
  // Loop through each row and check if it contains the text "00588"
  tableRows.forEach((row) => {
    const cells = row.querySelectorAll("td"); // Select all cells in the current row
    let containsText00588 = false;
    cells.forEach((cell) => {
      const cellText = cell.textContent.trim();
      if (cellText === "00588") {
        containsText00588 = true;
      }
    });
    // If the row contains the text "00588", apply the red background
    if (containsText00588) {
      row.style.backgroundColor = "#ddeeff";
    }
  });
};

// let copyButton = document.createElement("button");
// copyButton.id = "MyScript";
// copyButton.innerHTML = "COPY";
// copyButton.style.position = "absolute";
// copyButton.style.right = "0";
// copyButton.style.top = "20px";

// copyButton.onclick = function () {
//   const buttonsElement =
//     window.frames["main"].document.querySelector(".decision-box ul"); // Select the first ul element
//   if (buttonsElement) {
//     // Create a new li element
//     const newLiElement = document.createElement("li");

//     // Create a new anchor element with the copySubmit() function
//     const newAnchorElement = document.createElement("a");
//     newAnchorElement.className = "fw-btn fw-btn-icon fw-mw100";
//     newAnchorElement.href = "javascript:copySubmit();";

//     // Create the inner elements for the anchor
//     const innerDiv1 = document.createElement("div");
//     innerDiv1.className = "fw-float fw-box-center";

//     const innerDiv2 = document.createElement("div");
//     innerDiv2.className = "fw-left";
//     const innerI = document.createElement("i");
//     innerI.className = "fa fa-files-o";
//     innerDiv2.appendChild(innerI);

//     const innerDiv3 = document.createElement("div");
//     innerDiv3.className = "fw-left fw-mgl3";
//     innerDiv3.textContent = "コーヒー"; // Change the text as needed

//     innerDiv1.appendChild(innerDiv2);
//     innerDiv1.appendChild(innerDiv3);
//     newAnchorElement.appendChild(innerDiv1);

//     // Append the new anchor element to the new li element
//     newLiElement.appendChild(newAnchorElement);

//     // Append the new li element to the ul
//     buttonsElement.appendChild(newLiElement);
//   }
//   console.log(buttonsElement);
// };

document.body.appendChild(node);
// document.body.appendChild(copyButton);
let isFukumazu;
// content_scriptRaku.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.source === "getdatas") {
    isFukumazu = message.data.isFukumazu;
    console.log(isFukumazu);
    // Handle the data received from background.js (source2)
    console.log(message.data);
    const contentData = message.data;
    const date = new Date(message.data.date);

    window.frames["main"].document.querySelector("#year_111018").value =
      date.getFullYear();
    window.frames["main"].document.querySelector("#month_111018").value =
      date.getMonth() + 1;
    window.frames["main"].document.querySelector("#day_111018").value =
      date.getDate();

    // Set the value of the first select input
    var groupSelect =
      window.frames["main"].document.querySelector("#group_0_111013");
    groupSelect.value = "D01:BSOL";

    // Create a change event
    var changeEvent = new Event("change", {
      bubbles: true,
      cancelable: true,
    });

    // Trigger the change event on the first select input
    groupSelect.dispatchEvent(changeEvent);

    setTimeout(() => {
      // Now you can set the value of the second select input
      let tantousha =
        window.frames["main"].document.querySelector("#field_111013");
      tantousha.value = "0009";
      // Create a change event
      var changeEvent = new Event("change", {
        bubbles: true,
        cancelable: true,
      });
      tantousha.dispatchEvent(changeEvent);
    }, 2000);

    // window.frames["main"].document.querySelector("#field_111021").value = contentData.clientName
    window.frames["main"].document.querySelector("#field_111031").value =
      contentData.caseName;

    window.frames["main"].document.querySelector("#field_111059").value =
      contentData.deliveryDate;
    window.frames["main"].document.querySelector("#field_111060").value =
      contentData.deliveryMethod;
    window.frames["main"].document.querySelector("#field_111062").value =
      contentData.validityPeriod;
    window.frames["main"].document.querySelector("#field_111353").value =
      contentData.quotationNumber;

    // You can perform actions based on the data received from content_scriptRich.js here
  } else if (message.source == "estimate") {
    let data = message.data;

    var inputString = data.description;

    // Split the inputString into two parts at the first line break character
    var parts = inputString.split("\n");
    var firstLine = parts[0];
    var otherLines = parts.slice(1).join("\n");
    otherLines = otherLines.trim().replace(/ /g, " ");
    if (data.isHeader) {
      window.frames["main"].document.querySelector("#field_111045").value =
        firstLine;
      window.frames["main"].document.querySelector("#field_111050").value =
        otherLines;

      window.frames["main"].document.querySelector("#field_111050").value = "";
      window.frames["main"].document.querySelector("#field_111046").value = "";
      window.frames["main"].document.querySelector("#field_111047").value = "";
      window.frames["main"].document.querySelector("#field_111048").value = "";
      window.frames["main"].document.querySelector("#field_111051").value = 0;
      window.frames["main"].document.querySelector("#field_111057").value = "";
      var inputElement =
        window.frames["main"].document.querySelector("#field_111048");
      // Trigger the blur event programmatically
      var blurEvent = new Event("blur");
      inputElement.dispatchEvent(blurEvent);
    } else {
      window.frames["main"].document.querySelector("#field_111045").value =
        firstLine;
      window.frames["main"].document.querySelector("#field_111050").value =
        otherLines;
      window.frames["main"].document.querySelector("#field_111046").value =
        data.quantity;
      window.frames["main"].document.querySelector("#field_111047").value =
        data.unit;
      window.frames["main"].document.querySelector("#field_111048").value =
        data.sellingPrice;
      window.frames["main"].document.querySelector("#field_111051").value =
        data.unitPrice;
      window.frames["main"].document.querySelector("#field_111057").value = "";
      if (isFukumazu) {
        let taxCode =
          window.frames["main"].document.querySelector("#field_112129");
        taxCode.value = "0004";
        var blurEvent = new Event("blur");
        taxCode.dispatchEvent(blurEvent);
        var click = new Event("click");
        window.frames["main"].document
          .querySelectorAll(".fw-mw40")[4]
          .dispatchEvent(click);
      }
      var inputElement =
        window.frames["main"].document.querySelector("#field_111048");
      // Trigger the blur event programmatically
      var blurEvent = new Event("blur");
      inputElement.dispatchEvent(blurEvent);
    }
  } else if (message.source === "check") {
    // Handle the data received from background.js (source2)
    node.click();
    const contentData = message.data.contentData;
    const estimateData = message.data.estimates;
    const date = new Date(message.data.contentData.date);

    // Check and set background color for the year input element
    const yearElement =
      window.frames["main"].document.querySelector("#year_111018");
    if (yearElement.value === date.getFullYear().toString()) {
      yearElement.style.backgroundColor = "green";
    } else {
      yearElement.style.backgroundColor = "red";
    }

    // Check and set background color for the month input element
    const monthElement =
      window.frames["main"].document.querySelector("#month_111018");
    if (monthElement.value === (date.getMonth() + 1).toString()) {
      monthElement.style.backgroundColor = "green";
    } else {
      monthElement.style.backgroundColor = "red";
    }

    // Check and set background color for the day input element
    const dayElement =
      window.frames["main"].document.querySelector("#day_111018");
    if (dayElement.value === date.getDate().toString()) {
      dayElement.style.backgroundColor = "green";
    } else {
      dayElement.style.backgroundColor = "red";
    }

    // Check and set background colors for other form elements
    const caseNameElement =
      window.frames["main"].document.querySelector("#field_111031");
    if (caseNameElement.value === contentData.caseName) {
      caseNameElement.style.backgroundColor = "green";
    } else {
      caseNameElement.style.backgroundColor = "red";
    }

    const deliveryDateElement =
      window.frames["main"].document.querySelector("#field_111059");
    if (deliveryDateElement.value === contentData.deliveryDate) {
      deliveryDateElement.style.backgroundColor = "green";
    } else {
      deliveryDateElement.style.backgroundColor = "red";
    }

    const deliveryMethodElement =
      window.frames["main"].document.querySelector("#field_111060");
    if (deliveryMethodElement.value === contentData.deliveryMethod) {
      deliveryMethodElement.style.backgroundColor = "green";
    } else {
      deliveryMethodElement.style.backgroundColor = "red";
    }

    const validityPeriodElement =
      window.frames["main"].document.querySelector("#field_111062");
    if (validityPeriodElement.value === contentData.validityPeriod) {
      validityPeriodElement.style.backgroundColor = "green";
    } else {
      validityPeriodElement.style.backgroundColor = "red";
    }

    const goukei = window.frames["main"].document.querySelector("#span_112236");
    if (
      goukei.innerHTML.replace(/[^\d.]/g, "") ==
      contentData.sellingPriceExcludingTax.replace(/[^\d.]/g, "")
    ) {
      goukei.style.backgroundColor = "green";
    } else {
      goukei.style.backgroundColor = "red";
    }

    const goukeiZeikin =
      window.frames["main"].document.querySelector("#span_112237");
    if (
      goukeiZeikin.innerHTML.replace(/[^\d.]/g, "") ==
      contentData.sellingPriceIncludingTax.replace(/[^\d.]/g, "")
    ) {
      goukeiZeikin.style.backgroundColor = "green";
    } else {
      goukeiZeikin.style.backgroundColor = "red";
    }

    const goukeiGenka =
      window.frames["main"].document.querySelector("#span_111038");
    if (
      goukeiGenka.innerHTML.replace(/[^\d.]/g, "") ==
      contentData.costTotal.replace(/[^\d.]/g, "")
    ) {
      goukeiGenka.style.backgroundColor = "green";
    } else {
      goukeiGenka.style.backgroundColor = "red";
    }
    // You can perform actions based on the data received from content_scriptRich.js here

    //cheching estimates
    const estimateTable =
      window.frames["main"].document.querySelectorAll(".mainTr");
    estimateTable.forEach((row, index) => {
      const detailRows = row.querySelectorAll(".detailRow");
      if (estimateData[index].isHeader) {
        var inputString = estimateData[index].description;

        // Split the inputString into two parts at the first line break character
        var parts = inputString.split("\n");
        var firstLine = parts[0].trim().replace(/ /g, " ");
        var otherLines = parts.slice(1).join("\n");
        otherLines = otherLines.trim().replace(/ /g, " ");

        //description 1st line
        const description = detailRows[1].querySelectorAll("pre")[1];
        if (description.innerHTML.trim() == firstLine) {
          description.style.backgroundColor = "green";
        } else {
          description.style.backgroundColor = "red";
        }
      } else {
        var inputString = estimateData[index].description;

        // Split the inputString into two parts at the first line break character
        var parts = inputString.split("\n");
        var firstLine = parts[0].trim().replace(/ /g, " ");
        var otherLines = parts.slice(1).join("\n");
        otherLines = otherLines.trim().replace(/ /g, " ");

        //description 1st line
        const description = detailRows[1].querySelectorAll("pre")[1];
        if (description.innerHTML.trim() == firstLine) {
          description.style.backgroundColor = "green";
        } else {
          description.style.backgroundColor = "red";
        }

        //description 1st line
        const description2 = detailRows[0].querySelectorAll(".fw-ff-mono")[0];
        const description2value = description2 ? description2.innerHTML : "";
        if (description2value.trim().replace(/ /g, " ") == otherLines) {
          if (description2) {
            description2.style.backgroundColor = "green";
          }
        } else {
          if (description2) {
            description2.style.backgroundColor = "red";
          }
        }

        //quantity
        const quantity = detailRows[1].querySelector(
          "#span_" + (index + 1) + "_111046"
        );
        if (
          parseFloat(quantity.innerText.trim()) ==
          parseFloat(estimateData[index].quantity)
        ) {
          if (quantity) {
            quantity.style.backgroundColor = "green";
          }
        } else {
          if (quantity) {
            quantity.style.backgroundColor = "red";
          }
        }

        //unit
        const unit = detailRows[1].querySelectorAll("pre");

        if (unit[2]) {
          if (unit[2].innerText == estimateData[index].unit) {
            unit[2].style.backgroundColor = "green";
          } else {
            unit[2].style.backgroundColor = "red";
          }
        }

        //sellingPrice
        const sellingPrice = detailRows[1].querySelector(
          "#span_" + (index + 1) + "_111048"
        );

        if (
          sellingPrice.innerText.substring(1) ==
          estimateData[index].sellingPrice
        ) {
          if (sellingPrice) {
            sellingPrice.style.backgroundColor = "green";
          }
        } else {
          if (sellingPrice) {
            sellingPrice.style.backgroundColor = "red";
          }
        }

        //unitPrice
        const unitPrice = detailRows[1].querySelector(
          "#span_" + (index + 1) + "_111051"
        );

        if (unitPrice.innerText.substring(1) == estimateData[index].unitPrice) {
          if (unitPrice) {
            unitPrice.style.backgroundColor = "green";
          }
        } else {
          if (unitPrice) {
            unitPrice.style.backgroundColor = "red";
          }
        }
      }
    });
  } //check
});
