const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const categories = {};

data.forEach(art => {
  const cat = art.economyArea || 'Undefined';
  if (!categories[cat]) {
    categories[cat] = [];
  }
  categories[cat].push(art.title);
});

console.log('Categories and their article titles:');
for (const [cat, titles] of Object.entries(categories)) {
  console.log(`\n=== ${cat} (${titles.length} articles) ===`);
  titles.slice(0, 10).forEach(t => console.log(` - ${t}`));
  if (titles.length > 10) console.log(` ... and ${titles.length - 10} more`);
}
