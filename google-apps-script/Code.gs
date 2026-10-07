/**
 * ============================================================================
 * ILLUMINATE 2026 — Official Google Apps Script Web App & Email Automation
 * Handles:
 *  - Individual Registrations (₹799)
 *  - Squad Registrations (Fixed 4 Members, ₹699/head = ₹2,796 total)
 *  - Automatic Google Drive payment proof upload (clickable preview link)
 *  - Initial Status: "Pending Verification"
 *  - Automated Email Notification when Status is changed to "Verified":
 *      * Sends confirmed entry ticket + scannable QR code
 *      * For Solo: sends to the delegate's email
 *      * For Squad: sends to ALL 4 members' emails individually!
 *  - Custom "Illuminate Admin" Menu in Google Sheets for 1-click execution
 *  - Auto-Header Alignment: Fixes columns AK (Ticket ID) and AL (Ticket Email Sent)
 * ============================================================================
 * 
 * QUICK SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet.
 * 2. Click "Extensions" > "Apps Script".
 * 3. Replace all code in "Code.gs" with this entire script and Save (Ctrl+S).
 * 4. Click "Deploy" > "Manage deployments" -> Edit -> choose "New version" -> Deploy.
 * 
 * 5. TO SEND / TEST EMAILS:
 *    METHOD A (Instant 1-Click for selected row):
 *      - Click any cell in row 2 or row 3.
 *      - Click menu: "🎫 Illuminate Admin" > "✉️ Send / Resend Ticket for Current Row".
 * 
 *    METHOD B (When typing "Verified"):
 *      - Click menu: "🎫 Illuminate Admin" > "⚙️ Install Auto-Verification Trigger" (do this once!).
 *      - In Column AJ (Status), type "Verified".
 *      - The ticket email will be sent automatically to that delegate/squad!
 * ============================================================================
 */

// Name of the sheet tab to store registrations
const SHEET_NAME = 'Registrations';

// Name of Google Drive folder to store uploaded payment screenshot proofs
const DRIVE_FOLDER_NAME = 'Illuminate 2026 Payment Proofs';

/**
 * Standard 38-Column Header Structure:
 * Column AJ (36): Status
 * Column AK (37): Ticket ID
 * Column AL (38): Ticket Email Sent
 */
const HEADERS = [
  'Timestamp',
  'Pass Category',
  'Squad / Team Name',
  'Total Fee Paid',
  // Member 1 (Lead)
  'Lead Name (M1)',
  'Lead Roll No',
  'Lead College',
  'Lead Branch',
  'Lead Year',
  'Lead Phone',
  'Lead Email',
  'City / Location',
  // Member 2
  'Member 2 Name',
  'Member 2 Roll No',
  'Member 2 College',
  'Member 2 Branch',
  'Member 2 Year',
  'Member 2 Phone',
  'Member 2 Email',
  // Member 3
  'Member 3 Name',
  'Member 3 Roll No',
  'Member 3 College',
  'Member 3 Branch',
  'Member 3 Year',
  'Member 3 Phone',
  'Member 3 Email',
  // Member 4
  'Member 4 Name',
  'Member 4 Roll No',
  'Member 4 College',
  'Member 4 Branch',
  'Member 4 Year',
  'Member 4 Phone',
  'Member 4 Email',
  // Payment & Verification
  'UTR / Reference ID',
  'Receipt Screenshot Link',
  'Status',
  'Ticket ID',
  'Ticket Email Sent'
];

/**
 * Dynamic Column Resolver & Self-Healing Header Inserter
 * Perfectly aligns:
 *   Column AJ (36) -> Status
 *   Column AK (37) -> Ticket ID
 *   Column AL (38) -> Ticket Email Sent
 */
