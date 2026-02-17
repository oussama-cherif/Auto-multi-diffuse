// n8n Code Node: Format LinkedIn Post
// Mode: Run Once for All Items
// Purpose: Creates a professional long-form LinkedIn post with emojis,
//          bullet-point requirements, and category-specific hashtags.
//          Output is SIMULATED (not posted to LinkedIn API).

const items = $input.all();

return items.map(item => {
  const d = item.json;
  const t = d.template;

  const requirementsList = d.requirements
    .split('\n')
    .filter(r => r.trim())
    .map(r => `  \u2022 ${r.trim()}`)
    .join('\n');

  const linkedinPost = `${t.emoji.primary} Nous recrutons : ${d.title} chez ${d.company} !

${d.description}

${t.emoji.accent} Profil recherché :
${requirementsList}

${t.emoji.secondary} Détails :
\u{1F4CD} Lieu : ${d.location}
\u{1F4B0} Salaire : ${d.salary}
\u23F0 Contrat : ${d.jobType}

Intéressé(e) ? Postulez maintenant : ${d.applyUrl}

${t.hashtags.slice(0, 3).join(' ')}

#${d.company.replace(/\s+/g, '')} #OnRecrute`;

  // Simulate LinkedIn API response
  const linkedinResult = {
    platform: 'LinkedIn',
    status: 'Simulated',
    simulatedPostId: `li_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    characterCount: linkedinPost.length,
    content: linkedinPost,
    timestamp: new Date().toISOString(),
    note: 'SIMULATED: LinkedIn API requires OAuth2 app approval. This represents what would be posted.'
  };

  console.log('=== LINKEDIN POST (SIMULATED) ===');
  console.log(linkedinPost);
  console.log('=================================');

  return {
    json: {
      ...d,
      linkedinPost,
      linkedinResult
    }
  };
});
