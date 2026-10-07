import { CONFIG } from '../config/environment';

/**
 * Converts a File object to a base64 Data URL (raw fallback)
 * @param {File} file
 * @returns {Promise<string>}
 */
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error('Failed to read screenshot file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Compresses an image file client-side using HTML5 Canvas before base64 conversion.
 * Reduces 3-8 MB mobile screenshots (especially on iOS/Android high-DPI screens) down
 * to ~80-160 KB JPEG without losing legibility of UTR numbers and transaction details.
 * Eliminates mobile timeout errors over slow 3G/4G connections.
 * 
 * @param {File} file
 * @param {number} maxWidth
 * @param {number} quality
 * @returns {Promise<string>}
 */
export const compressImageToDataURL = (file, maxWidth = 1280, quality = 0.72) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve('');
      return;
    }

    // If not an image or running without DOM, fallback
    if (!file.type || !file.type.startsWith('image/') || typeof document === 'undefined') {
      readFileAsDataURL(file).then(resolve).catch(() => resolve(''));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxWidth) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxWidth) / height);
              height = maxWidth;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target.result);
            return;
          }

          // Fill white backdrop in case source was a transparent PNG
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } catch (canvasErr) {
          console.warn('Canvas compression fallback:', canvasErr);
          resolve(e.target.result);
        }
      };

      img.onerror = () => {
        resolve(e.target.result);
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      readFileAsDataURL(file).then(resolve).catch(() => resolve(''));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Validates registration form details for both Individual and Group (4 members) modes
 * @param {Object} formData
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};

  if (formData.registrationType === 'group') {
    const members = formData.members || [];
    errors.members = [{}, {}, {}, {}];
    let hasGroupError = false;

    for (let i = 0; i < 4; i++) {
      const m = members[i] || {};
      const mErrors = {};
      const memberRole = i === 0 ? 'Team Leader' : `Member ${i + 1}`;

      if (!m.name?.trim()) mErrors.name = `${memberRole} Name is required.`;
      if (!m.roll?.trim()) mErrors.roll = 'Roll Number is required.';
      if (!m.college?.trim()) mErrors.college = 'College name is required.';
      if (!m.branch?.trim()) mErrors.branch = 'Select Branch.';
      if (!m.year?.trim()) mErrors.year = 'Select Year.';
      
      if (!m.phone?.trim()) {
        mErrors.phone = 'Mobile number is required.';
      } else if (!/^[0-9]{10}$/.test(m.phone.replace(/[\s-]/g, ''))) {
        mErrors.phone = 'Enter a valid 10-digit number.';
      }

      if (!m.email?.trim()) {
        mErrors.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email.trim())) {
        mErrors.email = 'Enter a valid email.';
      }

      if (Object.keys(mErrors).length > 0) {
        errors.members[i] = mErrors;
        hasGroupError = true;
      }
    }

    if (!hasGroupError) {
      delete errors.members;
    }
  } else {
    // Individual Delegate Validation
    if (!formData.name?.trim()) errors.name = 'Full Name is required.';
    if (!formData.roll?.trim()) errors.roll = 'Roll Number is required.';
    if (!formData.college?.trim()) errors.college = 'College name is required.';
    if (!formData.branch?.trim()) errors.branch = 'Please select your Branch / Department.';
    if (!formData.year?.trim()) errors.year = 'Please select your Year of Study.';
    
    if (!formData.phone?.trim()) {
      errors.phone = 'Mobile / WhatsApp number is required.';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      errors.phone = 'Enter a valid 10-digit mobile number.';
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates payment proof
 * @param {Object} proofData
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validatePaymentProof = (proofData) => {
  const errors = {};

  if (!proofData.utr?.trim()) {
    errors.utr = 'Transaction Reference / UTR number is required.';
  } else if (proofData.utr.trim().length < 6) {
    errors.utr = 'UTR number must be at least 6 characters.';
  }

  if (!proofData.screenshot) {
    errors.screenshot = 'Payment screenshot proof is required.';
  } else if (proofData.screenshot.size > 5 * 1024 * 1024) {
    errors.screenshot = 'File size exceeds 5 MB maximum limit.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Submits registration payload to the configured Google Apps Script Web App.
 * Data is ONLY sent when user completes Step 3 (after payment UTR and screenshot upload).
 * 
 * @param {Object} fullData
 * @returns {Promise<{ success: boolean, error?: string, code?: string, data?: Object }>}
 */
export const submitRegistration = async (fullData) => {
  // Check offline status
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return {
      success: false,
      code: 'OFFLINE',
      error: 'No active internet connection. Please check your network and retry.',
    };
  }

  try {
    // Convert screenshot file to compressed Base64 Data URL (under 150KB for rapid upload)
    let screenshotData = '';
    let screenshotName = '';
    let screenshotType = 'image/jpeg';

    if (fullData.screenshot) {
      screenshotData = await compressImageToDataURL(fullData.screenshot);
      screenshotName = fullData.screenshot.name
        ? fullData.screenshot.name.replace(/\.[^/.]+$/, '.jpg')
        : 'payment-proof.jpg';
    }

    const isGroup = fullData.registrationType === 'group';
    const members = fullData.members || [];
    const lead = isGroup ? (members[0] || {}) : fullData;

    // Build comprehensive aggregated payload (supports both structured & flat sheet columns)
    const payload = {
      registrationType: isGroup ? 'Squad (4 Members)' : 'Individual',
      totalAmount: isGroup ? 2796 : 799,
      teamName: isGroup ? (fullData.teamName?.trim() || '') : '',
      // Primary / Lead delegate
      name: (lead.name || fullData.name || '').trim(),
      roll: (lead.roll || fullData.roll || '').trim(),
      college: (lead.college || fullData.college || '').trim(),
      branch: lead.branch || fullData.branch || '',
      year: lead.year || fullData.year || '',
      location: (fullData.location || '').trim(),
      phone: (lead.phone || fullData.phone || '').trim(),
      email: (lead.email || fullData.email || '').trim(),
      
      // All 4 squad members array
      members: isGroup ? members : [
        {
          name: fullData.name?.trim() || '',
          roll: fullData.roll?.trim() || '',
          college: fullData.college?.trim() || '',
          branch: fullData.branch || '',
          year: fullData.year || '',
          phone: fullData.phone?.trim() || '',
          email: fullData.email?.trim() || '',
        }
      ],

      // Flat columns for simple spreadsheet rows
      member1_name: (lead.name || fullData.name || '').trim(),
      member1_roll: (lead.roll || fullData.roll || '').trim(),
      member1_college: (lead.college || fullData.college || '').trim(),
      member1_branch: lead.branch || fullData.branch || '',
      member1_year: lead.year || fullData.year || '',
      member1_phone: (lead.phone || fullData.phone || '').trim(),
      member1_email: (lead.email || fullData.email || '').trim(),

      member2_name: isGroup ? (members[1]?.name || '').trim() : '',
      member2_roll: isGroup ? (members[1]?.roll || '').trim() : '',
      member2_college: isGroup ? (members[1]?.college || '').trim() : '',
      member2_branch: isGroup ? (members[1]?.branch || '') : '',
      member2_year: isGroup ? (members[1]?.year || '') : '',
      member2_phone: isGroup ? (members[1]?.phone || '').trim() : '',
      member2_email: isGroup ? (members[1]?.email || '').trim() : '',

      member3_name: isGroup ? (members[2]?.name || '').trim() : '',
      member3_roll: isGroup ? (members[2]?.roll || '').trim() : '',
      member3_college: isGroup ? (members[2]?.college || '').trim() : '',
      member3_branch: isGroup ? (members[2]?.branch || '') : '',
      member3_year: isGroup ? (members[2]?.year || '') : '',
      member3_phone: isGroup ? (members[2]?.phone || '').trim() : '',
      member3_email: isGroup ? (members[2]?.email || '').trim() : '',

      member4_name: isGroup ? (members[3]?.name || '').trim() : '',
      member4_roll: isGroup ? (members[3]?.roll || '').trim() : '',
      member4_college: isGroup ? (members[3]?.college || '').trim() : '',
      member4_branch: isGroup ? (members[3]?.branch || '') : '',
      member4_year: isGroup ? (members[3]?.year || '') : '',
      member4_phone: isGroup ? (members[3]?.phone || '').trim() : '',
      member4_email: isGroup ? (members[3]?.email || '').trim() : '',

      utr: fullData.utr ? fullData.utr.trim() : '',
      screenshotName,
      screenshotType,
      screenshotData,
      timestamp: new Date().toISOString(),
    };

    const endpoint = CONFIG.GOOGLE_SCRIPT_URL;

    // If Google Apps Script URL has not been provided in .env yet:
    // Run in friendly Preview / Local Mode so the user can test the entire flow!
    if (!endpoint || !endpoint.trim()) {
      console.log(
        '%c[Illuminate Registration — Local Preview Mode]',
        'color: #a855f7; font-weight: bold; font-size: 13px;'
      );
      console.log('✅ Aggregated payload ready to transmit to Google Apps Script:', {
        ...payload,
        screenshotData: screenshotData ? `${screenshotData.substring(0, 60)}... [${(screenshotData.length / 1024).toFixed(1)} KB base64]` : 'none',
      });
      console.info('Tip: Add VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/.../exec in .env to transmit to Google Sheets directly.');

      // Simulate network roundtrip delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      return {
        success: true,
        data: {
          name: payload.name,
          utr: payload.utr,
          email: payload.email,
          registrationType: payload.registrationType,
          totalAmount: payload.totalAmount,
          isDemo: true,
        },
      };
    }

    // When Google Apps Script endpoint is configured: Transmit payload
    // Set 60-second timeout to accommodate slow 3G/4G connections and Google Apps Script cold starts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return {
        success: true,
        data: {
          name: payload.name,
          utr: payload.utr,
          email: payload.email,
          registrationType: payload.registrationType,
          totalAmount: payload.totalAmount,
          isDemo: false,
        },
      };
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return {
          success: false,
          code: 'TIMEOUT',
          error: 'The request took longer than 60s. Your entered details and screenshot have been preserved. Please verify your connection and tap Retry Submission.',
        };
      }
      throw fetchError;
    }
  } catch (err) {
    console.error('Registration service submission error:', err);
    return {
      success: false,
      code: 'NETWORK_ERROR',
      error: err.message || 'Failed to submit registration. Please try again.',
    };
  }
};