function getSheetColumnMap(sheet) {
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const headerValues = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const norm = headerValues.map(h => (h || '').toString().toLowerCase().trim());
  
  const findCol = (predicate) => {
    for (let i = 0; i < norm.length; i++) {
      if (predicate(norm[i])) return i + 1;
    }
    return -1;
  };

  let colStatus = findCol(h => h.indexOf('status') > -1);
  let colUtr = findCol(h => h.indexOf('utr') > -1 || h.indexOf('reference') > -1);
  let colScreenshot = findCol(h => h.indexOf('screenshot') > -1 || h.indexOf('receipt') > -1);

  if (colStatus === -1) colStatus = 36;
  if (colUtr === -1) colUtr = 34;
  if (colScreenshot === -1) colScreenshot = 35;

  // Column AK (37) is Ticket ID, Column AL (38) is Ticket Email Sent
  const colTicketId = colStatus + 1;
  const colEmailSent = colStatus + 2;

  // Ensure row 1 headers are correctly placed at AK (37) and AL (38)
  try {
    const curValAK = (headerValues[colTicketId - 1] || '').toString().trim();
    if (curValAK !== 'Ticket ID') {
      sheet.getRange(1, colTicketId).setValue('Ticket ID')
        .setFontWeight('bold').setBackground('#3b0764').setFontColor('#ffffff').setHorizontalAlignment('center');
    }

    const curValAL = (headerValues[colEmailSent - 1] || '').toString().trim();
    if (curValAL !== 'Ticket Email Sent') {
      sheet.getRange(1, colEmailSent).setValue('Ticket Email Sent')
        .setFontWeight('bold').setBackground('#3b0764').setFontColor('#ffffff').setHorizontalAlignment('center');
    }

    // Clear duplicate headers in columns AM (39) and AN (40) if present
    if (lastCol > colEmailSent) {
      for (let c = colEmailSent + 1; c <= lastCol; c++) {
        const h = (headerValues[c - 1] || '').toString().trim().toLowerCase();
        if (h === 'ticket id' || h === 'ticket email sent') {
          sheet.getRange(1, c).clearContent().setBackground(null);
        }
      }
    }
  } catch (hdrErr) {
    Logger.log('Header format warning: ' + hdrErr.message);
  }

  return {
    colStatus: colStatus,
    colUtr: colUtr,
    colScreenshot: colScreenshot,
    colTicketId: colTicketId,
    colEmailSent: colEmailSent,
    lastCol: Math.max(colEmailSent, sheet.getLastColumn())
  };
}

/**
 * Creates custom UI menu in Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎫 Illuminate Admin')
    .addItem('✉️ Send / Resend Ticket for Current Row', 'sendTicketForActiveRow')
    .addItem('🚀 Send Verified Tickets (Process All)', 'processAllVerifiedTickets')
    .addSeparator()
    .addItem('⚙️ Install Auto-Verification Trigger', 'installEditTrigger')
    .addToUi();
}

/**
 * Instant 1-Click: Sends/Resends ticket for whichever row the user has clicked on!
 */
function sendTicketForActiveRow() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  
  if (sheet.getName() !== SHEET_NAME) {
    SpreadsheetApp.getUi().alert('⚠️ Please switch to the "' + SHEET_NAME + '" tab first.');
    return;
  }

  const row = sheet.getActiveCell().getRow();
  if (row <= 1) {
    SpreadsheetApp.getUi().alert('⚠️ Please click on a delegate registration row (row 2, 3, etc.).');
    return;
  }

  const map = getSheetColumnMap(sheet);
  
  // Reset email sent column to allow send/resend
  sheet.getRange(row, map.colEmailSent).setValue('No');
  sheet.getRange(row, map.colStatus).setValue('Verified');

  const success = sendVerifiedTicketForRow(sheet, row, map);
  if (success) {
    const ticketId = sheet.getRange(row, map.colTicketId).getValue();
    SpreadsheetApp.getUi().alert('✅ Success!\nTicket ' + ticketId + ' has been emailed to the delegate/members for row ' + row + '.');
  } else {
    SpreadsheetApp.getUi().alert('❌ Could not send email. Please check that a valid email address is present in row ' + row + '.');
  }
}

/**
 * GET Handler — Health check & Ticket Verification Status Lookup API
 * Supports: GET ?utr=... or ?ticketId=... or ?email=...
 * Returns verification status directly to frontend so browser can unlock ticket when verified!
 */
