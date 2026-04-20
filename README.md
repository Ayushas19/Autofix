# ⚡ AUTOMATA FIX CHALLENGE

> A real-time, anti-cheat competitive programming event platform built with Node.js, Socket.io, and HTML5 Canvas.

Participants race against the clock to fix a broken Deterministic Finite Automaton (DFA) within a strict 30-minute global event window. The server renders the problem as an image (no copy-paste), monitors tab switches, and persists all data to disk in real-time.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Server** | Node.js (native `http` module) |
| **Real-time** | Socket.io |
| **Problem Rendering** | `canvas` (node-canvas) |
| **Frontend** | Vanilla JS + Tailwind CSS (CDN) |
| **Database** | None — in-memory `{}` + JSON file persistence |
| **Fonts** | JetBrains Mono, Orbitron (Google Fonts) |

---

## 📂 Project Structure

```
automata-challenge/
├── server.js                    # Main server — HTTP, Sockets, Canvas, Timers
├── public/
│   └── index.html               # Single-page frontend (all UI states)
├── participants_backup.json     # Auto-generated: real-time data persistence
├── event_results.json           # Auto-generated: final export after event ends
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
# Clone or navigate to the project
cd automata-challenge

# Install dependencies
npm install
```

### Run the Server

```bash
node server.js
```

The server starts on **http://localhost:3000**.

```
══════════════════════════════════════════════════════════
  AUTOMATA FIX CHALLENGE SERVER
  Running on http://localhost:3000
  Event Phase: LOBBY
  Event Window: 18:00 IST — 18:30 IST
══════════════════════════════════════════════════════════
```

---

## 🕐 Event Flow

The entire event runs within a **strict 30-minute window** from **18:00 IST to 18:30 IST**.

```
18:00 IST                                              18:30 IST
   │                                                       │
   ▼                                                       ▼
   ┌──────────────────────────────────────────────────────┐
   │              GLOBAL EVENT WINDOW (30 min)            │
   │                                                      │
   │  User joins at any point ──┐                         │
   │                            ▼                         │
   │                 ┌── 15 min Fix ──┐                   │
   │                 │  Write answer  │                   │
   │                 └───────┬────────┘                   │
   │                         ▼                            │
   │                 ┌── Explanation ──┐                   │
   │                 │  150-200 words  │                   │
   │                 └───────┬────────┘                   │
   │                         ▼                            │
   │                    ✅ SUBMITTED                       │
   └──────────────────────────────────────────────────────┘
                                                           │
                                                    18:31 IST
                                                           │
                                                    📄 Results
                                                       exported
```

### Phase Breakdown

| Phase | Description |
|---|---|
| **Lobby** | Before 18:00 IST — countdown timer shown, no login allowed |
| **Login** | 18:00 IST — socket event transforms lobby into login screen |
| **Fix Phase** | 15 minutes per user — fix the broken DFA transition table |
| **Explanation** | After fix is locked — write a 150-200 word logic defense |
| **Done** | Submission complete — user sees confirmation |
| **Event Ended** | 18:30 IST — all submissions force-locked, data exported at 18:31 |

---

## 🛡️ Anti-Cheat System

| Measure | Implementation |
|---|---|
| **Problem as Image** | Server renders DFA problem via `canvas` as a base64 PNG — no selectable text |
| **Right-click Disabled** | `contextmenu` event blocked |
| **Copy/Paste Blocked** | `Ctrl+C`, `Ctrl+V`, `Ctrl+U`, `Ctrl+S` intercepted globally |
| **Paste on Explanation** | `paste` event blocked on explanation textarea |
| **Tab Switch Tracking** | `visibilitychange` API — count emitted to server and logged |
| **DevTools Blocked** | `F12` key intercepted |
| **Image Drag Disabled** | `dragstart` prevented on problem image |
| **Server-Side Timer** | 15-min lock enforced server-side, not just frontend |

---

## 💾 Data Persistence

### Real-Time Backup
All participant data is written to `participants_backup.json` on **every** data mutation:
- New user registration
- Fix code auto-save (every 3 seconds)
- Fix submission (early or auto-lock)
- Explanation updates
- Final submission
- Tab switch events
- Global event end (force-lock)

