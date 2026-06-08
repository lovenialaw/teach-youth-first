const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const headPartial = fs.readFileSync(path.join(root, 'partials', 'head.html'), 'utf8');

function between(start, end) {
  const s = src.indexOf(start);
  if (s === -1) throw new Error('Missing: ' + start);
  const e = src.indexOf(end, s);
  if (e === -1) throw new Error('Missing end after: ' + start);
  return src.slice(s, e).trim();
}

function replaceProgramLinks(html) {
  return html
    .replace(/href="#program-/g, 'href="programs.html#program-')
    .replace(/href="#programs"/g, 'href="programs.html"');
}

const sections = {
  hero: between('<!-- Hero Section -->', '<!-- About Section -->'),
  about: between('<!-- About Section -->', '<!-- Mission & Vision Section -->'),
  mission: between('<!-- Mission & Vision Section -->', '<!-- Programs overview'),
  programs: replaceProgramLinks(between('<!-- Programs overview', '<!-- Partners Section -->')),
  partners: between('<!-- Partners Section -->', '<!-- Schools Section -->'),
  schools: between('<!-- Schools Section -->', '<!-- Team Section -->'),
  team: between('<!-- Team Section -->', '<!-- Impact Section -->'),
  impact: between('<!-- Impact Section -->', '<!-- Contact Section -->'),
  contact: between('<!-- Contact Section -->', '<!-- Footer -->'),
};

function pageShell({ title, description, page, mainClass, bodyClass, content }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
${headPartial}
  <title>${title} | Teach Youth First</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="https://teachyouthfirst/${page === 'home' ? '' : page + '.html'}" />
</head>
<body class="${bodyClass}" data-page="${page}">
  <div id="site-nav"></div>
  <main class="${mainClass}">
${content}
  </main>
  <div id="site-footer"></div>
  <script src="layout.js?v=13"></script>
  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
  <script src="script.js?v=13"></script>
</body>
</html>
`;
}

const pages = [
  {
    file: 'index.html',
    title: 'Home',
    description: 'Teach Youth First empowers education for children in Sarawak, Malaysia.',
    page: 'home',
    mainClass: 'page-main page-main--hero',
    bodyClass: 'page-loading',
    content: sections.hero.replace('href="#programs"', 'href="programs.html"'),
  },
  {
    file: 'about.html',
    title: 'About',
    description: 'Learn about Teach Youth First — our story, mission, vision, and commitment to education in Sarawak.',
    page: 'about',
    mainClass: 'page-main',
    bodyClass: 'page-loading',
    content: sections.about + '\n\n' + sections.mission,
  },
  {
    file: 'programs.html',
    title: 'Programs',
    description: 'Explore TYF literacy, numeracy, skills development, resources, and volunteer programs.',
    page: 'programs',
    mainClass: 'page-main',
    bodyClass: 'page-loading',
    content: sections.programs.replace(/href="programs\.html#program-/g, 'href="#program-'),
  },
  {
    file: 'partners.html',
    title: 'Partners',
    description: 'Meet our partner organizations and schools across Sarawak.',
    page: 'partners',
    mainClass: 'page-main',
    bodyClass: 'page-loading',
    content: sections.partners + '\n\n' + sections.schools,
  },
  {
    file: 'team.html',
    title: 'Team',
    description: 'Meet the Teach Youth First leadership team.',
    page: 'team',
    mainClass: 'page-main',
    bodyClass: 'page-loading',
    content: sections.team,
  },
  {
    file: 'impact.html',
    title: 'Impact',
    description: 'See the impact Teach Youth First is making for children in Sarawak.',
    page: 'impact',
    mainClass: 'page-main',
    bodyClass: 'page-loading',
    content: sections.impact,
  },
  {
    file: 'contact.html',
    title: 'Contact',
    description: 'Get in touch with Teach Youth First to volunteer or partner with us.',
    page: 'contact',
    mainClass: 'page-main',
    bodyClass: 'page-loading',
    content: sections.contact,
  },
];

pages.forEach(p => {
  const out = pageShell(p);
  fs.writeFileSync(path.join(root, p.file), out, 'utf8');
  console.log('Wrote', p.file);
});
