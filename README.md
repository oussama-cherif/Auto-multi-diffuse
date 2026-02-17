# Job Posting Multi-Channel Distribution System

Automated job posting distribution across LinkedIn, Twitter/X, and Email using **n8n** workflow automation with **Airtable** as the data source and logging dashboard.

## Overview

This project demonstrates a low-code automation workflow that takes a job posting and formats it for multiple platforms, distributes it, and tracks the results — all without manual effort.

```
Airtable / Webhook ──> n8n Workflow ──> LinkedIn (simulated)
                                    ──> Twitter/X (simulated)
                                    ──> Email (real)
                                    ──> Airtable Logging
```

## Features

- **Dual triggers**: Airtable new record detection + REST API webhook (testable via Postman)
- **3-channel distribution**: LinkedIn, Twitter/X (simulated), Email (real via Gmail)
- **Template system**: Tech, Creative, and Executive templates with different tones, emojis, and colors
- **Input validation**: Required field checks, URL validation, category normalization
- **Error isolation**: Per-channel error handling — one failure doesn't block other channels
- **Distribution logging**: Full audit trail in Airtable with status, timestamps, and formatted content
- **Status tracking**: Job posting status updates automatically (Distributed / Partial / Failed)

## Tech Stack

| Tool | Purpose |
|------|---------|
| [n8n](https://n8n.io) | Workflow automation engine |
| [Docker](https://docker.com) | Container runtime for n8n + PostgreSQL |
| [Airtable](https://airtable.com) | Data source + distribution logging dashboard |
| [Gmail API](https://developers.google.com/gmail/api) | Real email delivery |
| JavaScript (ES2020+) | Custom formatting logic in n8n Code nodes |

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/oussama-cherif/Auto-multi-diffuse.git
cd Auto-multi-diffuse

# 2. Start n8n + PostgreSQL
cd docker
cp .env.example .env
docker compose up -d

# 3. Open n8n at http://localhost:5678 (default: admin/admin)
# 4. Import workflow: workflows/main-job-distribution.json
# 5. Configure credentials: Airtable + Gmail OAuth2
# 6. Set up Airtable base: docs/AIRTABLE-SETUP.md
# 7. Configure nodes (trigger, logs, email recipient)
# 8. Publish the workflow
```

See [docs/SETUP.md](docs/SETUP.md) for detailed step-by-step instructions.

## API Usage

### Webhook Endpoint

```
POST http://localhost:5678/webhook/job-distribute
Content-Type: application/json
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Job title |
| `company` | string | Yes | Company name |
| `description` | string | Yes | Job description (min 20 chars) |
| `requirements` | string | No | One requirement per line (`\n` separated) |
| `salary` | string | No | Salary range (e.g. "45k-55k") |
| `location` | string | No | Job location |
| `jobType` | string | No | Contract type (defaults to "CDI") |
| `applyUrl` | string | No | Application URL (must be valid URL or `#`) |
| `category` | string | No | `Tech`, `Creative`, or `Executive` (defaults to "Tech") |

### Example Request (curl)

```bash
curl -X POST http://localhost:5678/webhook/job-distribute \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Développeur Full-Stack",
    "company": "TechVision Paris",
    "description": "Nous recherchons un développeur full-stack passionné pour rejoindre notre équipe innovation à Paris.",
    "requirements": "3 ans d'\''expérience en React/Node.js\nMaîtrise de PostgreSQL",
    "salary": "45k€–55k€",
    "location": "Paris (hybride)",
    "jobType": "CDI",
    "applyUrl": "https://example.com/postuler",
    "category": "Tech"
  }'
```

### Example Request (PowerShell)

```powershell
Invoke-RestMethod -Uri "http://localhost:5678/webhook/job-distribute" `
  -Method POST -ContentType "application/json" `
  -Body '{"title":"Développeur Full-Stack","company":"TechVision Paris","description":"Nous recherchons un développeur full-stack passionné pour rejoindre notre équipe.","requirements":"React/Node.js","salary":"45k€–55k€","location":"Paris (hybride)","jobType":"CDI","applyUrl":"#","category":"Tech"}'
```

### Success Response

```json
{
  "jobTitle": "Développeur Full-Stack",
  "totalChannels": 3,
  "succeeded": 3,
  "failed": 0,
  "channels": [
    { "channel": "LinkedIn", "status": "Simulated" },
    { "channel": "Twitter", "status": "Simulated" },
    { "channel": "Email", "status": "Success" }
  ],
  "overallStatus": "Distributed",
  "completedAt": "2026-02-17T12:18:20.946Z",
  "executionId": "31"
}
```

### Validation Error Response (HTTP 400)

```json
{
  "error": true,
  "message": "Validation failed: Le titre est requis, L'entreprise est requise",
  "validationErrors": [
    "Le titre est requis",
    "L'entreprise est requise"
  ]
}
```

### Alternative: Trigger via Airtable

1. Add a record in the **Job Postings** table with all required fields
2. Set Status to **"Ready to Distribute"**
3. The workflow polls every 60 seconds and distributes automatically

## Project Structure

```
Auto-multi-diffuse/
├── docker/                    # Docker Compose (n8n + PostgreSQL)
│   ├── docker-compose.yml
│   └── .env.example
├── workflows/                 # Importable n8n workflow files
│   ├── main-job-distribution.json      # Main 22-node workflow
│   └── error-handler-workflow.json     # Global error handler
├── code-nodes/                # Source of truth for Code node logic
│   ├── normalizeData.js       # Field name mapping & defaults
│   ├── dataValidator.js       # Input validation rules
│   ├── templateSelector.js    # Category-based template config
│   ├── formatLinkedIn.js      # LinkedIn post formatting + mock API
│   ├── formatTwitter.js       # Twitter/X tweet formatting + mock API
│   ├── formatEmail.js         # HTML email formatting
│   └── buildDistributionReport.js  # Summary aggregation
├── templates/sample-data/     # Sample job postings for testing
├── docs/                      # Setup and architecture guides
│   ├── SETUP.md               # Full installation guide
│   ├── ARCHITECTURE.md        # Workflow design & node inventory
│   └── AIRTABLE-SETUP.md      # Airtable table schemas
├── .env.example               # Root environment template
└── README.md
```

## How It Works

1. **Trigger** — A job posting enters via Airtable (auto-poll) or Webhook (REST API)
2. **Normalize** — Field names are standardized to camelCase across sources
3. **Validate** — Required fields, length, and URL format are checked
4. **Template** — Category (Tech/Creative/Executive) sets tone, emojis, colors, and hashtags
5. **Format** — Three parallel branches create platform-specific content:
   - LinkedIn: professional long-form post with emojis
   - Twitter/X: 280-character tweet with hashtags
   - Email: responsive HTML email with styled template
6. **Distribute** — Email is sent via Gmail; LinkedIn and Twitter are simulated with mock API responses
7. **Log** — Each channel writes one record to Airtable Distribution Log
8. **Update** — Job posting status updates to Distributed / Partial / Failed

## Documentation

- [Setup Guide](docs/SETUP.md) — Step-by-step installation and configuration
- [Architecture](docs/ARCHITECTURE.md) — Workflow diagram, node inventory, design decisions
- [Airtable Setup](docs/AIRTABLE-SETUP.md) — Table schemas, views, API access

## Why Simulated Social Media?

LinkedIn's API requires an approved company page application, and Twitter/X's API now requires a paid tier. Rather than skip these channels entirely, the workflow includes full formatting logic and simulates the posting step — demonstrating the complete pipeline without API restrictions. The simulation nodes log the exact content that would be posted and return mock API responses for the logging system.

## License

MIT
