# Hybrid AI Threat Detection API - Test Scenarios

This document details the test scenarios, request bodies, and expected JSON response models for the SafeClick Guardian Hybrid AI Scam Detection Engine API `/api/scans/analyze`.

---

## 1. Safe Message Scenario

### Request Body
```json
{
  "content": "Hi Rahul, are we still meeting today at 5:00 PM for the project presentation?",
  "contentType": "text"
}
```

### Expected Response
```json
{
  "status": "success",
  "timing": {
    "executionTimeMs": 280,
    "geminiResponseTimeMs": 210,
    "databaseSaveTimeMs": 40
  },
  "data": {
    "input": "Hi Rahul, are we still meeting today at 5:00 PM for the project presentation?",
    "inputType": "text",
    "riskScore": 12,
    "riskLevel": "safe",
    "scamType": "Safe",
    "confidence": 85,
    "explanation": "No phishing indicators, social engineering triggers, or suspicious domain signatures detected in input content.",
    "redFlags": [],
    "psychologicalTricks": [],
    "victimImpact": "None. Safe configuration verified.",
    "recommendedActions": [
      "Maintain standard credentials hygiene",
      "Enable multi-factor alerts"
    ],
    "legalAdvice": "No violations detected. Covered under general digital hygiene guidelines.",
    "reportImmediately": false,
    "governmentPortal": "https://www.cybercrime.gov.in",
    "helpline": "1930",
    "similarScams": [],
    "country": "India"
  }
}
```

---

## 2. Bank KYC Scam Scenario

### Request Body
```json
{
  "content": "SBI ALERT: Your SBI NetBanking account is suspended due to pending KYC verification. Update immediately at http://sbi-verification-portal.xyz/login to avoid permanent block.",
  "contentType": "text"
}
```

### Expected Response
```json
{
  "status": "success",
  "timing": {
    "executionTimeMs": 1450,
    "geminiResponseTimeMs": 1220,
    "databaseSaveTimeMs": 52
  },
  "data": {
    "input": "SBI ALERT: Your SBI NetBanking account is suspended due to pending KYC verification. Update immediately at http://sbi-verification-portal.xyz/login to avoid permanent block.",
    "inputType": "text",
    "keywords": ["verify", "bank", "blocked", "kyc", "urgent", "link", "account suspended"],
    "urls": ["http://sbi-verification-portal.xyz/login"],
    "domainRisk": 70,
    "riskScore": 88,
    "riskLevel": "high",
    "scamType": "Phishing",
    "confidence": 94,
    "explanation": "The message spoofing bank alerts claims immediate account suspension. RBI regulations mandate banks never request credential updates via SMS links.",
    "redFlags": [
      "Brand hijacking detected: contains 'sbi' but is hosted on an unofficial host domain",
      "Security keyword padding detected: contains multiple credential traps",
      "Urgent activation deadline",
      "Unofficial banking subdomain",
      "SMS sender number spoofing indicator"
    ],
    "psychologicalTricks": [
      "Fear activation",
      "Loss aversion"
    ],
    "victimImpact": "Loss of credentials, unauthorized access to mobile banking apps, or fraudulent debit transfers.",
    "recommendedActions": [
      "Do not tap or click the links included.",
      "Report the sender number or WhatsApp invite immediately on cybercrime.gov.in.",
      "Call the Reserve Bank helpline or 1930 cyber emergency number if transactions occur."
    ],
    "legalAdvice": "Violation of Section 66D of the Information Technology Act 2000 (cheating by personation using computer resources).",
    "reportImmediately": true,
    "governmentPortal": "https://www.cybercrime.gov.in",
    "helpline": "1930",
    "similarScams": [
      "UPI spoof collect requests",
      "Fake FedEx customs parcel scams"
    ],
    "country": "India"
  }
}
```

---

## 3. WhatsApp Lottery Scam Scenario

