/**
 * ============================================================================
 * ILLUMINATE 2026 — Registration Testing Script
 * ============================================================================
 * Tests both:
 *  1. Individual Registration (₹799)
 *  2. Squad Registration (Fixed 4 Members, ₹699/head = ₹2,796)
 *
 * Usage:
 *   node scripts/test-registration.js
 *   node scripts/test-registration.js --mode=squad
 *   node scripts/test-registration.js --mode=individual
 *   node scripts/test-registration.js --dry-run
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Read Google Script URL from .env file
function getScriptUrl() {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_GOOGLE_SCRIPT_URL\s*=\s*(.+)/);
    if (match && match[1]) {
      return match[1].trim().replace(/^["']|["']$/g, '');
    }
  }
  return process.env.VITE_GOOGLE_SCRIPT_URL || '';
}

// 1x1 transparent PNG in base64 as dummy screenshot
const DUMMY_SCREENSHOT_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

// Mock Payload 1: Squad Registration (4 Members)
const mockSquadPayload = {
  registrationType: 'Squad (4 Members)',
  totalAmount: 2796,
  teamName: 'Cyber Pioneers Squad',
  name: 'Wasim Akram (Lead)',
  roll: '21981A0501',
  college: 'Raghu Engineering College',
  branch: 'CSE (Computer Science & Engineering)',
  year: '3rd Year',
  location: 'Visakhapatnam',
  phone: '9391183459',
  email: 'wasim.lead@example.com',
  members: [
    {
      name: 'Wasim Akram (Lead)',
      roll: '21981A0501',
      college: 'Raghu Engineering College',
      branch: 'CSE (Computer Science & Engineering)',
      year: '3rd Year',
      phone: '9391183459',
      email: 'wasim.lead@example.com'
    },
    {
      name: 'Priya Sharma',
      roll: '21981A0502',
      college: 'Raghu Engineering College',
      branch: 'CSD (Computer Science & Data Science)',
      year: '3rd Year',
      phone: '9876543211',
      email: 'priya.sharma@example.com'
    },
    {
      name: 'Aditya Varma',
      roll: '21981A0503',
      college: 'Raghu Engineering College',
      branch: 'CSM (Computer Science & AI/ML)',
      year: '3rd Year',
      phone: '9876543212',
      email: 'aditya.varma@example.com'
    },
    {
      name: 'Neha Reddy',
      roll: '21981A0504',
      college: 'Raghu Engineering College',
      branch: 'ECE (Electronics & Communication Engineering)',
      year: '3rd Year',
      phone: '9876543213',
      email: 'neha.reddy@example.com'
    }
  ],
  member1_name: 'Wasim Akram (Lead)',
  member1_roll: '21981A0501',
  member1_college: 'Raghu Engineering College',
  member1_branch: 'CSE',
  member1_year: '3rd Year',
  member1_phone: '9391183459',
  member1_email: 'wasim.lead@example.com',
  member2_name: 'Priya Sharma',
  member2_roll: '21981A0502',
  member2_college: 'Raghu Engineering College',
  member2_branch: 'CSD',
  member2_year: '3rd Year',
  member2_phone: '9876543211',
  member2_email: 'priya.sharma@example.com',
  member3_name: 'Aditya Varma',
  member3_roll: '21981A0503',
  member3_college: 'Raghu Engineering College',
  member3_branch: 'CSM',
  member3_year: '3rd Year',
  member3_phone: '9876543212',
  member3_email: 'aditya.varma@example.com',
  member4_name: 'Neha Reddy',
  member4_roll: '21981A0504',
  member4_college: 'Raghu Engineering College',
  member4_branch: 'ECE',
  member4_year: '3rd Year',
  member4_phone: '9876543213',
  member4_email: 'neha.reddy@example.com',
  utr: 'TEST-SQUAD-' + Math.floor(100000000000 + Math.random() * 900000000000),
  screenshotName: 'squad-payment-proof.png',
  screenshotType: 'image/png',
  screenshotData: DUMMY_SCREENSHOT_BASE64,
  timestamp: new Date().toISOString()
};

// Mock Payload 2: Individual Registration (1 Member)
const mockSoloPayload = {
  registrationType: 'Individual',
  totalAmount: 799,
  teamName: '',
  name: 'Kavya Patel',
  roll: '22981A0410',
  college: 'Raghu Engineering College',
  branch: 'CSM (Computer Science & AI/ML)',
  year: '2nd Year',
  location: 'Visakhapatnam',
  phone: '9123456789',
  email: 'kavya.patel@example.com',
  member1_name: 'Kavya Patel',
  member1_roll: '22981A0410',
  member1_college: 'Raghu Engineering College',
  member1_branch: 'CSM',
  member1_year: '2nd Year',
  member1_phone: '9123456789',
  member1_email: 'kavya.patel@example.com',
  utr: 'TEST-SOLO-' + Math.floor(100000000000 + Math.random() * 900000000000),
  screenshotName: 'solo-payment-proof.png',
  screenshotType: 'image/png',
  screenshotData: DUMMY_SCREENSHOT_BASE64,
  timestamp: new Date().toISOString()
};

async function runTest() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const targetMode = args.find(a => a.startsWith('--mode='))?.split('=')[1] || 'both';

  const scriptUrl = getScriptUrl();

  console.log('\n======================================================');
  console.log('   🚀 ILLUMINATE 2026 REGISTRATION FLOW TEST HARNESS');
  console.log('======================================================');
  console.log(`📡 Google Apps Script URL: ${scriptUrl ? scriptUrl : '⚠️ NOT FOUND IN .env'}`);
  console.log(`🧪 Execution Mode: ${targetMode.toUpperCase()}`);
  console.log(`⚡ Dry Run: ${isDryRun ? 'YES (Simulated)' : 'NO (Live Network Transmission)'}\n`);

  const tests = [];
  if (targetMode === 'both' || targetMode === 'squad') {
    tests.push({ name: 'Squad Registration (4 Members • ₹2,796)', payload: mockSquadPayload });
  }
  if (targetMode === 'both' || targetMode === 'individual') {
    tests.push({ name: 'Individual Registration (1 Member • ₹799)', payload: mockSoloPayload });
  }

  for (const t of tests) {
    console.log(`\n------------------------------------------------------`);
    console.log(`▶️ Testing: ${t.name}`);
    console.log(`------------------------------------------------------`);
    console.log(`📦 Payload Summary:`);
    console.log(`   • Registration Type : ${t.payload.registrationType}`);
    console.log(`   • Total Fee         : ₹${t.payload.totalAmount}`);
    console.log(`   • Lead Name         : ${t.payload.name}`);
    console.log(`   • Email             : ${t.payload.email}`);
    console.log(`   • Phone             : ${t.payload.phone}`);
    console.log(`   • UTR Reference     : ${t.payload.utr}`);
    if (t.payload.members) {
      console.log(`   • Squad Members (${t.payload.members.length}):`);
      t.payload.members.forEach((m, i) => {
        console.log(`      [${i + 1}] ${m.name} | ${m.roll} | ${m.branch}`);
      });
    }

    if (isDryRun || !scriptUrl) {
      console.log(`\n✅ [DRY RUN] Payload validated successfully. (No network request made)`);
      continue;
    }

    console.log(`\n🌐 Transmitting POST request to Google Apps Script...`);
    const startTime = Date.now();

    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(t.payload)
      });

      const elapsedMs = Date.now() - startTime;
      const text = await response.text();

      console.log(`⏱️ Roundtrip Latency: ${elapsedMs}ms`);
      console.log(`HTTP Status: ${response.status} ${response.statusText}`);

      try {
        const json = JSON.parse(text);
        if (json.success) {
          console.log(`✅ SUCCESS: ${json.message || 'Row appended successfully!'}`);
          if (json.receiptUrl) console.log(`📎 Uploaded Receipt: ${json.receiptUrl}`);
        } else {
          console.warn(`⚠️ Warning Response:`, json);
        }
      } catch {
        console.log(`📄 Raw Response Body (non-JSON): ${text.substring(0, 300)}`);
      }
    } catch (err) {
      console.error(`❌ Request Failed:`, err.message);
    }
  }

  console.log('\n======================================================');
  console.log('   🎉 All Registration Flow Tests Completed!');
  console.log('======================================================\n');
}

runTest();
