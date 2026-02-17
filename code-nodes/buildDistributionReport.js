// n8n Code Node: Build Distribution Report
// Mode: Run Once for All Items
// Purpose: Aggregates results from all distribution channels into a summary.
//          Sets the overall status (Distributed / Partial / Failed) and
//          feeds into both the Airtable status update and webhook response.

// Read directly from Merge output (before Airtable transforms the data)
const items = $('Merge All Results').all();

const results = items.map(item => item.json);

const succeeded = results.filter(r => r.status === 'Success' || r.status === 'Simulated');
const failed = results.filter(r => r.status === 'Failed');

let overallStatus;
if (failed.length === 0) {
  overallStatus = 'Distributed';
} else if (succeeded.length === 0) {
  overallStatus = 'Failed';
} else {
  overallStatus = 'Partial';
}

const summary = {
  jobTitle: results[0]?.jobTitle || 'Unknown',
  totalChannels: results.length,
  succeeded: succeeded.length,
  failed: failed.length,
  channels: results.map(r => ({
    channel: r.channel,
    status: r.status
  })),
  overallStatus,
  completedAt: new Date().toISOString(),
  airtableRecordId: results[0]?.airtableRecordId || '',
  executionId: results[0]?.executionId || ''
};

console.log('=== DISTRIBUTION SUMMARY ===');
console.log(`Job: ${summary.jobTitle}`);
console.log(`Status: ${summary.overallStatus}`);
console.log(`Channels: ${summary.succeeded}/${summary.totalChannels} succeeded`);
console.log('============================');

return [{ json: summary }];
