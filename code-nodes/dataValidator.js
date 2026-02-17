// n8n Code Node: Validate Job Data
// Mode: Run Once for All Items
// Purpose: Validates required fields and data quality before distribution.
//          Outputs isValid boolean and validationErrors array.

const items = $input.all();

return items.map(item => {
  const d = item.json;
  const errors = [];

  if (!d.title || d.title === 'Poste sans titre') {
    errors.push('Le titre est requis');
  }
  if (!d.company || d.company === 'Entreprise non spécifiée') {
    errors.push('L\'entreprise est requise');
  }
  if (!d.description || d.description.length < 20) {
    errors.push('La description doit contenir au moins 20 caractères');
  }
  if (d.applyUrl && d.applyUrl !== '#') {
    try {
      new URL(d.applyUrl);
    } catch {
      errors.push('L\'URL de candidature n\'est pas valide');
    }
  }

  const validCategories = ['Tech', 'Creative', 'Executive'];
  const category = d.category.charAt(0).toUpperCase() + d.category.slice(1).toLowerCase();

  return {
    json: {
      ...d,
      category: validCategories.includes(category) ? category : 'Tech',
      isValid: errors.length === 0,
      validationErrors: errors
    }
  };
});
