# Airtable Base Setup

## Step 1: Create a New Base

1. Go to [airtable.com](https://airtable.com) and sign in
2. Click **+ Add a base** > **Start from scratch**
3. Name it **Job Distribution System**

## Step 2: Create the "Job Postings" Table

Rename the default table to **Job Postings** and add these fields:

| Field Name | Field Type | Configuration |
|------------|-----------|---------------|
| Title | Single line text | (default) |
| Company | Single line text | |
| Description | Long text | Enable rich text formatting |
| Requirements | Long text | One requirement per line |
| Salary | Single line text | e.g. "$120k-$150k" |
| Location | Single line text | e.g. "Remote (US)" |
| Job Type | Single select | Options: `Full-time`, `Part-time`, `Contract`, `Freelance`, `Internship` |
| Apply URL | URL | |
| Category | Single select | Options: `Tech`, `Creative`, `Executive` |
| Status | Single select | Options: `Draft`, `Ready to Distribute`, `Distributing`, `Distributed`, `Partial`, `Failed` |

### Recommended Views

1. **Grid view** (default): All records
2. **Kanban view** named "Pipeline": Group by `Status` field
3. **Grid view** named "Ready to Send": Filter where `Status` = `Ready to Distribute`

## Step 3: Create the "Distribution Log" Table

Create a new table called **Distribution Log** with these fields:

| Field Name | Field Type | Configuration |
|------------|-----------|---------------|
| Job Posting | Link to another record | Link to "Job Postings" table |
| Channel | Single select | Options: `LinkedIn`, `Twitter`, `Email` |
| Status | Single select | Options: `Success`, `Failed`, `Simulated` |
| Timestamp | Date time | Include time field, use 24-hour format |
| Response | Long text | Stores API response or error message |
| Formatted Content | Long text | The actual content that was sent |
| Execution ID | Single line text | n8n execution ID for debugging |

### Recommended Views

1. **Grid view** named "Recent Activity": Sort by `Timestamp` descending, limit to last 50
2. **Grid view** named "Failures": Filter where `Status` = `Failed`
3. **Grid view** named "By Channel": Group by `Channel`

## Step 4: Generate API Access

1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Click **Create new token**
3. Name it `n8n-job-distribution`
4. Add scopes:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
5. Add access to your **Job Distribution System** base
6. Copy the token (starts with `pat...`)
7. Add this token as an Airtable credential in n8n

## Step 5: Import Sample Data

See `templates/sample-data/sample-jobs-sheet-link.md` for 5 sample job records to import.

1. Create a Google Sheet with the sample data
2. Download as CSV
3. In Airtable, click the dropdown arrow on the Job Postings table name > **Import data** > upload the CSV
4. Map columns to the fields you created
