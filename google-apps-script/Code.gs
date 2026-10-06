/**
 * ============================================================================
 * ILLUMINATE 2026 — Official Google Apps Script Web App
 * Handles:
 *  - Individual Registrations (₹799)
 *  - Squad Registrations (Fixed 4 Members, ₹699/head = ₹2,796 total)
 *  - Automatic Google Drive payment proof upload (clickable preview link)
 *  - Auto-generated sheet headers & formatted columns
 * ============================================================================
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet.
 * 2. Click "Extensions" > "Apps Script".
 * 3. Replace all code in "Code.gs" with this entire script.
 * 4. Click "Deploy" > "New deployment".
 * 5. Select type: "Web app".
 * 6. Execute as: "Me".
 * 7. Who has access: "Anyone" (CRITICAL: must be "Anyone", NOT "Only myself").
 * 8. Click "Deploy", authorize access, and copy the Web App URL (ends with /exec).
 * 9. Paste the URL into your project's .env:
 *    VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/.../exec
 */

// Name of the sheet tab to store registrations
const SHEET_NAME = 'Registrations';

// Name of Google Drive folder to store uploaded payment screenshot proofs
const DRIVE_FOLDER_NAME = 'Illuminate 2026 Payment Proofs';

/**
 * Standard Header Columns
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
  'Status'
];

/**
 * GET Handler — Quick health check to test if web app is live
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Illuminate 2026 Registration Web App is active and listening.',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * POST Handler — Receives registration data from frontend or test script
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  
  try {
    // Wait up to 30 seconds for concurrent requests
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
      // If sheet exists but is completely empty, add headers
      if (sheet.getLastRow() === 0) {
        initializeSheetHeaders(sheet);
      }
    }

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

    const rowData = [
      formattedTimestamp,
      passCategory,
      teamName,
      totalFee,
      // Lead (M1)
      m1.name || '',
      m1.roll || '',
      m1.college || '',
      m1.branch || '',
      m1.year || '',
      m1.phone || '',
      m1.email || '',
      data.location || '',
      // M2
      isGroup ? (m2.name || '') : '',
      isGroup ? (m2.roll || '') : '',
      isGroup ? (m2.college || '') : '',
      isGroup ? (m2.branch || '') : '',
      isGroup ? (m2.year || '') : '',
      isGroup ? (m2.phone || '') : '',
      isGroup ? (m2.email || '') : '',
      // M3
      isGroup ? (m3.name || '') : '',
      isGroup ? (m3.roll || '') : '',
      isGroup ? (m3.college || '') : '',
      isGroup ? (m3.branch || '') : '',
      isGroup ? (m3.year || '') : '',
      isGroup ? (m3.phone || '') : '',
      isGroup ? (m3.email || '') : '',
      // M4
      isGroup ? (m4.name || '') : '',
      isGroup ? (m4.roll || '') : '',
      isGroup ? (m4.college || '') : '',
      isGroup ? (m4.branch || '') : '',
      isGroup ? (m4.year || '') : '',
      isGroup ? (m4.phone || '') : '',
      isGroup ? (m4.email || '') : '',
      // UTR, Proof, Status
      data.utr || '',
      receiptUrl || 'No screenshot provided',
      'Pending Verification'
    ];

    sheet.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Registration logged successfully',
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
 * Creates and formats header row with professional styling
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
 * Saves base64 screenshot into a dedicated Drive folder and returns the file link
 */
function saveScreenshotToDrive(base64Data, filename, mimeType, applicantName) {
  // Find or create target folder
  let folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  let folder;
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }

  // Strip Base64 header prefix if present (e.g. data:image/jpeg;base64,...)
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
 * Built-in test function to verify sheet connection directly from Apps Script editor
 */
function testSubmission() {
  const dummyEvent = {
    postData: {
      contents: JSON.stringify({
        registrationType: 'group',
        totalAmount: 2796,
        teamName: 'Demo Squad',
        name: 'Rahul Sharma',
        roll: '21981A0501',
        college: 'Raghu Engineering College',
        branch: 'CSE',
        year: '3rd Year',
        phone: '9876543210',
        email: 'rahul@test.com',
        location: 'Visakhapatnam',
        members: [
          { name: 'Rahul Sharma', roll: '21981A0501', college: 'REC', branch: 'CSE', year: '3rd Year', phone: '9876543210', email: 'rahul@test.com' },
          { name: 'Priya Verma', roll: '21981A0502', college: 'REC', branch: 'CSE', year: '3rd Year', phone: '9876543211', email: 'priya@test.com' },
          { name: 'Aditya Kumar', roll: '21981A0503', college: 'REC', branch: 'ECE', year: '3rd Year', phone: '9876543212', email: 'aditya@test.com' },
          { name: 'Sneha Reddy', roll: '21981A0504', college: 'REC', branch: 'CSM', year: '3rd Year', phone: '9876543213', email: 'sneha@test.com' },
        ],
        utr: 'TEST12345678',
        screenshotName: 'test.jpg',
        screenshotType: 'image/jpeg',
        screenshotData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
      })
    }
  };

  const response = doPost(dummyEvent);
  Logger.log(response.getContent());
}
