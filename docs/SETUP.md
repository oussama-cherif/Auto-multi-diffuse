# Setup Guide

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Airtable](https://airtable.com) account (free tier works)
- Gmail account for email distribution
- [Postman](https://www.postman.com/) or curl (for testing the webhook)

## Step 1: Clone and Configure

```bash
git clone https://github.com/oussama-cherif/Auto-multi-diffuse.git
cd Auto-multi-diffuse
```

## Step 2: Start n8n with Docker

```bash
cd docker
cp .env.example .env
docker compose up -d
```

Wait about 30 seconds for services to initialize. Check status:

```bash
docker compose logs -f n8n
```

Once you see `n8n ready on 0.0.0.0, port 5678`, open http://localhost:5678 in your browser.

Default credentials: `admin` / `admin` (change after first login).

## Step 3: Set Up Airtable

Follow the detailed instructions in [AIRTABLE-SETUP.md](AIRTABLE-SETUP.md).

Summary:
1. Create a base named **Job Distribution System**
2. Create two tables: **Job Postings** and **Distribution Log** with the exact field schemas
3. Add a **Created Time** field to Job Postings (required for the Airtable trigger)
4. Generate a Personal Access Token at [airtable.com/create/tokens](https://airtable.com/create/tokens)

## Step 4: Set Up Gmail OAuth2

### 4a: Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Go to **APIs & Services** > **Enabled APIs & Services**
4. Click **+ ENABLE APIS AND SERVICES** > search and enable **Gmail API**
5. Go to **APIs & Services** > **OAuth consent screen**
   - Choose **External** user type
   - Fill in app name, email
   - Under **Scopes**, add `https://mail.google.com/`
   - Under **Test users**, add your Gmail address
6. Go to **APIs & Services** > **Credentials** > **+ CREATE CREDENTIALS** > **OAuth client ID**
   - Application type: **Web application**
   - Authorized redirect URI: `http://localhost:5678/rest/oauth2-credential/callback`
   - Copy the **Client ID** and **Client Secret**

### 4b: n8n Gmail Credential

1. In n8n, go to **Settings** > **Credentials** > **Add Credential**
2. Search for **Gmail OAuth2 API**
3. Paste the **Client ID** and **Client Secret** from Google Cloud
4. Click **Sign in with Google** and authorize
5. Save the credential

## Step 5: Configure n8n Credentials (Airtable)

1. In n8n, go to **Settings** > **Credentials** > **Add Credential**
2. Search for **Airtable Personal Access Token**
3. Paste your token (starts with `pat...`)
4. Save

## Step 6: Import the Workflow

1. In n8n, click **+** (top left) > **Import from File**
2. Select `workflows/main-job-distribution.json`

## Step 7: Configure Workflow Nodes

After importing, you need to configure 4 nodes with your credentials and settings:

### 7a: Airtable New Job Trigger

1. Double-click the node
2. Select your **Airtable credential**
3. Base: select **Job Distribution System**
4. Table: select **Job Postings**
5. Trigger field: **Created Time**
6. Save

### 7b: Write Distribution Logs

1. Double-click the node
2. Select your **Airtable credential**
3. Base: **Job Distribution System**
4. Table: **Distribution Log**
5. Mapping Column Mode: **Map Each Column Manually**
6. Map these fields (switch each to Expression mode):

| Airtable Field | Expression |
|---|---|
| Channel | `{{ $json.channel }}` |
| Status | `{{ $json.status }}` |
| Timestamp | `{{ $json.timestamp }}` |
| Response | `{{ $json.response }}` |
| Formatted Content | `{{ $json.formattedContent }}` |
| Execution ID | `{{ $json.executionId }}` |

7. Delete any other fields (Name, Job Posting) from the mapping
8. Save

### 7c: Update Job Status

1. Double-click the node
2. Select your **Airtable credential**
3. Base: **Job Distribution System**
4. Table: **Job Postings**
5. Mapping Column Mode: **Map Each Column Manually**
6. Map: **Status** = `{{ $json.overallStatus }}`
7. Columns to match on: **id**
8. Save

### 7d: Send Email

1. Double-click the node
2. Select your **Gmail OAuth2** credential
3. In the **To** field, set expression: `{{ $json.emailTo || 'your-email@gmail.com' }}`
   - Replace `your-email@gmail.com` with your actual email
4. Save

## Step 8: Publish the Workflow

Click the **Publish** button (top-right corner) to activate the workflow.

## Step 9: Test

### Test via Webhook (curl)

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

### Test via PowerShell

```powershell
Invoke-RestMethod -Uri "http://localhost:5678/webhook/job-distribute" `
  -Method POST -ContentType "application/json" `
  -Body '{"title":"Développeur Full-Stack","company":"TechVision Paris","description":"Nous recherchons un développeur full-stack passionné pour rejoindre notre équipe.","requirements":"React/Node.js","salary":"45k€–55k€","location":"Paris (hybride)","jobType":"CDI","applyUrl":"#","category":"Tech"}'
```

### Test via Airtable

1. Create a new record in the **Job Postings** table with all required fields
2. Set Status to **"Ready to Distribute"**
3. Wait up to 60 seconds for the trigger to poll
4. Check the **Distribution Log** table for results

### Expected Result

- 3 records in Distribution Log (LinkedIn: Simulated, Twitter: Simulated, Email: Success)
- Email received in your inbox
- Job posting status updated to "Distributed"
- Webhook returns JSON summary with all channel results

## Troubleshooting

### n8n won't start
```bash
cd docker
docker compose down
docker compose up -d
docker compose logs n8n
```

### Airtable trigger doesn't fire
- Ensure the workflow is **Published** (orange dot next to Publish button)
- Check that the record's Status is exactly `Ready to Distribute`
- The trigger polls every 60 seconds — wait at least 1 minute
- Verify the **Created Time** field exists in Job Postings

### Webhook returns validation errors
- Ensure `title`, `company`, and `description` (min 20 chars) are all provided
- The `applyUrl` must be a valid URL or `#`

### Email not sending ("Forbidden" error)
- Enable **Gmail API** in Google Cloud Console
- Add **`https://mail.google.com/`** scope in OAuth consent screen
- Add your email as a **Test user** if app is in Testing mode
- **Reconnect** the Gmail credential in n8n after scope changes

### Airtable "Unknown field name" error
- Ensure all Distribution Log fields exist with exact names: Channel, Status, Timestamp, Response, Formatted Content, Execution ID
- Field names are case-sensitive
- Use **Map Each Column Manually** mode (not Auto)

## Stopping the Project

```bash
cd docker
docker compose down        # Stop containers
docker compose down -v     # Stop and delete all data (fresh start)
```