function doGet(e) {
  const query = (e && e.parameter) ? e.parameter : {};
  const utrQuery = (query.utr || query.ticketId || query.email || '').toString().trim().toLowerCase();

  // If queried for verification status of a specific delegate / payment:
  if (utrQuery) {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet || sheet.getLastRow() <= 1) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          found: false,
          status: 'Pending Verification',
          message: 'No registrations logged yet'
        })).setMimeType(ContentService.MimeType.JSON);
      }

      const map = getSheetColumnMap(sheet);
      const lastRow = sheet.getLastRow();
      const lastCol = sheet.getLastColumn();
      const rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        
        // Check if utrQuery matches ANY cell in this row (case-insensitive)
        let isMatch = false;
        let foundTicketId = '';

        for (let c = 0; c < row.length; c++) {
          const val = (row[c] || '').toString().trim();
          const lowerVal = val.toLowerCase();

          // Auto-detect Ticket ID from anywhere in row (e.g. REC-ILM-WEAE)
          if (!foundTicketId && val.toUpperCase().startsWith('REC-ILM-')) {
            foundTicketId = val;
          }

          if (lowerVal && (lowerVal === utrQuery || lowerVal.indexOf(utrQuery) > -1 || (utrQuery.length >= 5 && utrQuery.indexOf(lowerVal) > -1))) {
            isMatch = true;
          }
        }

        if (isMatch) {
          // Status is verified if Status column says "verified" OR if Ticket Email Sent column says "yes"
          const statusVal = (row[map.colStatus - 1] || '').toString().trim().toLowerCase();
          const emailSentVal = (row[map.colEmailSent - 1] || '').toString().trim().toLowerCase();
          const isVerified = (statusVal === 'verified' || statusVal === 'confirmed' || statusVal === 'approved' || emailSentVal.startsWith('yes'));

          const cleanTicketId = foundTicketId || row[map.colTicketId - 1] || ('REC-ILM-' + (row[map.colUtr - 1] ? row[map.colUtr - 1].toString().slice(-6).toUpperCase() : 'PASS'));
          
          return ContentService.createTextOutput(JSON.stringify({
            success: true,
            found: true,
            status: isVerified ? 'Verified' : 'Pending Verification',
            ticketId: cleanTicketId,
            name: row[4] || '',
            passCategory: row[1] || 'Individual Pass',
            teamName: row[2] || '',
            totalAmount: row[3] || '₹799',
            email: row[10] || '',
            utr: row[map.colUtr - 1] || '',
            qrCodeUrl: 'https://quickchart.io/qr?text=ILLUMINATE-2026-TICKET-' + encodeURIComponent(cleanTicketId) + '&size=260&ecLevel=H'
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        found: false,
        status: 'Pending Verification',
        message: 'UTR / Ticket reference not found'
      })).setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: err.message
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Default health check
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Illuminate 2026 Registration Web App & Email Engine is active and listening.',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * POST Handler — Receives registration data from frontend
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  
  try {
    lock.waitLock(30000);

    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'No post data received'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create tab and headers if not found
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      initializeSheetHeaders(sheet);
    } else {
      if (sheet.getLastRow() === 0) {
        initializeSheetHeaders(sheet);
      }
    }

    const map = getSheetColumnMap(sheet);

    // Process Payment Screenshot Upload to Google Drive
    let receiptUrl = '';
    if (data.screenshotData) {
      try {
        receiptUrl = saveScreenshotToDrive(
          data.screenshotData,
          data.screenshotName || ('receipt_' + (data.utr || Date.now()) + '.jpg'),
          data.screenshotType || 'image/jpeg',
          data.name || 'Delegate'
        );
      } catch (driveErr) {
        receiptUrl = 'Drive upload error: ' + driveErr.message;
      }
    }

    const isGroup = (data.registrationType && data.registrationType.toLowerCase().indexOf('squad') !== -1) ||
                    (data.members && data.members.length === 4) ||
                    (data.totalAmount === 2796);

    const passCategory = isGroup ? 'Squad Pass (Fixed 4 Members)' : 'Individual Pass';
    const totalFee = isGroup ? '₹2,796' : '₹799';
    const teamName = data.teamName || (isGroup ? 'Squad' : 'N/A');

    // Extract members
    const m1 = (data.members && data.members[0]) ? data.members[0] : {
      name: data.name || data.member1_name || '',
      roll: data.roll || data.member1_roll || '',
      college: data.college || data.member1_college || '',
      branch: data.branch || data.member1_branch || '',
      year: data.year || data.member1_year || '',
      phone: data.phone || data.member1_phone || '',
      email: data.email || data.member1_email || '',
    };

    const m2 = (data.members && data.members[1]) ? data.members[1] : {
      name: data.member2_name || '',
      roll: data.member2_roll || '',
      college: data.member2_college || '',
      branch: data.member2_branch || '',
      year: data.member2_year || '',
      phone: data.member2_phone || '',
      email: data.member2_email || '',
    };

    const m3 = (data.members && data.members[2]) ? data.members[2] : {
      name: data.member3_name || '',
      roll: data.member3_roll || '',
      college: data.member3_college || '',
      branch: data.member3_branch || '',
      year: data.member3_year || '',
      phone: data.member3_phone || '',
      email: data.member3_email || '',
    };

    const m4 = (data.members && data.members[3]) ? data.members[3] : {
      name: data.member4_name || '',
      roll: data.member4_roll || '',
      college: data.member4_college || '',
      branch: data.member4_branch || '',
      year: data.member4_year || '',
      phone: data.member4_phone || '',
      email: data.member4_email || '',
    };

    const formattedTimestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone() || 'Asia/Kolkata',
      'yyyy-MM-dd HH:mm:ss'
    );

    const cleanUtr = (data.utr || '').toString().trim();
    const ticketId = 'REC-ILM-' + (cleanUtr.length >= 6 ? cleanUtr.slice(-6).toUpperCase() : Math.floor(100000 + Math.random() * 900000));

    // Exactly matches the 36 user headers + col 37 (Ticket ID) + col 38 (Ticket Email Sent)
    const rowData = [
      formattedTimestamp,
      passCategory,
      teamName,
      totalFee,
      // Lead (M1) - cols 5 to 11
      m1.name || '',
      m1.roll || '',
      m1.college || '',
      m1.branch || '',
      m1.year || '',
      m1.phone || '',
      m1.email || '',
      data.location || '', // col 12: City / Location (Nearest Bus Stop)
      // M2 - cols 13 to 19
      isGroup ? (m2.name || '') : '',
      isGroup ? (m2.roll || '') : '',
      isGroup ? (m2.college || '') : '',
      isGroup ? (m2.branch || '') : '',
      isGroup ? (m2.year || '') : '',
      isGroup ? (m2.phone || '') : '',
      isGroup ? (m2.email || '') : '',
      // M3 - cols 20 to 26
      isGroup ? (m3.name || '') : '',
      isGroup ? (m3.roll || '') : '',
      isGroup ? (m3.college || '') : '',
      isGroup ? (m3.branch || '') : '',
      isGroup ? (m3.year || '') : '',
      isGroup ? (m3.phone || '') : '',
      isGroup ? (m3.email || '') : '',
      // M4 - cols 27 to 33
      isGroup ? (m4.name || '') : '',
      isGroup ? (m4.roll || '') : '',
      isGroup ? (m4.college || '') : '',
      isGroup ? (m4.branch || '') : '',
      isGroup ? (m4.year || '') : '',
      isGroup ? (m4.phone || '') : '',
      isGroup ? (m4.email || '') : '',
      // Payment & Verification - cols 34 to 36 (UTR, Screenshot, Status)
      cleanUtr,
      receiptUrl || 'No screenshot provided',
      'Pending Verification',
      // Auto columns - col 37 (AK: Ticket ID) & col 38 (AL: Ticket Email Sent)
      ticketId,
      'No'
    ];

    sheet.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Registration logged successfully in pending state',
      ticketId: ticketId,
      receiptUrl: receiptUrl
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Saves base64 screenshot into dedicated Drive folder
 */
