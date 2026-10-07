#!/usr/bin/env python3
"""
=============================================================================
ILLUMINATE 2026 — Web Registration Testing Tool (Python)
=============================================================================
Takes registration test data and sends the exact web payload to your 
Google Apps Script endpoint to verify the Google Sheet integration.

Usage:
    python scripts/test_registration.py
"""

import os
import sys
import re
import json
import time
import urllib.request
import urllib.error

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# 1x1 dummy pixel base64 for payment screenshot proof
DUMMY_SCREENSHOT = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="

def load_env_url():
    """Reads VITE_GOOGLE_SCRIPT_URL from .env file"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    env_path = os.path.join(script_dir, "..", ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                match = re.match(r"VITE_GOOGLE_SCRIPT_URL\s*=\s*(.+)", line.strip())
                if match:
                    return match.group(1).strip().strip("'\"")
    return ""

def create_payload(mode, name, email, phone, utr, college="Raghu Engineering College", team_name=""):
    """Builds the exact payload identical to the website frontend"""
    is_group = (mode == "group")
    clean_utr = utr.strip() or f"TEST{int(time.time())}"

    if is_group:
        members = [
            {"name": name, "roll": "21981A0501", "college": college, "branch": "CSE", "year": "3rd Year", "phone": phone, "email": email},
            {"name": f"{name} (Member 2)", "roll": "21981A0502", "college": college, "branch": "CSD", "year": "3rd Year", "phone": phone, "email": email},
            {"name": f"{name} (Member 3)", "roll": "21981A0503", "college": college, "branch": "CSM", "year": "3rd Year", "phone": phone, "email": email},
            {"name": f"{name} (Member 4)", "roll": "21981A0504", "college": college, "branch": "ECE", "year": "3rd Year", "phone": phone, "email": email},
        ]
        return {
            "registrationType": "Squad (4 Members)",
            "totalAmount": 2796,
            "teamName": team_name or f"{name}'s Squad",
            "name": name,
            "roll": "21981A0501",
            "college": college,
            "branch": "CSE",
            "year": "3rd Year",
            "location": "Visakhapatnam",
            "phone": phone,
            "email": email,
            "members": members,
            "member1_name": members[0]["name"], "member1_roll": members[0]["roll"], "member1_college": college, "member1_branch": "CSE", "member1_year": "3rd Year", "member1_phone": phone, "member1_email": email,
            "member2_name": members[1]["name"], "member2_roll": members[1]["roll"], "member2_college": college, "member2_branch": "CSD", "member2_year": "3rd Year", "member2_phone": phone, "member2_email": email,
            "member3_name": members[2]["name"], "member3_roll": members[2]["roll"], "member3_college": college, "member3_branch": "CSM", "member3_year": "3rd Year", "member3_phone": phone, "member3_email": email,
            "member4_name": members[3]["name"], "member4_roll": members[3]["roll"], "member4_college": college, "member4_branch": "ECE", "member4_year": "3rd Year", "member4_phone": phone, "member4_email": email,
            "utr": clean_utr,
            "screenshotName": "test-proof.jpg",
            "screenshotType": "image/jpeg",
            "screenshotData": DUMMY_SCREENSHOT,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
    else:
        return {
            "registrationType": "Individual",
            "totalAmount": 799,
            "teamName": "",
            "name": name,
            "roll": "21981A0599",
            "college": college,
            "branch": "CSE",
            "year": "3rd Year",
            "location": "Visakhapatnam",
            "phone": phone,
            "email": email,
            "members": [{
                "name": name, "roll": "21981A0599", "college": college, "branch": "CSE", "year": "3rd Year", "phone": phone, "email": email
            }],
            "member1_name": name,
            "member1_roll": "21981A0599",
            "member1_college": college,
            "member1_branch": "CSE",
            "member1_year": "3rd Year",
            "member1_phone": phone,
            "member1_email": email,
            "member2_name": "", "member2_roll": "", "member2_college": "", "member2_branch": "", "member2_year": "", "member2_phone": "", "member2_email": "",
            "member3_name": "", "member3_roll": "", "member3_college": "", "member3_branch": "", "member3_year": "", "member3_phone": "", "member3_email": "",
            "member4_name": "", "member4_roll": "", "member4_college": "", "member4_branch": "", "member4_year": "", "member4_phone": "", "member4_email": "",
            "utr": clean_utr,
            "screenshotName": "test-proof.jpg",
            "screenshotType": "image/jpeg",
            "screenshotData": DUMMY_SCREENSHOT,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }

def send_to_web(url, payload):
    """Sends POST request matching browser fetch"""
    print(f"\n🚀 Transmitting registration to: {url[:50]}...")
    data_bytes = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data_bytes,
        headers={"Content-Type": "text/plain;charset=utf-8"},
        method="POST"
    )

    start_time = time.time()
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            elapsed = time.time() - start_time
            status = resp.status
            body = resp.read().decode("utf-8")

            print(f"⏱️ Response Time: {elapsed:.2f}s | HTTP Status: {status}")
            try:
                res_json = json.loads(body)
                print(f"✅ Result: {json.dumps(res_json, indent=2)}")
                if res_json.get("success"):
                    print("\n🎉 SUCCESS! Test registration logged to Google Sheet!")
                    print(f"   • Ticket ID : {res_json.get('ticketId')}")
                    print(f"   • Status    : Pending Verification (in Sheet)")
            except Exception:
                print(f"📄 Response Text: {body}")

    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error {e.code}: {e.read().decode('utf-8')}")
    except urllib.error.URLError as e:
        print(f"❌ Connection Error: {e.reason}")
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    print("=" * 60)
    print("   ILLUMINATE 2026 — REGISTRATION WEB SUBMISSION TESTER")
    print("=" * 60)

    url = load_env_url()
    if not url:
        url = input("Enter Google Apps Script Web App URL (ends with /exec): ").strip()

    print(f"Using Endpoint: {url}")

    if "--auto" in sys.argv:
        print("\n[Auto Mode] Sending default solo test registration payload...")
        payload = create_payload(
            mode="individual",
            name="Test Delegate",
            email="test.delegate@example.com",
            phone="9876543210",
            utr=f"TEST{int(time.time())}",
            college="Raghu Engineering College",
            team_name=""
        )
        payload["location"] = "Maddilapalem Bus Stop"
        send_to_web(url, payload)
        return

    print("\nSelect Test Mode:")
    print("  [1] Solo Registration (₹799)")
    print("  [2] Squad Registration (4 Members - ₹2,796)")
    choice = input("\nEnter choice (1 or 2, default 1): ").strip() or "1"

    mode = "group" if choice == "2" else "individual"
    pass_name = "Squad Pass (4 Members)" if mode == "group" else "Individual Pass"

    print(f"\n--- Testing: {pass_name} ---")
    test_name = input("Enter Name [Test Student]: ").strip() or "Test Student"
    test_email = input("Enter Email to receive ticket [test@gmail.com]: ").strip() or "test@gmail.com"
    test_bus_stop = input("Enter Nearest Bus Stop [Maddilapalem]: ").strip() or "Maddilapalem"
    test_phone = input("Enter Phone [9876543210]: ").strip() or "9876543210"
    test_utr = input("Enter 12-digit UTR [press Enter for auto-gen]: ").strip() or f"TEST{int(time.time())}"
    team_name = ""
    if mode == "group":
        team_name = input("Enter Squad Name [Alpha Squad]: ").strip() or "Alpha Squad"

    payload = create_payload(
        mode=mode,
        name=test_name,
        email=test_email,
        phone=test_phone,
        utr=test_utr,
        college="Raghu Engineering College",
        team_name=team_name
    )
    payload["location"] = test_bus_stop

    send_to_web(url, payload)

if __name__ == "__main__":
    main()
