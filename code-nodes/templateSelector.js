// n8n Code Node: Select Template
// Mode: Run Once for All Items
// Purpose: Attaches template configuration (tone, emojis, hashtags, colors)
//          based on job category (Tech, Creative, Executive).

const items = $input.all();

const templates = {
  Tech: {
    tone: 'technical',
    emoji: { primary: '\u{1F680}', secondary: '\u{1F4BB}', accent: '\u2699\uFE0F' },
    hashtags: ['#Emploi', '#Développeur', '#Recrutement', '#Télétravail', '#Tech'],
    emailAccent: '#2563EB',
    linkedinStyle: 'axé données avec détails techniques'
  },
  Creative: {
    tone: 'creative',
    emoji: { primary: '\u{1F3A8}', secondary: '\u270D\uFE0F', accent: '\u2728' },
    hashtags: ['#EmploiCréatif', '#Design', '#Recrutement', '#Créatif', '#Opportunité'],
    emailAccent: '#7C3AED',
    linkedinStyle: 'inspirant et visuellement descriptif'
  },
  Executive: {
    tone: 'executive',
    emoji: { primary: '\u{1F4BC}', secondary: '\u{1F3AF}', accent: '\u{1F451}' },
    hashtags: ['#Direction', '#Leadership', '#Recrutement', '#Cadre', '#Management'],
    emailAccent: '#0F172A',
    linkedinStyle: 'stratégique et visionnaire'
  }
};

return items.map(item => {
  const category = item.json.category || 'Tech';
  return {
    json: {
      ...item.json,
      template: templates[category] || templates.Tech
    }
  };
});
