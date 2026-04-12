# 🧠 CogniCare – AI-Powered Alzheimer Care System

> Transforming Alzheimer care from passive monitoring to intelligent assistance.

---

## 🌟 Overview

CogniCare is an AI + IoT-based healthcare platform designed to support Alzheimer’s patients, caregivers, and doctors through real-time monitoring, cognitive training, and an emotionally aware AI companion.

It focuses on improving **independence, safety, and quality of life** for patients.

---

## 🎯 Problem Statement

- Alzheimer patients require continuous supervision  
- Caregiver burden is high (emotionally & financially)  
- Lack of affordable, intelligent care systems in India  

---

## 💡 Our Solution

CogniCare provides a **complete care ecosystem**:

- 🧠 Cognitive training games (neuroplasticity-based)
- 📡 Real-time health monitoring using IoT
- 🤖 AI companion (ASHA) with voice interaction
- 📊 Role-based dashboards for caregivers & doctors
- ⌚ Smartwatch-based emergency monitoring system

---

## 🏗️ System Architecture

- Frontend: HTML, CSS, JavaScript  
- Backend: Node.js (Express)  
- AI: Groq API (LLaMA-based models)  
- Computer Vision: OpenCV + MediaPipe  
- IoT: ESP32 + Sensors  
- Database: Supabase  
- Communication: Twilio (Calls & WhatsApp)

---

## 👥 User Roles

### 👤 Patient
- Access cognitive games  
- Interact with AI assistant (ASHA)  
- Voice-based support (Multilingual)  

### 🧑‍⚕️ Caregiver
- Monitor patient vitals  
- Receive alerts (SOS, abnormal patterns)  
- Track daily activities  

### 👨‍⚕️ Doctor
- View patient analytics  
- Cognitive score tracking  
- Emotion & behavior insights  

---

## 🤖 ASHA – AI Companion

- Built using Groq (fast inference)
- Emotionally supportive responses
- Multilingual support (English, Tamil, Hindi, etc.)
- Voice-enabled interaction
- Designed specifically for Alzheimer patients

---

## 🎮 Cognitive Games

- Memory Games  
- Pattern Recognition  
- Reaction-based games  

👉 Improves:
- Memory retention  
- Attention  
- Motor coordination  

---

# ⌚ CogniCare Smartwatch System (HARDWARE)

## 📌 Overview

The CogniCare Smartwatch is a wearable system designed for Alzheimer’s patients that continuously monitors health, stress, and location, and automatically triggers emergency responses using AI.

---

## 🔧 Hardware Components

### 🫀 MAX30102 (Heart Rate & SpO₂)
- Tracks: Heart Rate (BPM), SpO₂  
- Detects abnormal heart activity  

---

### ⚡ GSR Sensor (Stress Detection)
- Tracks: Skin conductivity  
- Detects stress, fear, anxiety  

👉 High GSR = High stress  

---

### 🧠 ESP32 (Core Controller)
- Processes sensor data  
- Sends data to backend  
- Triggers emergency actions  

---

### 📺 OLED Display
- Shows:
  - Heart rate  
  - Stress level  
  - Simple instructions  

---

### 📍 GPS Module
- Tracks real-time location  
- Stores safe zones (home, hospital)  
- Guides patient back safely  

---

## 🚨 Emergency Detection Logic

Triggered when:

- High heart rate ❤️  
- High stress ⚡  
- Unsafe location 📍  

---

## 🤖 AI + Communication System

Once triggered:

1. Data sent to AI (Groq)  
2. AI analyzes condition  
3. System responds automatically  

---

## 📞 Emergency Response

### 📲 Call (Twilio)
- Auto call to caregiver  
- Informs emergency condition  

---

### 💬 WhatsApp Alert (Twilio)
- Sends:
  - Live location  
  - Alert type  

---

### 🧭 Navigation Support
- Guides patient to safe zone  
- Based on GPS + stored locations  

---

### 🧘 Calm Assistance
- AI gives:
  - Relaxation instructions  
  - Simple guidance  

---

## 🔁 Full Hardware Flow

Sensors → ESP32 → AI (Groq) → Response System

👉 Actions triggered:
- 📞 Call  
- 💬 WhatsApp alert  
- 🧭 Navigation  
- 🧘 Calm guidance  

---

## ⚙️ Features

- ✅ Real-time health monitoring  
- ✅ Stress & panic detection  
- ✅ GPS tracking with safe zones  
- ✅ Emergency call system  
- ✅ WhatsApp alerts  
- ✅ AI voice assistant  
- ✅ Role-based dashboards  
- ✅ Multilingual support  

---

## 💰 Feasibility

- Traditional care: ₹15,000 – ₹50,000/month  
- CogniCare: ~₹2000–₹4000 (one-time device)  

👉 Affordable for middle-class families  

---

## 🌍 Innovation

> One of the first integrated AI + IoT Alzheimer care systems focused on **active assistance instead of passive monitoring**.

---
2️⃣ Install Dependencies
npm install
3️⃣ Setup Environment
GROQ_API_KEY=your_api_key
4️⃣ Run Server
node server.js
5️⃣ Run Frontend

Open:

http://127.0.0.1:5500/index.html
## 🚀 How to Run the Project

### 1️⃣ Clone Repository
```bash
git clone https://github.com/1234534-anu/cognicare.git
cd cognicare
