// Database Connection Layer - PostgreSQL with transparent JSON file fallback
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Path for JSON fallback files
const DATA_DIR = path.join(__dirname, 'data_fallback');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');

// Check for Database connection string
const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
let pool = null;
let useLocalFallback = true;

if (connectionString) {
  try {
    pool = new Pool({
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false } // Required for Supabase / Heroku external connections
    });
    useLocalFallback = false;
    console.log('PostgreSQL database connection configured successfully.');
  } catch (err) {
    console.error('Failed to configure PostgreSQL connection. Falling back to local JSON files.', err);
    useLocalFallback = true;
  }
} else {
  console.log('No DATABASE_URL environment variable found. Running in Local JSON File Fallback Mode.');
}

// Ensure local directories exist if running in fallback mode
function ensureDirectoryExists() {
  if (useLocalFallback) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]', 'utf8');
    if (!fs.existsSync(PROGRESS_FILE)) fs.writeFileSync(PROGRESS_FILE, '[]', 'utf8');
    if (!fs.existsSync(ARTICLES_FILE)) fs.writeFileSync(ARTICLES_FILE, '[]', 'utf8');
  }
}

// Read helper for fallback
function readJsonFile(filePath) {
  try {
    ensureDirectoryExists();
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return [];
  }
}

// Write helper for fallback
function writeJsonFile(filePath, data) {
  try {
    ensureDirectoryExists();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing file ${filePath}:`, err);
    return false;
  }
}

// Exposed DB Operations
const db = {
  // Check connection
  async testConnection() {
    if (useLocalFallback) {
      ensureDirectoryExists();
      return { status: 'connected', type: 'JSON Fallback', details: 'Using local files' };
    }
    try {
      const client = await pool.connect();
      // Ensure cluster_ids column exists in PostgreSQL
      try {
        await client.query('ALTER TABLE synced_articles ADD COLUMN IF NOT EXISTS cluster_ids TEXT;');
      } catch (ddlErr) {
        console.warn('PostgreSQL DDL warning (cluster_ids):', ddlErr.message);
      }
      client.release();
      return { status: 'connected', type: 'PostgreSQL', details: 'Successfully connected to DB' };
    } catch (err) {
      console.warn('PostgreSQL test connection failed. Switching to Local JSON files...', err.message);
      useLocalFallback = true;
      ensureDirectoryExists();
      return { status: 'connected', type: 'JSON Fallback (Switched)', details: err.message };
    }
  },

  // USER MANAGEMENT
  async createUser(email, passwordHash) {
    const cleanEmail = email.toLowerCase().trim();
    if (useLocalFallback) {
      const users = readJsonFile(USERS_FILE);
      if (users.find(u => u.email === cleanEmail)) {
        throw new Error('E-mail já cadastrado.');
      }
      const newUser = {
        id: users.length + 1,
        email: cleanEmail,
        password_hash: passwordHash,
        created_at: new Date().toISOString()
      };
      users.push(newUser);
      writeJsonFile(USERS_FILE, users);
      return { id: newUser.id, email: newUser.email };
    } else {
      const query = `
        INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING id, email;
      `;
      try {
        const res = await pool.query(query, [cleanEmail, passwordHash]);
        return res.rows[0];
      } catch (err) {
        if (err.code === '23505') {
          throw new Error('E-mail já cadastrado.');
        }
        throw err;
      }
    }
  },

  async getUserByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    if (useLocalFallback) {
      const users = readJsonFile(USERS_FILE);
      const user = users.find(u => u.email === cleanEmail);
      return user || null;
    } else {
      const query = 'SELECT * FROM users WHERE email = $1;';
      const res = await pool.query(query, [cleanEmail]);
      return res.rows[0] || null;
    }
  },

  // PROGRESS TRACKING
  async saveProgress(userId, nodeId, status) {
    if (useLocalFallback) {
      const progress = readJsonFile(PROGRESS_FILE);
      const index = progress.findIndex(p => p.user_id === userId && p.node_id === nodeId);
      
      const item = {
        user_id: userId,
        node_id: nodeId,
        status: status,
        updated_at: new Date().toISOString()
      };

      if (index !== -1) {
        progress[index] = item;
      } else {
        progress.push(item);
      }
      writeJsonFile(PROGRESS_FILE, progress);
      return item;
    } else {
      const query = `
        INSERT INTO user_progress (user_id, node_id, status, updated_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id, node_id)
        DO UPDATE SET status = EXCLUDED.status, updated_at = NOW()
        RETURNING *;
      `;
      const res = await pool.query(query, [userId, nodeId, status]);
      return res.rows[0];
    }
  },

  async getProgress(userId) {
    if (useLocalFallback) {
      const progress = readJsonFile(PROGRESS_FILE);
      return progress.filter(p => p.user_id === userId);
    } else {
      const query = 'SELECT node_id, status, updated_at FROM user_progress WHERE user_id = $1;';
      const res = await pool.query(query, [userId]);
      return res.rows;
    }
  },

  // ARTICLES CACHE & STATISTICS
  async saveArticles(articles) {
    if (useLocalFallback) {
      const current = readJsonFile(ARTICLES_FILE);
      const articleMap = new Map(current.map(a => [a.id, a]));
      
      articles.forEach(art => {
        articleMap.set(art.id, {
          id: art.id,
          title: art.title,
          authors: art.authors,
          journal: art.journal,
          year: art.year,
          citation_count: art.citation_count || 0,
          link: art.link,
          cluster_ids: art.cluster_ids || [], // save array of mapped roadmap node IDs
          synced_at: new Date().toISOString()
        });
      });

      const updated = Array.from(articleMap.values());
      writeJsonFile(ARTICLES_FILE, updated);
      return updated.length;
    } else {
      let insertedCount = 0;
      for (const art of articles) {
        // Convert cluster_ids array to comma-separated list like ",id1,id2," for easy database LIKE querying
        const clusterStr = Array.isArray(art.cluster_ids) && art.cluster_ids.length > 0 
          ? `,${art.cluster_ids.join(',')},` 
          : null;

        const query = `
          INSERT INTO synced_articles (id, title, authors, journal, year, citation_count, link, cluster_ids, synced_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
          ON CONFLICT (id)
          DO UPDATE SET 
            title = EXCLUDED.title,
            authors = EXCLUDED.authors,
            journal = EXCLUDED.journal,
            year = EXCLUDED.year,
            citation_count = EXCLUDED.citation_count,
            link = EXCLUDED.link,
            cluster_ids = EXCLUDED.cluster_ids,
            synced_at = NOW();
        `;
        await pool.query(query, [
          art.id,
          art.title,
          art.authors,
          art.journal,
          art.year,
          art.citation_count || 0,
          art.link,
          clusterStr
        ]);
        insertedCount++;
      }
      return insertedCount;
    }
  },

  async getArticles(nodeId) {
    if (useLocalFallback) {
      const articles = readJsonFile(ARTICLES_FILE);
      let filtered = articles;
      if (nodeId) {
        filtered = articles.filter(a => Array.isArray(a.cluster_ids) && a.cluster_ids.includes(nodeId));
      }
      return filtered.sort((a, b) => b.year - a.year || new Date(b.synced_at) - new Date(a.synced_at));
    } else {
      if (nodeId) {
        const query = 'SELECT * FROM synced_articles WHERE cluster_ids LIKE $1 ORDER BY year DESC, synced_at DESC LIMIT 100;';
        const res = await pool.query(query, [`%,${nodeId},%`]);
        return res.rows;
      } else {
        const query = 'SELECT * FROM synced_articles ORDER BY year DESC, synced_at DESC LIMIT 200;';
        const res = await pool.query(query);
        return res.rows;
      }
    }
  },

  async getStats() {
    const articles = await this.getArticles();
    if (articles.length === 0) {
      return {
        totalArticles: 0,
        publicationsPerYear: {},
        topJournals: [],
        topAuthors: []
      };
    }

    // Calc stats
    const totalArticles = articles.length;
    const pubYearMap = {};
    const journalMap = {};
    const authorMap = {};

    articles.forEach(art => {
      // Years
      if (art.year) {
        pubYearMap[art.year] = (pubYearMap[art.year] || 0) + 1;
      }
      // Journals
      if (art.journal) {
        const cleanJournal = art.journal.trim();
        journalMap[cleanJournal] = (journalMap[cleanJournal] || 0) + 1;
      }
      // Authors
      if (Array.isArray(art.authors)) {
        art.authors.forEach(auth => {
          const cleanAuth = auth.trim();
          authorMap[cleanAuth] = (authorMap[cleanAuth] || 0) + 1;
        });
      }
    });

    const topJournals = Object.entries(journalMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topAuthors = Object.entries(authorMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalArticles,
      publicationsPerYear: pubYearMap,
      topJournals,
      topAuthors
    };
  }
};

module.exports = db;
