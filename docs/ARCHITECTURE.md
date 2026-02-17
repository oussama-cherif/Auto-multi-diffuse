# Architecture

## Workflow Diagram

```
[Airtable Trigger] ──┐
                      ├──> [Normalize Data] ──> [Validate] ──> [IF Valid?]
[Webhook Trigger] ────┘                                          │
                                                           ┌─ Yes ─┐
                                                           │       │
                                                    [Select Template]
                                                           │
                                          ┌────────────────┼────────────────┐
                                          │                │                │
                                   [Format LinkedIn] [Format Twitter] [Format Email]
                                          │                │                │
                                   [Simulate         [Simulate        [Send
                                    LinkedIn]         Twitter]         Email]
                                          │                │                │
                                          └────────────────┼────────────────┘
                                                           │
                                                    [Merge Results]
                                                           │
                                                [Write Distribution Logs]
                                                           │
                                                [Build Summary Report]
                                                           │
                                          ┌────────────────┴────────────────┐
                                   [Update Job Status]            [Respond to Webhook]
```

## Node Inventory

| # | Node Name | Type | Purpose |
|---|-----------|------|---------|
| 1 | Airtable New Job Trigger | `airtableTrigger` | Polls for new records with Status = "Ready to Distribute" |
| 2 | Webhook Job Trigger | `webhook` | POST endpoint at `/webhook/job-distribute` |
| 3 | Normalize Job Data | `code` | Maps field names to consistent schema |
| 4 | Validate Job Data | `code` | Checks required fields, URL validity |
| 5 | IF Valid | `if` | Routes valid data to processing, invalid to error log |
| 6 | Select Template | `code` | Attaches category-based template config |
| 7 | Format LinkedIn | `code` | Professional long-form post |
| 8 | Format Twitter | `code` | 280-char constrained tweet |
| 9 | Format Email | `code` | Responsive HTML email |
| 10 | Simulate LinkedIn | `code` | Mock API response + console log |
| 11 | Simulate Twitter | `code` | Mock API response + char count |
| 12 | Send Email | `gmail` | Real email delivery |
| 13 | Merge Results | `merge` | Combines all channel results |
| 14 | Write Distribution Logs | `airtable` | Creates log records per channel |
| 15 | Build Summary Report | `code` | Aggregates success/failure |
| 16 | Update Job Status | `airtable` | Updates Job Posting status |
| 17 | Respond to Webhook | `respondToWebhook` | Returns JSON report |

## Data Flow

### Input (from Airtable or Webhook)
Raw job data with platform-specific field names.

### Normalization
All fields mapped to camelCase: `title`, `company`, `description`, `requirements`, `salary`, `location`, `jobType`, `applyUrl`, `category`.

### Template Selection
Category (Tech/Creative/Executive) determines:
- Emoji sets for LinkedIn and Twitter
- Hashtag pools
- Email accent color (#2563EB / #7C3AED / #0F172A)
- Tone guidance

### Distribution
Three parallel branches:
- **LinkedIn**: Simulated (formatted post logged, mock response returned)
- **Twitter**: Simulated (formatted tweet logged, character count verified)
- **Email**: Real (HTML email sent via Gmail)

### Logging
Each channel creates one record in Airtable's Distribution Log table with:
- Channel name
- Success/Failed/Simulated status
- Formatted content
- API response or error details
- n8n execution ID

## Error Handling

### Layer 1: Input Validation
Bad data caught before reaching distribution nodes. Invalid records are logged with specific error messages.

### Layer 2: Per-Channel Isolation
Each distribution node uses "Continue on Error = Using Error Output". If one channel fails, others still execute.

### Layer 3: Global Error Handler
Separate workflow catches unhandled exceptions and logs them to Airtable.

## Design Decisions

1. **Simulated social media**: LinkedIn and Twitter APIs require paid/approved developer access. Simulation lets the workflow demonstrate full formatting logic without API restrictions.

2. **Dual triggers**: Webhook enables integration with other tools (Postman, web forms, Zapier). Airtable trigger enables zero-touch automation.

3. **Code nodes over n8n expressions**: Complex formatting (HTML email, Block Kit) is more maintainable in JavaScript Code nodes than in n8n's expression editor.

4. **Separate JS files**: Code nodes are also stored as standalone `.js` files in `code-nodes/` for version control and code review outside n8n.
