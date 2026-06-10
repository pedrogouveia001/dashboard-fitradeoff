const fs = require('fs');
const parser = require('./parser.js');

let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const initialCount = data.length;

// Filter out empty or malformed articles
data = data.filter(art => {
  if (!art.title || art.title.trim().length < 5) {
    console.log(`Removing empty/malformed article: ${JSON.stringify(art)}`);
    return false;
  }
  return true;
});

// Re-classify economyArea and normalize authors
const seenTitles = new Set();
const cleanedData = [];

data.forEach(art => {
  // Re-normalize authors
  if (art.authors) {
    art.authors = art.authors
      .map(parser.normalizeAuthorName)
      .filter(a => a && a.trim().length > 0);
  }
  
  // Re-classify economyArea
  if (art.title) {
    art.economyArea = parser.classifyEconomyArea(art.title, art.authors, art.year);
  }
  
  // Deduplicate
  const titleKey = art.title.toLowerCase().substring(0, 30).trim();
  if (!seenTitles.has(titleKey)) {
    seenTitles.add(titleKey);
    cleanedData.push(art);
  } else {
    console.log(`Removing duplicate article: "${art.title}"`);
  }
});

fs.writeFileSync('data.json', JSON.stringify(cleanedData, null, 2), 'utf8');
console.log(`Database cleaned! Initial: ${initialCount}, Cleaned: ${cleanedData.length}`);
