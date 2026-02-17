// n8n Code Node: Normalize Job Data
// Mode: Run Once for All Items
// Purpose: Maps Airtable field names ("Job Type") and webhook camelCase
//          to a consistent schema used by all downstream nodes.

const items = $input.all();

return items.map(item => {
  const d = item.json;

  const normalized = {
    title:            d.Title        || d.title        || 'Poste sans titre',
    company:          d.Company      || d.company      || 'Entreprise non spécifiée',
    description:      d.Description  || d.description  || '',
    requirements:     d.Requirements || d.requirements || '',
    salary:           d.Salary       || d.salary       || 'Compétitif',
    location:         d.Location     || d.location     || 'Non spécifié',
    jobType:          d['Job Type']  || d.jobType      || 'CDI',
    applyUrl:         d['Apply URL'] || d.applyUrl     || '#',
    category:         d.Category     || d.category     || 'Tech',
    triggerSource:    d.triggerSource,
    airtableRecordId: d.airtableRecordId || d.id || '',
    executionId:      $execution.id,
    processedAt:      new Date().toISOString()
  };

  return { json: normalized };
});