const STORAGE_KEY = 'illuminate_stored_ticket';

/**
 * Saves ticket registration details into browser's localStorage
 */
export const saveStoredTicket = (data) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...data,
        storedAt: new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.warn('Could not save ticket to localStorage:', err);
  }
};

/**
 * Retrieves stored ticket details from localStorage
 */
export const getStoredTicket = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    }
  } catch (err) {
    return null;
  }
  return null;
};

/**
 * Clears stored ticket details
 */
export const clearStoredTicket = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {}
};

/**
 * Queries Google Apps Script to check if the ticket has been marked "Verified" in the Google Sheet.
 * Supports checking by UTR, Ticket ID, or Delegate Email.
 * @param {string|Object} param
 * @param {Object} [extraOptions]
 * @returns {Promise<{ found: boolean, verified: boolean, status: string, ticketId?: string, data?: Object }>}
 */
export const checkTicketVerification = async (param, extraOptions = {}) => {
  const endpoint = CONFIG.GOOGLE_SCRIPT_URL;
  let utr = '';
  let ticketId = '';
  let email = '';

  if (typeof param === 'object' && param !== null) {
    utr = param.utr || '';
    ticketId = param.ticketId || '';
    email = param.email || '';
  } else {
    utr = (param || '').toString();
    ticketId = extraOptions.ticketId || '';
    email = extraOptions.email || '';
  }

  if (!endpoint || (!utr && !ticketId && !email)) {
    return {
      found: false,
      verified: false,
      status: 'Pending Verification',
      message: 'Endpoint or identifiers not provided'
    };
  }

  try {
    const separator = endpoint.includes('?') ? '&' : '?';
    const params = new URLSearchParams();
    if (utr) params.append('utr', utr);
    if (ticketId) params.append('ticketId', ticketId);
    if (email) params.append('email', email);
    params.append('_t', Date.now().toString());

    const checkUrl = `${endpoint}${separator}${params.toString()}`;
    const response = await fetch(checkUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    const result = await response.json();
    if (result && result.found) {
      const isVerified = (result.status === 'Verified' || (result.status || '').toLowerCase() === 'verified');
      return {
        found: true,
        verified: isVerified,
        status: isVerified ? 'Verified' : 'Pending Verification',
        ticketId: result.ticketId,
        data: result,
      };
    }

    return {
      found: false,
      verified: false,
      status: 'Pending Verification',
      message: result?.message || 'Reference not found yet'
    };
  } catch (err) {
    console.warn('Live verification check error:', err);
    return {
      found: false,
      verified: false,
      status: 'Pending Verification',
      error: err.message,
    };
  }
};

export default {
  readFileAsDataURL,
  compressImageToDataURL,
  validateRegistrationForm,
  validatePaymentProof,
  submitRegistration,
  saveStoredTicket,
  getStoredTicket,
  clearStoredTicket,
  checkTicketVerification,
};