function saveScreenshotToDrive(base64Data, filename, mimeType, applicantName) {
  let folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  let folder;
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }

  let cleanBase64 = base64Data;
  if (cleanBase64.indexOf(',') > -1) {
    cleanBase64 = cleanBase64.split(',')[1];
  }

  const decodedBytes = Utilities.base64Decode(cleanBase64);
  const blob = Utilities.newBlob(decodedBytes, mimeType || 'image/jpeg', applicantName + '_' + filename);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return file.getUrl();
}

/**
 * Creates sheet headers
 */
function initializeSheetHeaders(sheet) {
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#3b0764'); // Deep purple
  headerRange.setFontColor('#ffffff');
  headerRange.setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
}

/**
 * ============================================================================
 * EMAIL AUTOMATION ENGINE
 * ============================================================================
 */

/**
 * Trigger handler for Google Sheets edits
 * Triggers on:
 *   1. Editing Column AJ (Status) to "Verified"
 *   2. Editing Column AL (Ticket Email Sent) to "No" while Status is "Verified" (for easy testing!)
 */
function handleStatusEdit(e) {
  try {
    if (!e || !e.range) return;
    const sheet = e.range.getSheet();
    if (sheet.getName() !== SHEET_NAME) return;

    const row = e.range.getRow();
    const col = e.range.getColumn();

    const map = getSheetColumnMap(sheet);

    // Case 1: Status column edited (Column AJ / 36)
    if (col === map.colStatus && row > 1) {
      const statusValue = (e.range.getValue() || '').toString().trim().toLowerCase();
      if (statusValue === 'verified' || statusValue === 'confirmed' || statusValue === 'approved') {
        sendVerifiedTicketForRow(sheet, row, map);
      }
    }

    // Case 2: Ticket Email Sent column edited to "no" (Column AL / 38)
    if (col === map.colEmailSent && row > 1) {
      const emailSentVal = (e.range.getValue() || '').toString().trim().toLowerCase();
      if (emailSentVal === 'no' || emailSentVal === '') {
        const currentStatus = (sheet.getRange(row, map.colStatus).getValue() || '').toString().trim().toLowerCase();
        if (currentStatus === 'verified' || currentStatus === 'confirmed' || currentStatus === 'approved') {
          sendVerifiedTicketForRow(sheet, row, map);
        }
      }
    }
  } catch (err) {
    Logger.log('handleStatusEdit error: ' + err.message);
  }
}

