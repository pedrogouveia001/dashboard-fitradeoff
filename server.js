// FITradeoff Literature Dashboard Local Backend Server (Node.js)
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

// Import the parser module dynamically (using CommonJS compatibility)
const parser = require('./parser.js');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const SAMPLE_DATA_FILE = path.join(__dirname, 'sample-data.js');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname)); // Serve frontend static files

// Helper to read data.json
function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error reading data.json:', err);
    return [];
  }
}

// Helper to write data.json
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing data.json:', err);
    return false;
  }
}

// Initialize database with sample data if empty
function initializeDatabase() {
  let currentData = readData();
  
  if (currentData.length > 0) {
    console.log(`Database loaded. Normalizing ${currentData.length} articles with the latest parser logic...`);
    let normalizedCount = 0;
    const seenTitles = new Set();
    const normalized = [];
    
    currentData.forEach(art => {
      let normArt = art;
      
      // If parsed from rawText, re-parse to clean up names and clusters
      if (art.rawText && !art.rawText.startsWith("OpenAlex ID:")) {
        const result = parser.parseReferences(art.rawText);
        if (result.parsedArticles.length > 0) {
          normArt = result.parsedArticles[0];
        }
      } else {
        // For OpenAlex works, re-normalize author names and re-classify economy area
        if (art.authors) {
          art.authors = art.authors.map(parser.normalizeAuthorName);
        }
        if (art.title) {
          art.economyArea = parser.classifyEconomyArea(art.title, art.authors, art.year);
        }
      }
      
      // Check for duplicate titles (to clean up any duplication during merge)
      if (normArt.title) {
        const titleKey = normArt.title.toLowerCase().substring(0, 30).trim();
        if (!seenTitles.has(titleKey)) {
          seenTitles.add(titleKey);
          normalized.push(normArt);
          normalizedCount++;
        }
      } else {
        normalized.push(normArt);
        normalizedCount++;
      }
    });
    
    writeData(normalized);
    console.log(`Database loaded and normalized ${normalized.length} unique articles successfully.`);
    return;
  }

  console.log('Database empty. Initializing with sample-data.js...');
  try {
    if (fs.existsSync(SAMPLE_DATA_FILE)) {
      const content = fs.readFileSync(SAMPLE_DATA_FILE, 'utf8');
      // Extract content inside RAW_PUBLICATIONS_DATA template literal
      const match = content.match(/RAW_PUBLICATIONS_DATA\s*=\s*`([\s\S]*?)`/);
      if (match) {
        const rawText = match[1];
        const result = parser.parseReferences(rawText);
        writeData(result.parsedArticles);
        console.log(`Database initialized successfully with ${result.parsedArticles.length} parsed articles.`);
      } else {
        console.warn('Could not parse RAW_PUBLICATIONS_DATA from sample-data.js');
      }
    } else {
      console.warn('sample-data.js file not found for initialization.');
    }
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
}

// Dual Sincronização: fitradeoff.org/publications + OpenAlex API
async function syncWithOptions() {
  console.log('Starting synchronization (Dual Sync: fitradeoff.org + OpenAlex)...');
  try {
    let addedCount = 0;
    const currentArticles = readData();
    
    // Create deduplication set
    const existingKeys = new Set(
      currentArticles.map(art => {
        if (art.link && art.link.includes('doi.org/')) {
          return art.link.split('doi.org/')[1].toLowerCase().trim();
        }
        return art.title.toLowerCase().substring(0, 30).trim();
      })
    );

    const newArticles = [];

    // --- PHASE 1: Sync from fitradeoff.org ---
    try {
      console.log('Fetching from https://fitradeoff.org/publications/ ...');
      const fitradeoffRes = await fetch('https://fitradeoff.org/publications/');
      if (fitradeoffRes.ok) {
        const html = await fitradeoffRes.text();
        const parseResult = parser.parseReferences(html);
        console.log(`Parsed ${parseResult.parsedArticles.length} articles from fitradeoff.org`);
        
        parseResult.parsedArticles.forEach(art => {
          const titleKey = art.title.toLowerCase().substring(0, 30).trim();
          const doiKey = (art.link && art.link.includes('doi.org/')) ? art.link.split('doi.org/')[1].toLowerCase().trim() : null;
          
          const isDuplicate = (doiKey && existingKeys.has(doiKey)) || existingKeys.has(titleKey);
          if (!isDuplicate) {
            newArticles.push(art);
            addedCount++;
            if (doiKey) existingKeys.add(doiKey);
            existingKeys.add(titleKey);
          }
        });
      } else {
        console.warn(`Failed to fetch fitradeoff.org publications page. Status: ${fitradeoffRes.status}`);
      }
    } catch (fitradeoffErr) {
      console.error('Error fetching/parsing fitradeoff.org:', fitradeoffErr);
    }

    // --- PHASE 2: Sync from OpenAlex API ---
    try {
      console.log('Fetching from OpenAlex API...');
      const openAlexRes = await fetch('https://api.openalex.org/works?filter=title_and_abstract.search:FITradeoff&per_page=200');
      if (openAlexRes.ok) {
        const data = await openAlexRes.json();
        if (data.results && Array.isArray(data.results)) {
          data.results.forEach(work => {
            if (!work.title) return;
            const titleKey = work.title.toLowerCase().substring(0, 30).trim();
            const doiKey = work.doi ? work.doi.split('doi.org/')[1].toLowerCase().trim() : null;
            
            const isDuplicate = (doiKey && existingKeys.has(doiKey)) || existingKeys.has(titleKey);
            if (!isDuplicate) {
              const parsed = parser.parseOpenAlexWork(work);
              if (parsed) {
                newArticles.push(parsed);
                addedCount++;
                if (doiKey) existingKeys.add(doiKey);
                existingKeys.add(titleKey);
              }
            }
          });
        }
      } else {
        console.warn(`Failed to fetch from OpenAlex. Status: ${openAlexRes.status}`);
      }
    } catch (openAlexErr) {
      console.error('Error fetching/parsing OpenAlex:', openAlexErr);
    }

    if (addedCount > 0) {
      const updatedList = [...currentArticles, ...newArticles];
      writeData(updatedList);
      console.log(`Sync completed! Added ${addedCount} new articles.`);
      return { success: true, count: addedCount, message: `Sincronização concluída! Adicionados ${addedCount} novos artigos.` };
    } else {
      console.log('Sync completed! No new articles found.');
      return { success: true, count: 0, message: 'Nenhum artigo novo encontrado. A base já está atualizada.' };
    }

  } catch (err) {
    console.error('Error during sync:', err);
    return { success: false, error: err.message };
  }
}

// REST API Endpoints

// Get all articles (parsed and saved)
app.get('/api/articles', (req, res) => {
  res.json(readData());
});

// Save client-parsed articles (overwrite or merge)
app.post('/api/articles', (req, res) => {
  if (Array.isArray(req.body)) {
    const success = writeData(req.body);
    if (success) {
      return res.json({ success: true, message: 'Base de dados salva com sucesso.' });
    }
  }
  res.status(400).json({ success: false, error: 'Invalid data format. Expected an array.' });
});

// Trigger manual sync
app.post('/api/sync', async (req, res) => {
  const result = await syncWithOptions();
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});

// Setup scheduler cron job (Runs every 24 hours at midnight)
cron.schedule('0 0 * * *', () => {
  console.log('Cron scheduler running automated sync...');
  syncWithOptions();
});

// Start Server and Initialize
app.listen(PORT, () => {
  console.log(`FITradeoff Literature Dashboard server running at http://localhost:${PORT}`);
  initializeDatabase();
});
