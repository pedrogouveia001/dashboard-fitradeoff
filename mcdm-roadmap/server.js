// Express.js Backend Server for MCDM/MCDA Roadmap Platform
const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const cron = require('node-cron');
const db = require('./db.js');
const { syncOpenAlex } = require('./sync.js');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Password Hash Helper (SHA256 for zero-dependency portability)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// User Context Middleware (simple header based auth for prototype demonstration)
function requireAuth(req, res, next) {
  const userIdHeader = req.headers['x-user-id'] || req.headers['authorization'];
  if (!userIdHeader) {
    return res.status(401).json({ success: false, error: 'Usuário não autenticado. Faça login para salvar seu progresso.' });
  }
  
  // Extract userId
  let userId = userIdHeader;
  if (userIdHeader.startsWith('Bearer ')) {
    userId = userIdHeader.substring(7);
  }
  
  const parsedId = parseInt(userId, 10);
  if (isNaN(parsedId)) {
    return res.status(400).json({ success: false, error: 'Formato de ID de usuário inválido.' });
  }
  
  req.userId = parsedId;
  next();
}

// --- API Endpoints ---

// Test Database Connection
app.get('/api/health', async (req, res) => {
  const dbStatus = await db.testConnection();
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// Authentication: Register
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || email.trim() === '' || password.trim() === '') {
    return res.status(400).json({ success: false, error: 'E-mail e senha são obrigatórios.' });
  }
  
  try {
    const passwordHash = hashPassword(password);
    const user = await db.createUser(email, passwordHash);
    res.status(201).json({ success: true, message: 'Usuário registrado com sucesso!', user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Authentication: Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Credenciais inválidas. E-mail não encontrado.' });
    }

    const hash = hashPassword(password);
    if (user.password_hash !== hash) {
      return res.status(401).json({ success: false, error: 'Credenciais inválidas. Senha incorreta.' });
    }

    res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      user: { id: user.id, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Learning Path Progress: Get Progress
app.get('/api/progress', requireAuth, async (req, res) => {
  try {
    const progressList = await db.getProgress(req.userId);
    res.json({ success: true, progress: progressList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Learning Path Progress: Save Progress
app.post('/api/progress', requireAuth, async (req, res) => {
  const { nodeId, status } = req.body;
  if (!nodeId || !status) {
    return res.status(400).json({ success: false, error: 'Identificador do nó e status são obrigatórios.' });
  }

  try {
    const saved = await db.saveProgress(req.userId, nodeId, status);
    res.json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Publications: Get cached publications
app.get('/api/articles', async (req, res) => {
  try {
    const { nodeId } = req.query;
    const articles = await db.getArticles(nodeId);
    res.json({ success: true, articles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Publications: Get cached statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Publications: Trigger Manual sync
app.post('/api/sync', async (req, res) => {
  try {
    const syncResult = await syncOpenAlex();
    if (syncResult.success) {
      res.json(syncResult);
    } else {
      res.status(500).json(syncResult);
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend SPA fallback for standard routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Daily Cron Job (Runs every day at midnight to sync research articles automatically)
cron.schedule('0 0 * * *', async () => {
  console.log('Cron triggered: starting automatic midnight sync with OpenAlex...');
  await syncOpenAlex();
});

// --- Initialization and Boot ---
const isTestRun = process.argv.includes('--test-run');

if (isTestRun) {
  console.log('--- TEST RUN: Server is booting to verify configuration... ---');
  db.testConnection().then((dbStatus) => {
    console.log('Database verification:', dbStatus);
    console.log('Server verified successfully! Exiting.');
    process.exit(0);
  }).catch((err) => {
    console.error('Server boot test failed:', err);
    process.exit(1);
  });
} else {
  app.listen(PORT, async () => {
    console.log(`MCDM/MCDA Roadmap server is running at http://localhost:${PORT}`);
    console.log('Initializing local database / cached articles...');
    
    // Test DB connection and trigger an initial sync to populate database if empty
    try {
      await db.testConnection();
      const currentArticles = await db.getArticles();
      if (currentArticles.length === 0) {
        console.log('No cached articles found. Running initial data sync with OpenAlex...');
        await syncOpenAlex();
      } else {
        console.log(`Loaded ${currentArticles.length} cached articles successfully.`);
      }
    } catch (e) {
      console.warn('Initial articles pre-population warning:', e.message);
    }
  });
}