If the server crashes, data is automatically restored on restart.

### Final Export
At **18:31 IST** (1 minute after event end), the server writes `event_results.json` with the complete dataset:

```json
{
  "exportedAt": "2026-04-21T12:31:00.000Z",
  "totalParticipants": 5,
  "participants": [
    {
      "username": "user#1234",
      "startTime": "2026-04-21T12:30:00.000Z",
      "fixCode": "δ(q0, 0) = q0\nδ(q0, 1) = q1\n...",
      "fixLockedAt": "2026-04-21T12:35:00.000Z",
      "explanation": "I changed q2 on input 1 to...",
      "finalSubmitted": true,
      "finalSubmittedAt": "2026-04-21T12:36:00.000Z",
      "tabSwitchCount": 0,
      "disconnects": 0
    }
  ]
}
```

---

## 🔄 Reconnection Support

If a participant refreshes the page or loses connection:

1. They re-enter the **same Discord username**
2. The server recognizes them via the `participants` object
3. Their full state is restored: fix code, timer position, explanation, tab switch count
4. The `disconnects` counter increments for audit purposes

---

## ⚙️ Configuration

Key constants in `server.js`:

| Constant | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP server port |
| `IST_OFFSET_MS` | `5.5 * 60 * 60 * 1000` | IST timezone offset |
| `USER_TIMER_MS` | `15 * 60 * 1000` | Per-user fix phase duration |
| Event Start | `18:00 IST` | Set in `getTodayEventWindow()` |
| Event End | `18:30 IST` | Set in `getTodayEventWindow()` |

### Changing the Event Time

Edit `getTodayEventWindow()` in `server.js` to modify the event hours:

```javascript
// Change 18 to your desired hour (24h format, IST)
const startIST = new Date(year, month, day, 18, 0, 0, 0);
// Change 18, 30 to your desired end time  
const endIST = new Date(year, month, day, 18, 30, 0, 0);
```

---

## 🧪 Testing

To test without waiting until 18:00 IST, add a test mode to `server.js`:

```javascript
// Add these after the PORT constant:
const TEST_MODE = true;
const BOOT_TIME = Date.now();
const TEST_START_MS = BOOT_TIME + 5 * 60 * 1000;      // starts 5 min after boot
const TEST_END_MS   = TEST_START_MS + 30 * 60 * 1000;  // 30 min window

// In getTodayEventWindow(), add at the top:
if (TEST_MODE) {
  return { startMs: TEST_START_MS, endMs: TEST_END_MS, exportMs: TEST_END_MS + 60000 };
}

// Optionally reduce user timer:
const USER_TIMER_MS = TEST_MODE ? 3 * 60 * 1000 : 15 * 60 * 1000;
```

> **Remember to set `TEST_MODE = false` before the actual event!**

---

## 📡 Socket.io Events

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `user:login` | `username` | Login or reconnect |
| `fix:update` | `{ username, fixCode }` | Auto-save fix code |
| `fix:submit` | `{ username, fixCode }` | Early fix submission |
| `explanation:update` | `{ username, explanation }` | Save explanation text |
| `final:submit` | `{ username, explanation }` | Final submission |
| `anticheat:tabswitch` | `{ username }` | Report tab switch |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `event:phase` | `{ phase, msUntilStart, msUntilEnd }` | Current event phase |
| `fix:locked` | `{ fixCode }` | Fix phase auto-locked (15 min expired) |
| `anticheat:warning` | `{ tabSwitchCount, message }` | Tab switch warning |
| `event:ended` | `{ message }` | Global event ended at 18:30 |

---

## 🎨 UI Design

- **Aesthetic**: Dark-mode hacker/cyberpunk theme
- **Fonts**: Orbitron (display), JetBrains Mono (code)
- **Effects**: Animated grid background, scanline overlay, glow effects, pulse animations
- **Colors**: Cyber green (`#00ff88`), amber warnings (`#ffcc00`), red alerts (`#ff4444`)
- **Responsive**: Works on desktop and tablet

---

## 📜 License

ISC

---

<p align="center">
  <strong>Built for competitive programming events.</strong><br/>
  <em>No databases. No frameworks. Just sockets, canvas, and clean code.</em>
</p>
