const SHEET_NAME = "Leads";

function doPost(e) {
  const sheet = getLeadsSheet();
  const data = e.parameter || {};

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.clinicName || "",
    data.specialty || "",
    data.mobileNo || "",
    data.crmInterest || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getLeadsSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Submitted At",
      "Name",
      "Clinic Name",
      "Specialty",
      "Mobile No.",
      "Interested in CRM system"
    ]);
  }

  return sheet;
}