/**
 * Processes ALL rows where Status is "Verified" but ticket email hasn't been sent yet.
 * Can be run from the "Illuminate Admin" menu or as a scheduled time trigger!
 */
function processAllVerifiedTickets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Error: "' + SHEET_NAME + '" tab not found.');
    return;
  }

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    SpreadsheetApp.getUi().alert('No delegate registrations found yet.');
    return;
  }

  const map = getSheetColumnMap(sheet);
  const data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
  let countSent = 0;

  for (let i = 0; i < data.length; i++) {
    const rowNum = i + 2;
    const rowValues = data[i];
    const status = (rowValues[map.colStatus - 1] || '').toString().trim().toLowerCase();
    const emailSent = (rowValues[map.colEmailSent - 1] || '').toString().trim().toLowerCase();

    if ((status === 'verified' || status === 'confirmed' || status === 'approved') && !emailSent.startsWith('yes')) {
      const success = sendVerifiedTicketForRow(sheet, rowNum, map);
      if (success) countSent++;
    }
  }

  SpreadsheetApp.getUi().alert('✅ Process Complete!\nSuccessfully dispatched verified ticket emails to ' + countSent + ' registration(s).');
}

/**
 * Sends verified ticket emails to all delegate members in a given row
 */
function sendVerifiedTicketForRow(sheet, rowNum, map) {
  try {
    if (!map) map = getSheetColumnMap(sheet);
    const row = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];

    // STRICT DUPLICATE GUARD: If already sent, NEVER send again!
    const emailAlreadySent = (row[map.colEmailSent - 1] || '').toString().trim().toLowerCase();
    if (emailAlreadySent.startsWith('yes')) {
      Logger.log('Row ' + rowNum + ' already has Ticket Email Sent = Yes. Skipping duplicate send.');
      return false;
    }

    const passCategory = row[1] || 'Individual Pass';
    const teamName = row[2] || '';
    const totalFee = row[3] || '₹799';
    const utr = row[map.colUtr - 1] || 'Verified';
    let ticketId = row[map.colTicketId - 1];

    if (!ticketId || ticketId === '') {
      ticketId = 'REC-ILM-' + (utr.toString().length >= 6 ? utr.toString().slice(-6).toUpperCase() : Math.floor(100000 + Math.random() * 900000));
      sheet.getRange(rowNum, map.colTicketId).setValue(ticketId);
    }

    const isSquad = passCategory.toLowerCase().indexOf('squad') !== -1;

    // Collect members (Cols: Lead Email is col 11/idx 10, M2 Email is col 19/idx 18, M3 Email is col 26/idx 25, M4 Email is col 33/idx 32)
    const members = [];
    // M1
    if (row[10] && row[10].indexOf('@') > -1) {
      members.push({ name: row[4], roll: row[5], college: row[6], branch: row[7], year: row[8], phone: row[9], email: row[10] });
    }
    // M2
    if (row[18] && row[18].indexOf('@') > -1) {
      members.push({ name: row[12], roll: row[13], college: row[14], branch: row[15], year: row[16], phone: row[17], email: row[18] });
    }
    // M3
    if (row[25] && row[25].indexOf('@') > -1) {
      members.push({ name: row[19], roll: row[20], college: row[21], branch: row[22], year: row[23], phone: row[24], email: row[25] });
    }
    // M4
    if (row[32] && row[32].indexOf('@') > -1) {
      members.push({ name: row[26], roll: row[27], college: row[28], branch: row[29], year: row[30], phone: row[31], email: row[32] });
    }

    if (members.length === 0) {
      Logger.log('No valid email found in row ' + rowNum);
      return false;
    }

    // Dynamic QR code for entry verification
    const qrCodeUrl = 'https://quickchart.io/qr?text=ILLUMINATE-2026-TICKET-' + encodeURIComponent(ticketId) + '&size=260&ecLevel=H';

    // Send email to each member (solo = 1, squad = 4)
    for (let m = 0; m < members.length; m++) {
      const member = members[m];
      const memberRole = isSquad ? (m === 0 ? 'Squad Leader' : ('Squad Member ' + (m + 1))) : 'Individual Delegate';
      const emailBody = createTicketEmailHtml({
        recipientName: member.name || 'Delegate',
        recipientEmail: member.email,
        memberRole: memberRole,
        ticketId: ticketId + (isSquad ? ('-M' + (m + 1)) : ''),
        passCategory: passCategory,
        teamName: teamName,
        totalFee: totalFee,
        utr: utr,
        college: member.college || 'Raghu Engineering College',
        branch: member.branch || 'Engineering',
        year: member.year || 'Student',
        roll: member.roll || 'N/A',
        qrCodeUrl: qrCodeUrl,
        allMembers: members,
        isSquad: isSquad
      });

      MailApp.sendEmail({
        to: member.email.trim(),
        subject: '🎫 Confirmed Ticket & Entry Pass: ILLUMINATE 2026 [' + ticketId + ']',
        htmlBody: emailBody,
        name: 'ILLUMINATE 2026 Desk (Raghu Engg College x E-Cell IIT Bombay)'
      });
    }

    // Mark email as sent with timestamp in Column AL (38)
    const nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Asia/Kolkata', 'yyyy-MM-dd HH:mm');
    sheet.getRange(rowNum, map.colEmailSent).setValue('Yes (' + nowStr + ')');
    sheet.getRange(rowNum, map.colStatus).setValue('Verified');

    return true;
  } catch (err) {
    Logger.log('Error sending ticket for row ' + rowNum + ': ' + err.message);
    return false;
  }
}

