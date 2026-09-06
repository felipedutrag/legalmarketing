# ⚖️ LegalMarketing — High-Converting Legal Landing Page Engine & Multichannel AI Sales Agent

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Upstash_Redis-00E599?style=for-the-badge&logo=redis&logoColor=white" alt="Upstash Redis" />
  <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Groq_Whisper-F55036?style=for-the-badge&logo=groq&logoColor=white" alt="Groq Whisper" />
  <img src="https://img.shields.io/badge/Cal.com_API-292929?style=for-the-badge&logo=calendar&logoColor=white" alt="Cal.com" />
  <img src="https://img.shields.io/badge/ManyChat_WhatsApp-0084FF?style=for-the-badge&logo=whatsapp&logoColor=white" alt="ManyChat WhatsApp" />
</p>

---

## 📌 Executive Summary

**LegalMarketing** is an enterprise-grade client acquisition platform combining high-converting, OAB-compliant legal landing pages with an autonomous 24/7 conversational sales agent.

Engineered specifically for boutique law firms, specialized advocates, and high-ticket service professionals, the platform pairs an automated local lead scraper and landing page generator with a multi-stage WhatsApp AI closer. By orchestrating **Google Gemini**, **Groq Whisper STT (Speech-to-Text)**, **ManyChat API**, and **Cal.com scheduling**, LegalMarketing transcribes incoming voice notes, manages stateful conversation funnels in **Upstash Redis**, and schedules qualified discovery meetings directly into Google Calendar without human friction.

---

## 🏗️ System Architecture & Workflow

```
+-----------------------------------------------------------------------------------+
|                            LEAD ACQUISITION ENGINE                                |
|  Puppeteer Google Maps Scraper  -->  Gemini Page Synthesizer  -->  Vercel Edge LP |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        AUTONOMOUS WHATSAPP CONVERSATIONAL AGENT                   |
|                                                                                   |
|  Incoming WhatsApp Message (Text or Audio)                                        |
|     │                                                                             |
|     ├─► [Audio Note] ───────► Groq Whisper STT (Transcribed to Text)              |
|     └─► [Text Message] ─────┘                                                     |
|                                     │                                             |
|                                     ▼                                             |
|           Upstash Redis State Management (Stage, History & Rate Limits)           |
|                                     │                                             |
|                                     ▼                                             |
|              Google Gemini 2.5/3.5 Reasoning + Function Calling                    |
|                ├── check_availability (Cal.com API)                               |
|                ├── book_appointment (Sends Google Meet link)                     |
|                ├── cancel_or_reschedule (Cal.com API)                             |
|                └── handoff_to_human (Alerts team for VIP closing)                 |
|                                     │                                             |
|                                     ▼                                             |
|               ManyChat API ──► Instant WhatsApp Response                          |
+-----------------------------------------------------------------------------------+
```

### 1. Programmatic Scraping & Page Generation
- Headless Puppeteer crawler gathers qualified local attorney data (specialties, phone numbers, ratings, addresses) directly from Google Maps.
- Generative scripts synthesize tailor-made, localized landing page mockups and sales proposals ready for outbound pitch sequences.

### 2. Multi-Stage Sales Funnel (Upstash Redis)
Tracks each lead through discrete lifecycle states:
- `f_novo_contato`: Initial hook and conversational value presentation.
- `f_interessado`: Value-reinforcement, handling objections, addressing immediate pain points.
- `f_reuniao_agendada`: Meeting confirmed; suppresses repetitive offers, confirms calendar details.
- `f_fechamento`: Closing stage triggering automated handoff to lead closer.
- `f_cliente` & `f_nutricao`: Post-sales support and automated nurture sequences.

### 3. Audio Voice Note Understanding (Groq Whisper)
- Automatically intercepts voice memos sent by prospective clients on WhatsApp.
- Downloads audio streams via ManyChat CDN and runs rapid transcription using `whisper-large-v3` via Groq's high-speed inference engine.

### 4. Autonomous Calendar Scheduling (Cal.com v2)
- Uses LLM function calling to query available real-time calendar slots via Cal.com API.
- Converts conversational dates (*"next Thursday afternoon"*) into ISO slots, confirms user email, generates calendar invites, and sends Google Meet links.

