# ⚡ BijliOptima (بجلی آپٹیما)

> **Sub-Second Event-Driven Energy Management & AI Copilot for Pakistan's Power Realities**

BijliOptima is a high-performance, real-time smart microgrid operational platform engineered for Pakistan's volatile electricity distribution infrastructure (frequent 11kV unannounced feeder tripping, severe peak TOU tariff penalties, aggressive net-billing export spreads, and intermittent broadband connectivity).

---

## 🏛️ Real-Time System Topology

```
       [PHYSICAL LAYER]                        [TRANSPORT]                      [EVENT ENGINE]
┌──────────────────────────────┐          ┌───────────────────┐          ┌───────────────────────────┐
│ Inverter (RS-485 Modbus)     │ ──100ms─>│                   │ ──MQTT──>│ EMQX / Mosquitto Broker   │
│ Smart Energy Meter (Pulse)   │ ──500ms─>│ ESP32 Edge Bridge │          └─────────────┬─────────────┘
│ Smart Breakers / Relays      │ <──cmd───│                   │                        │
└──────────────────────────────┘          └───────────────────┘                        ▼
                                                                             [Stream Processing Core]
┌──────────────────────────────┐          ┌───────────────────┐              • In-Memory Fast State
│ Mobile App (React Native)    │ <────────│ WebSocket Gateway │ <────────────• Fast Reflex Engine (0-100ms)
│ Live Velocity Flow @ 60 FPS  │ (Bi-dir) │ (FastAPI ASGI)    │              • Bilingual Gemini Copilot
└──────────────────────────────┘          └───────────────────┘              └─────────────┬─────────────┘
                                                                                           ▼
                                                                             [External Live Signals]
                                                                             • 11kV Feeder Blackout Webhook
                                                                             • Solar Cloud Vector Tracking
```

---

## 🚀 Key Architectural Features

### 1. Sub-Second Ingestion Layer (ESP32 Edge Bridge)
- **High-Frequency Inverter Telemetry**: Direct RS-485 Modbus polling (Growatt, Knox, Inverex, Deye, Huawei) every **250 to 500ms** (~3.3 Hz):
  - PV Generation ($W_{solar}$), Household Load ($W_{house}$), Net Grid Export/Import ($W_{grid}$).
  - Battery State-of-Charge ($SoC\%$), voltage ($51.2V$), and current ($A_{charge/discharge}$).
  - Grid line voltage ($V_{grid}$) and line frequency ($Hz$).
- **Instant Outage Detection**: Collapsing line frequency or voltage triggers millisecond outage alerts, bypassing 5-minute cloud delays.

### 2. Dual-Engine Decision Loop
- **Instant Reflex Engine (0 to 100 Milliseconds)**:
  - **Inverter Over-Load Breaker**: If 11kV grid cuts ($V_{grid} = 0$) and home load exceeds the inverter's surge capacity (e.g. $5.5\text{ kW}$ load on a $5.0\text{ kW}$ inverter), it automatically sheds non-critical heavy inductive loads (Inverter AC / Water Pump) within **<50ms** to prevent a hard fault shutdown.
  - **Instant Reverse-Feed Blocker**: Under Net Billing rules (where export yields wholesale $\sim\text{Rs. 11/kWh}$ vs import costs $\text{Rs. 58+/kWh}$), redirects excess PV into battery storage or thermal hot water instead of dumping it.
- **Agentic Copilot Loop (1 to 5 Minutes / Event-Driven)**:
  - Tracks boundary condition shifts (NEPRA 300-unit slab limits, peak 6:00 PM – 10:00 PM TOU windows, shifting cloud vectors) and synthesizes predictive instructions.

### 3. Bi-Directional WebSocket Streaming & 60 FPS Animation
- **Velocity-Driven Energy Vectors**:
  - React Native SVG conduits modulate particle animation duration and neon glow stroke thickness based on live wattage ($400\text{ms}$ at peak $5\text{ kW}$ to $3000\text{ms}$ trickle).
- **Sub-120ms Relay Control**:
  - `App -> WebSocket -> MQTT -> ESP32 -> Relay` roundtrip command dispatch in **8–15ms (Local LAN)** or **65–115ms (Cloud WSS)** with physical haptic confirmation.

### 4. Real-Time Crowdsourced 11kV Feeder Grid Mapping
- Nodes on identical 11kV distribution feeders publish 10s telemetry pings.
- When 4 out of 5 residential nodes drop grid voltage, the platform marks the feeder status as **`TRIPPED`**, broadcasting a preemptive warning to downstream users and locking reserve batteries at **90%** before the local phase collapses.