/**
 * Builds high-converting HTML Ticket Email Template
 */
function createTicketEmailHtml(params) {
  const membersListHtml = params.isSquad ? `
    <div style="background-color: #170d36; border: 1px solid #4c1d95; border-radius: 10px; padding: 12px; margin-top: 15px;">
      <div style="font-size: 11px; font-weight: bold; color: #c084fc; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Registered Squad Members (4)</div>
      ${params.allMembers.map((mem, idx) => `
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #e2e8f0; margin-bottom: 4px; padding-bottom: 4px; border-bottom: 1px solid #2e1065;">
          <span><strong>M${idx + 1}:</strong> ${mem.name}</span>
          <span style="color: #94a3b8; font-family: monospace;">${mem.roll}</span>
        </div>
      `).join('')}
    </div>
  ` : '';

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ILLUMINATE 2026 Ticket Confirmed</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #060212; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #060212; padding: 30px 10px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background: linear-gradient(180deg, #12082b 0%, #0a0319 100%); border: 1px solid #6b21a8; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(107, 33, 168, 0.4);">
            
            <!-- Brand Banner Header -->
            <tr>
              <td style="padding: 24px 28px; background: linear-gradient(90deg, #3b0764 0%, #1e1b4b 100%); border-bottom: 2px solid #9333ea; text-align: center;">
                <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #d8b4fe; font-weight: 700;">
                  Raghu Engineering College (Autonomous) &bull; E-Cell IIT Bombay
                </div>
                <h1 style="margin: 8px 0 0 0; font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: 1px;">
                  ILLUMINATE 2026
                </h1>
                <div style="margin-top: 4px; font-size: 12px; color: #e9d5ff;">
                  Official Delegate Entry Ticket
                </div>
              </td>
            </tr>

            <!-- Status Banner -->
            <tr>
              <td style="padding: 16px 28px; background-color: #064e3b; text-align: center; border-bottom: 1px solid #059669;">
                <span style="font-size: 12px; font-weight: 800; color: #6ee7b7; letter-spacing: 1px; text-transform: uppercase;">
                  &#10004; PAYMENT VERIFIED &amp; TICKET CONFIRMED
                </span>
              </td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td style="padding: 28px;">
                <p style="margin: 0 0 16px 0; font-size: 15px; color: #e2e8f0; line-height: 1.5;">
                  Dear <strong>${params.recipientName}</strong>,
                </p>
                <p style="margin: 0 0 20px 0; font-size: 13px; color: #cbd5e1; line-height: 1.6;">
                  Congratulations! Your registration payment for <strong>ILLUMINATE 2026</strong> has been verified by the organizing desk. Your official ticket pass and campus access QR code have been activated below.
                </p>

                <!-- TICKET CARD -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0c0521; border: 2px solid #7c3aed; border-radius: 14px; overflow: hidden; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 18px 20px; border-bottom: 1px dashed #6b21a8;">
                      <table width="100%">
                        <tr>
                          <td>
                            <div style="font-size: 10px; color: #a855f7; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Ticket Reference ID</div>
                            <div style="font-size: 17px; font-weight: 900; color: #ffffff; font-family: monospace;">${params.ticketId}</div>
                          </td>
                          <td align="right">
                            <span style="background-color: #065f46; color: #34d399; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 20px; border: 1px solid #059669;">
                              VERIFIED
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Delegate & Event Details -->
                  <tr>
                    <td style="padding: 20px;">
                      <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 13px;">
                        <tr>
                          <td style="color: #94a3b8; width: 40%;">Delegate Name:</td>
                          <td style="color: #ffffff; font-weight: bold;">${params.recipientName}</td>
                        </tr>
                        <tr>
                          <td style="color: #94a3b8;">Roll Number:</td>
                          <td style="color: #ffffff; font-family: monospace;">${params.roll}</td>
                        </tr>
                        <tr>
                          <td style="color: #94a3b8;">Pass Category:</td>
                          <td style="color: #34d399; font-weight: bold;">${params.passCategory}</td>
                        </tr>
                        ${params.teamName ? `
                        <tr>
                          <td style="color: #94a3b8;">Squad Name:</td>
                          <td style="color: #facc15; font-weight: bold;">${params.teamName}</td>
                        </tr>
                        ` : ''}
                        <tr>
                          <td style="color: #94a3b8;">Role / Designation:</td>
                          <td style="color: #c084fc;">${params.memberRole}</td>
                        </tr>
                        <tr>
                          <td style="color: #94a3b8;">College:</td>
                          <td style="color: #e2e8f0;">${params.college}</td>
                        </tr>
                        <tr>
                          <td style="color: #94a3b8;">Verified UTR Ref:</td>
                          <td style="color: #d8b4fe; font-family: monospace;">${params.utr}</td>
                        </tr>
                        <tr>
                          <td style="color: #94a3b8;">Event Date &amp; Time:</td>
                          <td style="color: #ffffff; font-weight: bold;">October 13, 2026 &bull; 09:30 AM &ndash; 04:00 PM</td>
                        </tr>
                        <tr>
                          <td style="color: #94a3b8;">Campus Venue:</td>
                          <td style="color: #ffffff;">Raghu Engineering College (Autonomous), Visakhapatnam</td>
                        </tr>
                      </table>

                      ${membersListHtml}

                      <!-- QR Code Section -->
                      <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px dashed #6b21a8;">
                        <img src="${params.qrCodeUrl}" alt="Entry QR Code" width="180" height="180" style="border-radius: 12px; background: white; padding: 10px; border: 3px solid #9333ea; display: inline-block;" />
                        <div style="font-size: 11px; color: #94a3b8; font-family: monospace; margin-top: 8px;">
                          ${params.ticketId}
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- WhatsApp Community CTA Button -->
                <div style="text-align: center; margin: 25px 0 15px 0;">
                  <a href="https://chat.whatsapp.com/LtSa3ftDjZT7jmwGwK4nUM" target="_blank" style="background-color: #25D366; color: #022c22; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);">
                    &#128172; Join Official Delegates WhatsApp Group
                  </a>
                  <div style="font-size: 11px; color: #94a3b8; margin-top: 8px;">
                    Stay updated with schedule alerts, mentor sessions, and live venue guidance.
                  </div>
                </div>

                <!-- Guidelines Notice -->
                <div style="background-color: #150a30; border-left: 4px solid #a855f7; padding: 12px 14px; border-radius: 6px; font-size: 11px; color: #cbd5e1; line-height: 1.5; margin-top: 20px;">
                  <strong>Important Instructions:</strong><br>
                  &bull; Please carry your official College ID card along with this digital ticket.<br>
                  &bull; For any queries, reply directly to this email or contact the E-Cell coordinators.
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 20px; background-color: #070214; text-align: center; border-top: 1px solid #3b0764; font-size: 11px; color: #64748b;">
                &copy; 2026 ILLUMINATE &bull; NEC Team, Entrepreneurship Cell<br>
                Raghu Engineering College (Autonomous), Visakhapatnam &times; E-Cell IIT Bombay
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * Installs an edit trigger programmatically so changes to the Status column
 * immediately fire handleStatusEdit without needing manual Apps Script config!
 */
function installEditTrigger() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const triggers = ScriptApp.getUserTriggers(ss);
  
  // Remove duplicate triggers if any
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'handleStatusEdit') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  // Create new installable onEdit trigger
  ScriptApp.newTrigger('handleStatusEdit')
    .forSpreadsheet(ss)
    .onEdit()
    .create();

  SpreadsheetApp.getUi().alert(
    '🎉 Automated Verification Trigger Installed!\n\n' +
    'Whenever you type "Verified" into Column AJ (Status) of any registration row, ' +
    'the confirmed ticket and entry QR code will be emailed immediately to all members!'
  );
}
