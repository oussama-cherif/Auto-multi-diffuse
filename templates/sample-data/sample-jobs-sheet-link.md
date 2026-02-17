# Donnees Exemples - Offres d'Emploi

Creer un Google Sheet avec les colonnes et donnees suivantes, puis importer dans Airtable.

## Colonnes

| Title | Company | Description | Requirements | Salary | Location | Job Type | Apply URL | Category | Status |

## Exemples

### Offre 1 : Tech
- **Title:** Developpeur Full-Stack Senior
- **Company:** DataNova Solutions
- **Description:** Nous recherchons un developpeur full-stack experimente pour rejoindre notre equipe produit. Vous travaillerez sur notre plateforme SaaS utilisee par plus de 30 000 entreprises en France. Notre stack technique comprend React, TypeScript, Node.js et PostgreSQL.
- **Requirements:** 5+ ans d'experience en developpement web | Maitrise de React et TypeScript | Connaissance de Node.js et des API REST | Experience avec les bases de donnees relationnelles | Familiarite avec les pipelines CI/CD
- **Salary:** 50 000 - 65 000 EUR
- **Location:** Teletravail (France)
- **Job Type:** CDI
- **Apply URL:** https://example.com/postuler/fullstack-senior
- **Category:** Tech
- **Status:** Ready to Distribute

### Offre 2 : Creative
- **Title:** Directeur Artistique
- **Company:** Agence Creapulse
- **Description:** Pilotez la direction artistique de campagnes de communication pour des marques nationales et internationales. Vous encadrerez une equipe de 6 designers et collaborerez directement avec les clients pour transformer leurs objectifs business en identites visuelles percutantes.
- **Requirements:** 7+ ans en direction artistique | Experience en management d'equipe creative | Maitrise de Figma et Adobe Creative Suite | Portfolio solide en identite de marque
- **Salary:** 55 000 - 70 000 EUR
- **Location:** Paris, 75009 (Hybride)
- **Job Type:** CDI
- **Apply URL:** https://example.com/postuler/directeur-artistique
- **Category:** Creative
- **Status:** Ready to Distribute

### Offre 3 : Executive
- **Title:** VP Engineering
- **Company:** FrenchTech Ventures
- **Description:** Definissez la strategie technique et dirigez les equipes d'ingenierie de notre portefeuille de startups en forte croissance. Ce poste requiert un leader visionnaire capable de construire des cultures d'ingenierie de classe mondiale et de livrer des logiciels de qualite entreprise au rythme startup.
- **Requirements:** 10+ ans de leadership en ingenierie | Experience dans le scaling d'equipes de 20 a 100+ personnes | Track record de lancements produits reussis | Solide background en architecture cloud
- **Salary:** 90 000 - 120 000 EUR + equity
- **Location:** Paris, La Defense
- **Job Type:** CDI
- **Apply URL:** https://example.com/postuler/vp-engineering
- **Category:** Executive
- **Status:** Ready to Distribute

### Offre 4 : Tech
- **Title:** Ingenieur DevOps
- **Company:** CloudFirst France
- **Description:** Rejoignez notre equipe infrastructure pour construire et maintenir des plateformes cloud scalables. Vous travaillerez avec Kubernetes, Terraform et AWS pour assurer une disponibilite de 99.99% des applications critiques de nos clients.
- **Requirements:** 3+ ans d'experience DevOps | Certification Kubernetes appreciee | Expertise AWS ou GCP | Maitrise de l'Infrastructure as Code | Outils de monitoring et observabilite
- **Salary:** 45 000 - 58 000 EUR
- **Location:** Teletravail (France/Europe)
- **Job Type:** CDI
- **Apply URL:** https://example.com/postuler/devops
- **Category:** Tech
- **Status:** Draft

### Offre 5 : Creative
- **Title:** Responsable Marketing de Contenu
- **Company:** DigitalFlow Agency
- **Description:** Prenez en charge notre strategie de contenu de l'ideation a la distribution. Vous creerez des narratifs convaincants qui generent de l'engagement sur les reseaux sociaux, l'email et le blog. Ce poste combine creativite et prise de decision basee sur les donnees.
- **Requirements:** 4+ ans en marketing de contenu | Connaissance SEO | Maitrise des outils analytics (GA4) | Portfolio redactionnel solide | Experience en gestion de reseaux sociaux
- **Salary:** 38 000 - 48 000 EUR
- **Location:** Lyon (Hybride)
- **Job Type:** CDI
- **Apply URL:** https://example.com/postuler/content-manager
- **Category:** Creative
- **Status:** Ready to Distribute

## Comment utiliser

1. Creer un nouveau Google Sheet
2. Copier les colonnes ci-dessus en en-tetes sur la Ligne 1
3. Ajouter chaque offre comme une ligne
4. Utiliser le pipe `|` pour separer les requirements (n8n splittera sur les retours a la ligne, remplacer `|` par des retours a la ligne dans Airtable)
5. Importer dans Airtable : utiliser la fonction "CSV import" ou creer les enregistrements manuellement