### 5. Edge Offline Survivability (Local LAN Fallback)
- Discovers local ESP32 bridge via mDNS/Zeroconf (`ws://esp32-bijlioptima.local:81`).
- If broadband fiber or 4G data goes dark, the app switches from Cloud WebSockets to Local LAN WebSockets with zero disruption.

---

## 🔒 Security Architecture & Attack Defense

| Security Dimension | Defense Mechanism | Implementation Details |
| :--- | :--- | :--- |
| **At-Rest Encryption** | Hardware Keystore AES-256 | `expo-secure-store` backed by Android Keystore (AES-256 GCM) & iOS Keychain (`kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly`). |
| **Circuit Interlocks** | Immutable Critical Relays | Homelab & Medical circuits (`relay-server`) have hardware immutability flags to prevent accidental or malicious remote shedding. |
| **Contactor Authorization** | Safety PIN Protection | High-voltage loads (e.g. Level 2 EV Charger) enforce 4-digit PIN verification before manual override during peak windows. |
| **Compressor Burnout Guard** | Anti-Recycle Lockout | 180-second hardware cooldown timer prevents rapid contactor re-ignition on refrigeration and AC compressors. |
| **Input Sanitization** | Regex Injection Defense | DISCO Reference numbers validated against strict `^[A-Z0-9-]{8,24}$` regex to eliminate injection vectors. |
| **API Abuse Prevention** | Leaky Bucket Rate Limiter | OCR and contactor switches throttled to max 8 operations/minute per client. |
| **Offline Defense** | Local mDNS Isolation | Local LAN WebSocket communications operate completely offline during internet blackouts. |

---

## 📱 Application Screens & Modules

1. **Flow Hub (`FlowHubScreen.tsx`)**:
   - Dynamic Concentric Orbital Sankey Hub with 60 FPS velocity particles.
   - NEPRA Slab 3 Sentinel banner (units remaining until punitive tariff breach).
   - Real-time Net Revenue sparklines and generation telemetry.
2. **Bill Scanner (`BillScannerScreen.tsx`)**:
   - Holographic laser blade viewfinder with audio-visual scan pulses.
   - Multimodal Gemini OCR parsing for PITC DISCOs (LESCO, PESCO, IESCO, K-Electric) & Gas bills (SNGPL/SSGC).
3. **Load Relays (`LoadRelaysScreen.tsx`)**:
   - Sub-metered contactor cards with compressor cooldown timers.
   - Autonomous Orchestration Suite with 0–100ms Instant Reflex monitor.
   - Dynamic Power Routing Bus with live micro-switching transfer latency.
4. **Tariff Analytics (`TariffAnalyticsScreen.tsx`)**:
   - Circular radial progress meter, multi-tiered NEPRA slab ladder, and TOU peak heatmap.
   - Battery expansion ROI simulator.
5. **Conversational Copilot (`BilingualCopilotModal.tsx`)**:
   - Voice wave audio visualizer supporting **Roman Urdu** (*"Kya abhi paani ki motor chala saktay hain?"*) and **English**.
   - Live tool-calling execution cards.
6. **Dual-Utility Arbitrage (`DualUtilityArbitrageModal.tsx`)**:
   - Thermal cost equivalence: Solar Electric ($\approx\text{Rs. 0/hr}$) vs SNGPL Gas ($\text{Rs. 1,850/MMBTU}$) vs Grid Electric ($\text{Rs. 58.50/kWh}$).
7. **11kV Feeder Radar (`FeederMeshRadarModal.tsx`)**:
   - Crowdsourced distribution branch visualizer tracking 5 neighborhood nodes with test trip simulation.

---

## 🛠️ Tech Stack & Prerequisites

- **Runtime**: React Native 0.86.3, React 19.2.3
- **Framework**: Expo SDK 57 (Versioned docs: [https://docs.expo.dev/versions/v57.0.0/](https://docs.expo.dev/versions/v57.0.0/))
- **Language**: TypeScript 6.0
- **Vector Graphics**: `react-native-svg 15.15.4`
- **Security**: `expo-secure-store ~57.0.4`
- **Sensory Feedback**: `expo-haptics ~57.0.3`
- **Icons**: `@expo/vector-icons ^15.0.2`

---

## 🏃 Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Verify Type Safety
```bash
npx tsc --noEmit
```

### 3. Start Expo Development Server
```bash
# Start default bundler
npx expo start

# Run on Android emulator / device
npx expo start --android

# Run on iOS simulator / device
npx expo start --ios

# Run on Web browser
npx expo start --web
```

### 4. Build Production Bundle Check
```bash
npx expo export -p android --no-bytecode
```

---

## 📄 License
Proprietary & Confidential — Engineered for Smart Microgrid Systems in Pakistan.