### Request Body
```json
{
  "content": "Congratulations! You won ₹25 Lakhs in the KBC Lottery Draw. Chat with official support on WhatsApp at wa.me/919999999999 to claim your cash reward. Processing fee applies.",
  "contentType": "text"
}
```

### Expected Response
```json
{
  "status": "success",
  "timing": {
    "executionTimeMs": 1580,
    "geminiResponseTimeMs": 1310,
    "databaseSaveTimeMs": 48
  },
  "data": {
    "input": "Congratulations! You won ₹25 Lakhs in the KBC Lottery Draw. Chat with official support on WhatsApp at wa.me/919999999999 to claim your cash reward. Processing fee applies.",
    "inputType": "text",
    "keywords": ["reward", "winner", "lottery", "whatsapp", "processing fee"],
    "phones": ["919999999999"],
    "riskScore": 92,
    "riskLevel": "critical",
    "scamType": "Social Engineering",
    "confidence": 98,
    "explanation": "Pretends to offer KBC rewards or lottery cashbacks to lure targets into processing fee transactions.",
    "redFlags": [
      "Upfront payment requested",
      "Verification via WhatsApp link"
    ],
    "psychologicalTricks": [
      "Greed activation",
      "Artificial gratification"
    ],
    "victimImpact": "Expected financial loss due to fake verification deposit fees.",
    "recommendedActions": [
      "Do not tap or click the links included.",
      "Report the sender number or WhatsApp invite immediately on cybercrime.gov.in.",
      "Call the Reserve Bank helpline or 1930 cyber emergency number if transactions occur."
    ],
    "legalAdvice": "Covered under Section 66D of the Indian IT Act and cheating charges under BNS Section 318.",
    "reportImmediately": true,
    "governmentPortal": "https://www.cybercrime.gov.in",
    "helpline": "1930",
    "similarScams": [
      "Fake lottery draws",
      "Free gift voucher traps"
    ],
    "country": "India"
  }
}
```

---

## 4. Telegram Job Scam Scenario

### Request Body
```json
{
  "content": "EASY PART TIME JOB: Earn ₹5000/day by rating tourist places on Google Maps. Complete daily tasks on Telegram t.me/map-tasks. Initial security fee required to unlock withdrawal limit.",
  "contentType": "text"
}
```

### Expected Response
```json
{
  "status": "success",
  "timing": {
    "executionTimeMs": 1390,
    "geminiResponseTimeMs": 1180,
    "databaseSaveTimeMs": 45
  },
  "data": {
    "input": "EASY PART TIME JOB: Earn ₹5000/day by rating tourist places on Google Maps. Complete daily tasks on Telegram t.me/map-tasks. Initial security fee required to unlock withdrawal limit.",
    "inputType": "text",
    "keywords": ["payment", "job", "telegram"],
    "riskScore": 85,
    "riskLevel": "high",
    "scamType": "Job Scam",
    "confidence": 90,
    "explanation": "Telegram rating task scams offering daily income, followed by mandatory security deposits to release earnings.",
    "redFlags": [
      "Deposits required to work",
      "Operations hosted on unverified Telegram channels"
    ],
    "psychologicalTricks": [
      "Reciprocity baiting",
      "Initial small payouts payout trust"
    ],
    "victimImpact": "Expected financial loss and personal data hijack.",
    "recommendedActions": [
      "Do not tap or click the links included.",
      "Report the sender number or WhatsApp invite immediately on cybercrime.gov.in.",
      "Call the Reserve Bank helpline or 1930 cyber emergency number if transactions occur."
    ],
    "legalAdvice": "Section 66D of the IT Act (Cheating by personation) and Section 420 of IPC (Cheating and dishonestly inducing delivery of property).",
    "reportImmediately": true,
    "governmentPortal": "https://www.cybercrime.gov.in",
    "helpline": "1930",
    "similarScams": [
      "Telegram task scams",
      "Part-time rating fraud"
    ],
    "country": "India"
  }
}
```
