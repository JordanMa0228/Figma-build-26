# FlowSense

**Subjective Time Perception & Flow State Monitoring App**

FlowSense is a web application that helps you understand how you experience time during focused work sessions. Similar to a sleep tracker — but for your cognitive states. After completing a task session, review your **Subjective Time Rate (STR)** and **Flow/Focus state timeline** visualized from multi-modal sensor data (Eye Tracker, EEG, Heart Rate/PPG) processed through a multimodal Transformer model.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | ^18.3.1 | UI framework |
| Vite | ^5.3.4 | Build tool & dev server |
| Tailwind CSS | ^3.4.6 | Utility-first styling |
| React Router v6 | ^6.24.1 | Client-side routing |
| Recharts | ^2.12.7 | Data visualization charts |
| Lucide React | ^0.400.0 | Icon library |
| date-fns | ^3.6.0 | Date formatting |

---

## Full Dependencies

### Runtime Dependencies
```json
{
  "date-fns": "^3.6.0",
  "lucide-react": "^0.400.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.24.1",
  "recharts": "^2.12.7"
}
```

### Dev Dependencies
```json
{
  "@types/react": "^18.3.3",
  "@types/react-dom": "^18.3.0",
  "@vitejs/plugin-react": "^4.3.1",
  "autoprefixer": "^10.4.19",
  "postcss": "^8.4.39",
  "tailwindcss": "^3.4.6",
  "vite": "^5.3.4"
}
```

---

## Setup Instructions

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## App Pages

### 1. Dashboard (`/`)
Home page with today's summary card, quick stats (total sessions, weekly flow time, avg STR), and recent sessions list. Includes a "New Session" modal with task type selection and a 3-second loading simulation.

### 2. Sessions (`/sessions`)
Full list of all recorded sessions (10 mock sessions) with filter bar by task type. Each card shows task icon, date/time, duration, flow %, avg STR, and peak STR.

### 3. Session Detail (`/sessions/:id`)
Core analysis page featuring:
- **Flow Timeline**: Colored horizontal bar showing Flow/Focused/Neutral/Distracted states over time
- **STR Curve**: Line chart of Subjective Time Rate with reference line at 1.0
- **Summary Stats**: Flow time %, longest streak, avg/peak STR
- **Sensor Data Quality**: Progress bars for Eye Tracker, EEG, Heart Rate
- **Annotations**: Clickable tags to label segments
- **Editable Task Label**: Switch task type inline

### 4. Trends (`/trends`)
Analytics page with:
- Weekly flow time bar chart (7 days)
- Average STR by task type horizontal bar chart
- Best focus time of day bar chart
- 4 auto-generated text insights

### 5. Compare (`/compare`)
Select 2 sessions from dropdowns for side-by-side comparison of Flow Timeline, STR Curve, and summary stats.

### 6. Settings (`/settings`)
- Sensor permission toggles (Eye Tracker, EEG, Heart Rate)
- Data quality threshold slider
- Flow detection sensitivity (Conservative / Balanced / Aggressive)
- Export session data button (mock toast)
- Local storage / cloud sync toggle

---

## System Architecture

```
Multi-Modal Sensors
    ├── Eye Tracker  ──┐
    ├── EEG          ──┼──▶  Multimodal Transformer  ──▶  STR + Flow State Output
    └── Heart Rate   ──┘
                              │
                              ▼
                    FlowSense Frontend
                    (React + Recharts)
                              │
                    ┌─────────┴──────────┐
                    │  Flow Timeline      │
                    │  STR Curve Chart   │
                    │  Session Analytics │
                    └────────────────────┘
```

**Subjective Time Rate (STR):**
- STR < 1.0 → Time feels faster than real-time (Flow state)
- STR = 1.0 → Neutral (time feels normal)
- STR > 1.0 → Time feels slower than real-time (Distracted/Bored)

**Flow States:**
- 🟣 **Flow** (STR ~0.4–0.7): Deep focus, time flies
- 🩵 **Focused** (STR ~0.7–0.9): Engaged concentration
- ⬜ **Neutral** (STR ~0.9–1.1): Normal awareness
- 🟡 **Distracted** (STR ~1.1–1.5): Mind wandering, time drags

---

## File Structure

```
Figma-build-26/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── data/
    │   └── mockData.js         # 10 mock sessions
    ├── components/
    │   ├── Layout.jsx          # Root layout with sidebar + outlet
    │   ├── Sidebar.jsx         # Desktop navigation sidebar
    │   ├── BottomNav.jsx       # Mobile bottom navigation
    │   ├── SessionCard.jsx     # Session list item card
    │   ├── FlowTimeline.jsx    # Horizontal state timeline bar
    │   ├── STRChart.jsx        # STR line chart (Recharts)
    │   ├── SummaryCard.jsx     # Stats metric card
    │   ├── InsightCard.jsx     # Auto-insight text card
    │   └── DataQualityBar.jsx  # Sensor quality progress bars
    └── pages/
        ├── Home.jsx            # Dashboard (/)
        ├── Sessions.jsx        # Sessions list (/sessions)
        ├── SessionDetail.jsx   # Session detail (/sessions/:id)
        ├── Trends.jsx          # Analytics (/trends)
        ├── Compare.jsx         # Side-by-side compare (/compare)
        └── Settings.jsx        # App settings (/settings)
```

---

## Screenshots

> _Screenshots will be added after deployment._

---

## Design

- **Dark mode** by default (slate-900 background)
- **Accent colors**: Purple for Flow, Teal for Focused, Amber for Distracted
- Responsive layout: sidebar on desktop, bottom nav on mobile
- Clean, data-forward UI inspired by Apple Health and Oura Ring