---

## ✨ Core Features

| Feature | Description |
|---|---|
| 🎙️ **Voice Note Processing** | Real-time Whisper STT transcription for incoming WhatsApp voice audio |
| 📅 **Native Cal.com Booking** | Zero-click meeting scheduling with automated timezone conversion and Google Meet generation |
| 🛡️ **OAB-Compliant Design** | Ethical, high-trust presentation built specifically for legal regulations |
| ⚡ **Redis Session Memory** | Stateful conversation retention, deduplication, and atomic rate limiting |
| 🔄 **Automated Generation Pipeline** | CLI scripts to scrape regional lawyers and generate customized proposal pages |
| 📱 **High-Conversion Mobile UI** | Modern dark mode, sticky WhatsApp CTAs, interactive decks, and sub-second load times |

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | Next.js 14 (App Router), React 18, Tailwind CSS |
| **Language** | TypeScript, Node.js |
| **State & Caching** | Upstash Redis (`@upstash/redis`) |
| **AI & LLM Inference** | Google Gemini (`@google/generative-ai`), Groq SDK (`whisper-large-v3`) |
| **Communication API** | ManyChat WhatsApp Cloud API |
| **Scheduling Engine** | Cal.com API v2 |
| **Scraping & Lead Gen** | Puppeteer, Node.js CLI scripts |

---

## 📂 Repository Structure

```
legalmarketing/
├── public/                         # Brand assets, high-res photos, and landing templates
│   ├── assets/                     # Logos, hero images, and branding SVGs
│   ├── modelo/                     # Static generated templates
│   └── roberto-nonato/             # Live sample legal practice mockup
├── scripts/                        # Outbound lead generation pipeline
│   ├── generators/                 # Gemini landing page generation scripts
│   ├── scrapers/                   # Puppeteer Google Maps legal lead scrapers
│   └── pipeline.cjs                # End-to-end scrape, generate & deploy orchestrator
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── process-ai/         # Primary webhook engine (Gemini + Whisper + Funnel)
│   │   │   ├── agendamento-ia/     # Direct Cal.com booking webhook
│   │   │   ├── webhook/            # ManyChat incoming event receiver
│   │   │   └── propostas/          # Dynamic proposal endpoint
│   │   ├── components/             # React UI components (Deck, DarkMode, WhatsAppBtn)
│   │   ├── pix/                    # Checkout & payment confirmation view
│   │   ├── roberto-nonato/         # Interactive showcase legal landing page
│   │   └── page.tsx                # Main commercial landing page
│   └── lib/
│       ├── calcom.ts               # Cal.com slot search & booking integration
│       ├── funnel.ts               # Redis funnel stage state machine
│       ├── gemini.ts               # Gemini client configuration
│       ├── manychat.ts             # ManyChat subscriber & messaging API
│       └── stt.ts                  # Groq Whisper audio downloader and transcriber
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Upstash Redis instance (REST URL and Token)
- Google Gemini API Key
- Groq API Key (for Whisper STT)
- Cal.com API key and Event Type ID
- ManyChat API token

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/felipedutrag/legalmarketing.git
   cd legalmarketing
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file:
   ```env
   UPSTASH_REDIS_REST_URL="https://your-upstash-url.upstash.io"
   UPSTASH_REDIS_REST_TOKEN="your-upstash-token"
   GEMINI_API_KEY="your-gemini-key"
   GROQ_API_KEY="your-groq-key"
   CALCOM_API_KEY="your-calcom-key"
   CALCOM_EVENT_TYPE_ID="5650035"
   MANYCHAT_API_KEY="your-manychat-key"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

5. **Run the Lead Generation & Scraping Pipeline:**
   ```bash
   npm run pipeline "Sao Paulo"
   ```

---

## 👤 Author

Developed by **Felipe Dutra**  
- **GitHub:** [@felipedutrag](https://github.com/felipedutrag)  
- **Email:** [felipedutra@outlook.com](mailto:felipedutra@outlook.com)
