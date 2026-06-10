// FITradeoff Literature Dashboard Orchestrator (D3, Chart.js, Dual Sync)

// Global state variables
let appData = {
  parsedArticles: [],
  failedArticles: [],
  networkSimulation: null,
  charts: {},
  networkZoom: null,
  networkSvg: null
};

let paginationState = {
  currentPage: 1,
  pageSize: 25
};

// Check if running on Node.js backend vs client-only (file:///)
const IS_LOCAL_SERVER = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const BACKEND_URL = IS_LOCAL_SERVER ? '' : null;

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  setupTheme();
  setupTabs();
  setupEventListeners();
  loadDashboardData();
});

// Setup Light / Dark Theme Switching
function setupTheme() {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  
  // Load saved theme preference
  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "light") {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
  } else {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
  }
  
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (document.body.classList.contains("light-theme")) {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        localStorage.setItem("theme", "light");
      }
      // Re-render dashboard components to update chart colors
      renderDashboardComponents();
    });
  }
}

// Load data from Backend or LocalStorage fallback
async function loadDashboardData() {
  showLoadingState(true);
  
  if (IS_LOCAL_SERVER) {
    try {
      console.log("Servidor local detectado. Carregando dados do Backend...");
      const response = await fetch('/api/articles');
      if (!response.ok) throw new Error("Falha ao ler do backend.");
      const articles = await response.json();
      
      if (articles && articles.length > 0) {
        appData.parsedArticles = articles;
        appData.failedArticles = []; // Backend parses successfully before saving
        updateMetricCounters();
        renderRepositoryTable();
        renderFailedTable();
        populateVariantFilter();
        renderDashboardComponents();
        showLoadingState(false);
        runSilentSync(); // Trigger silent update in background
        return;
      }
    } catch (err) {
      console.warn("Falha ao carregar do backend. Usando fallback LocalStorage.", err);
    }
  }

  // Fallback: LocalStorage / Sample Data
  console.log("Carregando dados via LocalStorage / sample-data.js...");
  const cached = localStorage.getItem("fitradeoff_articles");
  const cachedFailed = localStorage.getItem("fitradeoff_failed");
  
  if (cached) {
    appData.parsedArticles = JSON.parse(cached);
    appData.failedArticles = cachedFailed ? JSON.parse(cachedFailed) : [];
  } else {
    // Parse sample data
    const result = parseReferences(RAW_PUBLICATIONS_DATA);
    appData.parsedArticles = result.parsedArticles;
    appData.failedArticles = result.failedArticles;
    saveToLocalStorage();
  }
  
  updateMetricCounters();
  renderRepositoryTable();
  renderFailedTable();
  populateVariantFilter();
  renderDashboardComponents();
  showLoadingState(false);
  runSilentSync(); // Trigger silent update in background
}

// Save to browser LocalStorage (Serverless mode)
function saveToLocalStorage() {
  localStorage.setItem("fitradeoff_articles", JSON.stringify(appData.parsedArticles));
  localStorage.setItem("fitradeoff_failed", JSON.stringify(appData.failedArticles));
}

// Setup Tab Switching (Upgraded for Top Header layout)
function setupTabs() {
  const tabButtons = document.querySelectorAll(".nav-tab-btn");
  
  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      const tabId = button.getAttribute("data-tab");
      
      tabButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      
      document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.remove("active");
      });
      document.getElementById(tabId).classList.add("active");
      
      if (tabId === "network-tab") {
        setTimeout(() => {
          if (appData.parsedArticles.length > 0) {
            renderCoauthorshipNetwork(appData.parsedArticles);
          }
        }, 100);
      } else if (tabId === "dashboard-tab") {
        setTimeout(() => {
          renderDashboardComponents();
        }, 100);
      }
    });
  });
}

// Setup Event Listeners
document.addEventListener("click", (e) => {
  // Global tooltip close helper
  if (!e.target.closest("#global-tooltip") && !e.target.closest(".node")) {
    hideTooltip();
  }
});

function setupEventListeners() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.addEventListener("input", handleFilterChange);
  
  const varFilter = document.getElementById("variant-filter");
  if (varFilter) varFilter.addEventListener("change", handleFilterChange);
  

  
  const syncBtn = document.getElementById("sync-action-btn");
  if (syncBtn) syncBtn.addEventListener("click", triggerOpenAlexSync);
  
  const processBtn = document.getElementById("process-btn");
  if (processBtn) {
    processBtn.addEventListener("click", () => {
      const rawText = document.getElementById("paste-area").value;
      processRawInput(rawText);
    });
  }
  
  const sampleBtn = document.getElementById("load-sample-btn");
  if (sampleBtn) {
    sampleBtn.addEventListener("click", () => {
      document.getElementById("paste-area").value = RAW_PUBLICATIONS_DATA;
      processRawInput(RAW_PUBLICATIONS_DATA);
    });
  }

  // Table pagination controls
  const prevBtn = document.getElementById("prev-page-btn");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (paginationState.currentPage > 1) {
        paginationState.currentPage--;
        renderRepositoryTable();
      }
    });
  }
  
  const nextBtn = document.getElementById("next-page-btn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const filtered = getFilteredArticles();
      const maxPage = Math.ceil(filtered.length / paginationState.pageSize);
      if (paginationState.currentPage < maxPage) {
        paginationState.currentPage++;
        renderRepositoryTable();
      }
    });
  }
  
  const sizeSelect = document.getElementById("page-size-select");
  if (sizeSelect) {
    sizeSelect.addEventListener("change", (e) => {
      paginationState.pageSize = parseInt(e.target.value);
      paginationState.currentPage = 1;
      renderRepositoryTable();
    });
  }

  // D3 Network zoom button binds
  const zoomInBtn = document.getElementById("network-zoom-in");
  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", () => {
      if (appData.networkSvg && appData.networkZoom) {
        appData.networkSvg.transition().duration(300).call(appData.networkZoom.scaleBy, 1.3);
      }
    });
  }
  
  const zoomOutBtn = document.getElementById("network-zoom-out");
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", () => {
      if (appData.networkSvg && appData.networkZoom) {
        appData.networkSvg.transition().duration(300).call(appData.networkZoom.scaleBy, 1 / 1.3);
      }
    });
  }
  
  const resetBtn = document.getElementById("network-zoom-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (appData.networkSvg && appData.networkZoom) {
        appData.networkSvg.transition().duration(300).call(appData.networkZoom.transform, d3.zoomIdentity);
      }
    });
  }

  if (!document.getElementById("global-tooltip")) {
    const tooltip = document.createElement("div");
    tooltip.id = "global-tooltip";
    tooltip.className = "tooltip";
    tooltip.style.display = "none";
    document.body.appendChild(tooltip);
  }
}

// Show/Hide spinner loading UI on manual sync button
function showLoadingState(show) {
  const syncBtnText = document.getElementById("sync-btn-text");
  const syncIcon = document.getElementById("sync-icon");
  
  if (syncBtnText && syncIcon) {
    if (show) {
      syncBtnText.textContent = "Sincronizando...";
      syncIcon.classList.add("spin-animation");
    } else {
      syncBtnText.textContent = "Sincronizar Bases Agora";
      syncIcon.classList.remove("spin-animation");
    }
  }
}

// Run silent background sync on load
async function runSilentSync() {
  const indicator = document.getElementById("sync-indicator");
  const statusText = document.getElementById("sync-status-text");
  const lastSyncText = document.getElementById("last-sync-time");
  
  if (indicator) {
    indicator.className = "status-indicator-dot online pulsing";
  }
  if (statusText) {
    statusText.textContent = "Sincronizando bases em background...";
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (IS_LOCAL_SERVER) {
    try {
      console.log("[Silent Sync] Iniciando busca em background...");
      const response = await fetch('/api/sync', { method: 'POST' });
      const result = await response.json();
      
      if (indicator) indicator.className = "status-indicator-dot online";
      
      if (result.success && result.count > 0) {
        if (statusText) statusText.textContent = `Sincronizado (+${result.count} novos artigos)`;
        
        // Re-read fresh articles from database
        const resArticles = await fetch('/api/articles');
        const articles = await resArticles.json();
        if (articles && articles.length > 0) {
          appData.parsedArticles = articles;
          updateMetricCounters();
          renderRepositoryTable();
          renderDashboardComponents();
        }
      } else {
        if (statusText) statusText.textContent = "Base atualizada e em conformidade";
      }
      
      if (lastSyncText) lastSyncText.textContent = `Último sync: hoje, às ${timeStr}`;
      localStorage.setItem("fitradeoff_last_sync", `hoje, às ${timeStr}`);
      return;
    } catch (err) {
      console.warn("[Silent Sync] Falha no sync via backend local:", err);
    }
  }

  // Serverless background sync (CORS direct fallback)
  try {
    const response = await fetch('https://api.openalex.org/works?filter=title_and_abstract.search:FITradeoff&per_page=200');
    if (!response.ok) throw new Error("CORS limit/fail");
    
    const data = await response.json();
    if (!data.results) throw new Error("Format error");
    
    const existingKeys = new Set(
      appData.parsedArticles.map(art => {
        if (art.link && art.link.includes('doi.org/')) {
          return art.link.split('doi.org/')[1].toLowerCase().trim();
        }
        return art.title.toLowerCase().substring(0, 30).trim();
      })
    );

    let newCount = 0;
    const newlyAdded = [];

    data.results.forEach(work => {
      if (!work.title) return;
      const doiKey = work.doi ? work.doi.split('doi.org/')[1].toLowerCase().trim() : null;
      const titleKey = work.title.toLowerCase().substring(0, 30).trim();

      const isDuplicate = (doiKey && existingKeys.has(doiKey)) || existingKeys.has(titleKey);

      if (!isDuplicate) {
        const parsed = parseOpenAlexWork(work);
        if (parsed) {
          newlyAdded.push(parsed);
          newCount++;
          if (doiKey) existingKeys.add(doiKey);
          existingKeys.add(titleKey);
        }
      }
    });

    if (indicator) indicator.className = "status-indicator-dot online";
    
    if (newCount > 0) {
      appData.parsedArticles = [...appData.parsedArticles, ...newlyAdded];
      saveToLocalStorage();
      updateMetricCounters();
      renderRepositoryTable();
      renderDashboardComponents();
      if (statusText) statusText.textContent = `Sincronizado (+${newCount} novos)`;
    } else {
      if (statusText) statusText.textContent = "Base atualizada (OpenAlex)";
    }
    if (lastSyncText) lastSyncText.textContent = `Último sync: hoje, às ${timeStr}`;
    localStorage.setItem("fitradeoff_last_sync", `hoje, às ${timeStr}`);
  } catch (err) {
    console.warn("[Silent Sync] Falha no sync direto CORS:", err);
    if (indicator) indicator.className = "status-indicator-dot";
    if (statusText) statusText.textContent = "Offline / Sem conexão";
    const cachedLast = localStorage.getItem("fitradeoff_last_sync") || "Desconhecido";
    if (lastSyncText) lastSyncText.textContent = `Último sync: ${cachedLast}`;
  }
}

// Manual Sync trigger
async function triggerOpenAlexSync() {
  showLoadingState(true);
  console.log("Iniciando sincronização manual...");
  
  if (IS_LOCAL_SERVER) {
    try {
      console.log("Sincronizando via backend local...");
      const response = await fetch('/api/sync', { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        alert(result.message);
        loadDashboardData(); // Reload updated JSON
      } else {
        alert("Erro no backend durante sync: " + result.error);
        showLoadingState(false);
      }
      return;
    } catch (err) {
      console.warn("Falha no sync via backend. Tentando via CORS direto no browser...", err);
    }
  }

  // Serverless sync (direct browser CORS fetch)
  try {
    console.log("Sincronizando via CORS direto no navegador...");
    const response = await fetch('https://api.openalex.org/works?filter=title_and_abstract.search:FITradeoff&per_page=200');
    if (!response.ok) throw new Error("Falha ao comunicar com a API do OpenAlex.");
    
    const data = await response.json();
    if (!data.results) throw new Error("Resposta inválida do OpenAlex.");
    
    const existingKeys = new Set(
      appData.parsedArticles.map(art => {
        if (art.link && art.link.includes('doi.org/')) {
          return art.link.split('doi.org/')[1].toLowerCase().trim();
        }
        return art.title.toLowerCase().substring(0, 30).trim();
      })
    );

    let newCount = 0;
    const newlyAdded = [];

    data.results.forEach(work => {
      if (!work.title) return;
      
      const doiKey = work.doi ? work.doi.split('doi.org/')[1].toLowerCase().trim() : null;
      const titleKey = work.title.toLowerCase().substring(0, 30).trim();

      const isDuplicate = (doiKey && existingKeys.has(doiKey)) || existingKeys.has(titleKey);

      if (!isDuplicate) {
        const parsed = parseOpenAlexWork(work);
        if (parsed) {
          newlyAdded.push(parsed);
          newCount++;
          if (doiKey) existingKeys.add(doiKey);
          existingKeys.add(titleKey);
        }
      }
    });

    if (newCount > 0) {
      appData.parsedArticles = [...appData.parsedArticles, ...newlyAdded];
      saveToLocalStorage();
      updateMetricCounters();
      renderRepositoryTable();
      populateVariantFilter();
      renderDashboardComponents();
      alert(`Sincronização concluída! ${newCount} novos artigos adicionados.`);
    } else {
      alert("Nenhum artigo novo encontrado. A base já está atualizada.");
    }
  } catch (err) {
    console.error("Erro durante sync direto:", err);
    alert("Erro na sincronização: " + err.message);
  } finally {
    showLoadingState(false);
  }
}

// Process manually pasted raw input
function processRawInput(text) {
  const result = parseReferences(text);
  
  if (IS_LOCAL_SERVER) {
    // If backend is active, POST the new parsed articles to server.js
    fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.parsedArticles)
    })
    .then(r => r.json())
    .then(res => {
      console.log("Base salva no backend:", res.message);
    })
    .catch(err => console.error("Falha ao salvar no backend:", err));
  }
  
  appData.parsedArticles = result.parsedArticles;
  appData.failedArticles = result.failedArticles;
  saveToLocalStorage();
  
  paginationState.currentPage = 1; // reset pagination
  updateMetricCounters();
  renderRepositoryTable();
  renderFailedTable();
  populateVariantFilter();
  renderDashboardComponents();
}

// Update cards
function updateMetricCounters() {
  document.getElementById("metric-total").textContent = appData.parsedArticles.length;
  
  const allAuthors = new Set();
  appData.parsedArticles.forEach(art => {
    art.authors.forEach(auth => allAuthors.add(auth));
  });
  document.getElementById("metric-authors").textContent = allAuthors.size;
  
  const journals = new Set(appData.parsedArticles.map(art => art.journal));
  document.getElementById("metric-journals").textContent = journals.size;
  
  const failedCount = appData.failedArticles.length;
  const failedEl = document.getElementById("metric-failed");
  if (failedEl) failedEl.textContent = failedCount;
  
  const failedCard = document.getElementById("card-failed");
  if (failedCard) {
    if (failedCount > 0) {
      failedCard.className = "metric-card card-glow-red";
    } else {
      failedCard.className = "metric-card card-glow-orange";
    }
  }
}

// Populate variant filter dropdown
function populateVariantFilter() {
  const filterSelect = document.getElementById("variant-filter");
  if (!filterSelect) return;
  const currentVal = filterSelect.value;
  
  filterSelect.innerHTML = '<option value="all">Todas as Variantes</option>';
  
  const variants = new Set(appData.parsedArticles.map(art => art.variant).filter(v => v));
  Array.from(variants).sort().forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    filterSelect.appendChild(opt);
  });
  
  if (variants.has(currentVal)) {
    filterSelect.value = currentVal;
  }
}

// Orchestrate Dashboard Rendering
function renderDashboardComponents() {
  if (appData.parsedArticles.length === 0) return;
  
  renderJournalRanking(appData.parsedArticles);
  renderTimeline(appData.parsedArticles);
  renderContextAndAreaDistribution(appData.parsedArticles);
}

// Render dynamic profile sidebar card of author
function showAuthorProfile(authorName) {
  const placeholder = document.getElementById("author-profile-placeholder");
  const content = document.getElementById("author-profile-content");
  
  if (!placeholder || !content) return;
  
  // Find papers written by this author
  const papers = appData.parsedArticles.filter(art => art.authors.includes(authorName));
  if (papers.length === 0) return;
  
  // Calculate statistics
  const count = papers.length;
  const years = papers.map(p => p.year).filter(y => y);
  const firstYear = Math.min(...years);
  const lastYear = Math.max(...years);
  
  const sectors = {};
  const coauthors = {};
  const journals = {};
  let orcid = "";
  
  papers.forEach(p => {
    // Sector count
    const sector = p.economyArea || "Outros Setores";
    sectors[sector] = (sectors[sector] || 0) + 1;
    
    // Coauthors count
    p.authors.forEach(auth => {
      if (auth !== authorName) {
        coauthors[auth] = (coauthors[auth] || 0) + 1;
      }
    });
    
    // Journals count
    journals[p.journal] = (journals[p.journal] || 0) + 1;
    
    // ORCID check
    if (!orcid && p.authorOrcids && p.authorOrcids[authorName]) {
      orcid = p.authorOrcids[authorName];
    }
  });
  
  // Primary economic sector (exclude "Teoria & Neurociência" from primary economic sector if there are others)
  const economicSectors = Object.keys(sectors).filter(s => s !== "Teoria & Neurociência");
  let primarySector = "Teoria & Neurociência";
  if (economicSectors.length > 0) {
    primarySector = economicSectors.reduce((a, b) => sectors[a] > sectors[b] ? a : b);
  } else if (Object.keys(sectors).length > 0) {
    primarySector = Object.keys(sectors).reduce((a, b) => sectors[a] > sectors[b] ? a : b);
  }
  
  // Top 3 coauthors
  const sortedCoauthors = Object.keys(coauthors)
    .map(name => ({ name, count: coauthors[name] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
    
  // Top journals
  const sortedJournals = Object.keys(journals)
    .map(name => ({ name, count: journals[name] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 2);
    
  // Bio summary builder (Premium Academic Resumo)
  const topCoauthStr = sortedCoauthors.length > 0 
    ? sortedCoauthors.map(c => c.name).join(", ").replace(/,([^,]*)$/, ' e$1') 
    : "nenhum colaborador";
  const topSectorsStr = economicSectors.length > 0
    ? economicSectors.slice(0, 2).join(" e ")
    : "Teoria & Neurociência";
  const topJournalsStr = sortedJournals.length > 0
    ? sortedJournals.map(j => j.name).join(" e ")
    : "periódicos variados";
    
  const bioSummary = `<strong>${authorName}</strong> é um pesquisador ativo na literatura do método FITradeoff, com <strong>${count}</strong> publicações catalogadas entre <strong>${firstYear}</strong> e <strong>${lastYear}</strong>. Colabora frequentemente com <strong>${topCoauthStr}</strong>, focando suas aplicações principalmente nas áreas de <strong>${topSectorsStr}</strong>. Suas pesquisas são frequentemente veiculadas em periódicos renomados, com destaque para <strong>${topJournalsStr}</strong>.`;
  
  // Update UI Elements
  placeholder.style.display = "none";
  content.style.display = "block";
  
  document.getElementById("prof-name").textContent = authorName;
  document.getElementById("prof-bio").innerHTML = bioSummary;
  
  // Update Stats values
  document.getElementById("prof-stat-count").textContent = count;
  document.getElementById("prof-stat-first").textContent = `${firstYear} - ${lastYear}`;
  document.getElementById("prof-stat-sector").textContent = primarySector.length > 25 ? primarySector.substring(0, 25) + "..." : primarySector;
  document.getElementById("prof-stat-sector").title = primarySector;
  
  // Lattes Search button link
  const lattesSearchBtn = document.getElementById("prof-lattes-link");
  lattesSearchBtn.href = `https://google.com/search?q=site:lattes.cnpq.br+%22${encodeURIComponent(authorName)}%22`;
  
  // ORCID badge link
  const orcidBtn = document.getElementById("prof-orcid-link");
  if (orcid) {
    orcidBtn.href = orcid.startsWith("http") ? orcid : `https://orcid.org/${orcid}`;
    orcidBtn.style.display = "inline-block";
  } else {
    orcidBtn.style.display = "none";
  }
  
  // Collaborators list
  const collaboratorsContainer = document.getElementById("prof-collaborators");
  collaboratorsContainer.innerHTML = "";
  if (sortedCoauthors.length > 0) {
    sortedCoauthors.forEach(c => {
      const li = document.createElement("li");
      li.textContent = `${c.name} (${c.count}x)`;
      li.addEventListener("click", () => {
        showAuthorProfile(c.name);
        // Highlight in D3 network if visible
        d3.selectAll(".node")
          .style("stroke", n => n.id === c.name ? "var(--text-primary)" : "var(--bg-card)")
          .style("stroke-width", n => n.id === c.name ? "3px" : "1.5px");
      });
      collaboratorsContainer.appendChild(li);
    });
  } else {
    collaboratorsContainer.innerHTML = '<li style="color:var(--text-muted); cursor:default; border:none; background:transparent;">Nenhum coautor registrado</li>';
  }
  
  // Publications list
  const publicationsContainer = document.getElementById("prof-publications");
  publicationsContainer.innerHTML = "";
  papers.sort((a,b) => b.year - a.year).forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>(${p.year})</strong> ${p.title} 
      ${p.link ? `<a href="${p.link}" target="_blank" title="Acessar Artigo">🔗</a>` : ""}
    `;
    publicationsContainer.appendChild(li);
  });
}

// Global hook to jump to author page and click it
window.navigateToAuthor = function(name) {
  // Find Rede tab button and trigger click
  const redeTabBtn = document.querySelector('.nav-tab-btn[data-tab="network-tab"]');
  if (redeTabBtn) {
    redeTabBtn.click();
  }
  
  setTimeout(() => {
    showAuthorProfile(name);
    // Focus/highlight node in D3 network
    d3.selectAll(".node")
      .style("stroke", n => n.id === name ? "var(--text-primary)" : "var(--bg-card)")
      .style("stroke-width", n => n.id === name ? "3px" : "1.5px")
      .attr("r", n => n.id === name ? n.radius + 4 : n.radius);
  }, 150);
};

// Render Co-authorship Network (D3.js Graph) with split Author Card profile
function renderCoauthorshipNetwork(articles) {
  const container = document.getElementById("network-svg-container");
  if (!container) return;
  container.innerHTML = "";
  
  const width = container.clientWidth || 600;
  const height = 450;
  
  const authorPapers = {};
  const coauthorships = {};
  
  articles.forEach(art => {
    const auths = art.authors;
    auths.forEach(auth => {
      if (!authorPapers[auth]) authorPapers[auth] = [];
      authorPapers[auth].push(art);
    });
    
    for (let i = 0; i < auths.length; i++) {
      for (let j = i + 1; j < auths.length; j++) {
        const a1 = auths[i];
        const a2 = auths[j];
        const key = a1 < a2 ? `${a1}|${a2}` : `${a2}|${a1}`;
        coauthorships[key] = (coauthorships[key] || 0) + 1;
      }
    }
  });
  
  const nodes = Object.keys(authorPapers).map(author => ({
    id: author,
    papers: authorPapers[author],
    radius: 4 + Math.sqrt(authorPapers[author].length * 5)
  }));
  
  const links = Object.keys(coauthorships).map(key => {
    const [source, target] = key.split("|");
    return { source, target, weight: coauthorships[key] };
  });
  
  if (nodes.length === 0) {
    container.innerHTML = '<div style="padding:2rem;color:var(--text-secondary)">Sem coautoria para renderizar.</div>';
    return;
  }
  
  const svg = d3.select("#network-svg-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  
  const gContainer = svg.append("g");
  
  const zoomBehavior = d3.zoom()
    .scaleExtent([0.1, 8])
    .on("zoom", (event) => {
      gContainer.attr("transform", event.transform);
    });
    
  svg.call(zoomBehavior);
  
  // Expose network zoom references globally
  appData.networkZoom = zoomBehavior;
  appData.networkSvg = svg;
  
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-150))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(d => d.radius + 8));
  
  appData.networkSimulation = simulation;
  
  const link = gContainer.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke-width", d => Math.min(d.weight * 1.5, 8))
    .on("mouseover", (event, d) => {
      showTooltip(event, `<strong>Coautoria:</strong> ${d.source.id} & ${d.target.id}<br/><strong>Trabalhos em conjunto:</strong> ${d.weight}`);
    })
    .on("mouseout", hideTooltip);
  
  const node = gContainer.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", d => d.radius)
    .attr("fill", d => {
      if (d.id === "Almeida, A. T.") return "var(--accent-blue)";
      if (d.id === "Frej, E. A.") return "var(--accent-purple)";
      if (d.id === "Roselli, L. R. P.") return "var(--accent-cyan)";
      return "#64748b";
    })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
    .on("mouseover", (event, d) => {
      node.attr("opacity", n => (n.id === d.id || isConnected(d.id, n.id)) ? 1 : 0.15);
      link.attr("stroke-opacity", l => (l.source.id === d.id || l.target.id === d.id) ? 0.9 : 0.05);
      link.attr("stroke", l => (l.source.id === d.id || l.target.id === d.id) ? "var(--accent-blue)" : "#4b5563");
      
      const tooltipContent = `
        <div style="font-weight:600;color:var(--text-primary);font-size:0.85rem;">${d.id}</div>
        <div style="font-size:0.75rem;color:var(--text-secondary);">Total de Papers: ${d.papers.length}</div>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:2px;">Clique para ver o perfil completo</div>
      `;
      showTooltip(event, tooltipContent);
    })
    .on("mousemove", (event) => {
      const tooltip = document.getElementById("global-tooltip");
      tooltip.style.left = (event.pageX + 15) + "px";
      tooltip.style.top = (event.pageY + 15) + "px";
    })
    .on("mouseout", (event) => {
      resetHighlights();
      hideTooltip();
    })
    .on("click", (event, d) => {
      showAuthorProfile(d.id);
      
      // Highlight selected node
      d3.selectAll(".node")
        .style("stroke", n => n.id === d.id ? "var(--text-primary)" : "var(--bg-card)")
        .style("stroke-width", n => n.id === d.id ? "3.5px" : "1.5px");
    });
    
  function resetHighlights() {
    node.attr("opacity", 1);
    link.attr("stroke-opacity", 0.3);
    link.attr("stroke", "var(--text-muted)");
  }
  
  const labels = gContainer.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes.filter(d => d.papers.length >= 2))
    .enter()
    .append("text")
    .attr("dx", d => d.radius + 3)
    .attr("dy", 4)
    .text(d => d.id.split(",")[0]);
  
  function isConnected(a, b) {
    const key1 = `${a}|${b}`;
    const key2 = `${b}|${a}`;
    return coauthorships[key1] || coauthorships[key2];
  }
  
  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
      
    labels
      .attr("x", d => d.x)
      .attr("y", d => d.y);
  });
  
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

// Render Journal charts
function renderJournalRanking(articles) {
  const canvas = document.getElementById("journal-chart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  if (appData.charts.journal) {
    appData.charts.journal.destroy();
  }
  
  const journalCounts = {};
  articles.forEach(art => {
    journalCounts[art.journal] = (journalCounts[art.journal] || 0) + 1;
  });
  
  const sortedJournals = Object.keys(journalCounts)
    .map(key => ({ name: key, count: journalCounts[key] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
    
  const isDark = document.body.classList.contains("dark-theme") || !document.body.classList.contains("light-theme");
  const textColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    
  appData.charts.journal = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedJournals.map(j => j.name.substring(0, 25) + (j.name.length > 25 ? '...' : '')),
      datasets: [{
        label: 'Número de Papers',
        data: sortedJournals.map(j => j.count),
        backgroundColor: 'rgba(56, 189, 248, 0.7)',
        borderColor: '#38bdf8',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (context) => sortedJournals[context[0].dataIndex].name
          }
        }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor, stepSize: 1, precision: 0 }
        },
        y: {
          grid: { display: false },
          ticks: { color: textColor }
        }
      }
    }
  });
}

// Render Timeline
function renderTimeline(articles) {
  const container = document.getElementById("timeline-scroll-container");
  if (!container) return;
  container.innerHTML = "";
  
  const seminalMilestones = [
    {
      year: 2016,
      variant: "FITradeoff for choice problematic",
      anchors: ["de Almeida et al., 2016"],
      matchRule: (art) => {
        const authStr = art.authors.join(" ");
        return art.year === 2016 && authStr.includes("Almeida") && 
          (art.title.toLowerCase().includes("weights") || art.title.toLowerCase().includes("elicitation") || art.title.toLowerCase().includes("choice"));
      }
    },
    {
      year: 2019,
      variant: "FITradeoff for ranking problematic",
      anchors: ["Frej et al., 2019"],
      matchRule: (art) => {
        const authStr = art.authors.join(" ");
        return (art.year === 2019 && authStr.includes("Frej") && authStr.includes("Almeida") && art.title.toLowerCase().includes("ranking"));
      }
    },
    {
      year: 2020,
      variant: "FITradeoff for sorting problematic",
      anchors: ["Kang et al., 2020"],
      matchRule: (art) => {
        const authStr = art.authors.join(" ");
        return art.year === 2020 && authStr.includes("Kang") && authStr.includes("Almeida") && art.title.toLowerCase().includes("sorting");
      }
    },
    {
      year: 2021,
      variant: "FITradeoff for portfolio problematic",
      anchors: ["Frej et al., 2021"],
      matchRule: (art) => {
        const authStr = art.authors.join(" ");
        return (art.year === 2021 && authStr.includes("Frej") && authStr.includes("Ekel") && art.title.toLowerCase().includes("portfolio"));
      }
    },
    {
      year: 2022,
      variant: "FITradeoff for negotiation",
      anchors: ["Frej et al., 2022"],
      matchRule: (art) => {
        const authStr = art.authors.join(" ");
        return (art.year === 2021 || art.year === 2022) && authStr.includes("Frej") && authStr.includes("Morais") && art.title.toLowerCase().includes("negotiation");
      }
    },
    {
      year: 2025,
      variant: "FITradeoff for group decision",
      anchors: ["De Almeida et al., 2025"],
      matchRule: (art) => {
        const authStr = art.authors.join(" ");
        return art.year === 2025 && authStr.includes("Almeida") && authStr.includes("Frej") && art.title.toLowerCase().includes("group");
      }
    }
  ];
  
  seminalMilestones.forEach(m => {
    const matchingPapers = articles.filter(art => m.matchRule(art));
    const paperLinksHtml = matchingPapers.length > 0
      ? matchingPapers.map(p => `
          <a class="timeline-paper" href="${p.link || '#'}" target="_blank" style="display:block;font-size:0.75rem;color:var(--accent-blue);text-decoration:none;margin-bottom:4px;line-height:1.3;">
            • <strong>${p.authors[0].split(',')[0]} et al. (${p.year})</strong>: ${p.title.substring(0, 70)}...
          </a>
        `).join("")
      : '<div style="font-size:0.75rem;color:var(--text-muted);font-style:italic;">Nenhum paper indexado correspondente detectado</div>';

    const item = document.createElement("div");
    item.className = "timeline-item active";
    item.innerHTML = `
      <div class="timeline-marker"></div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:3px;">
        <span style="font-size:0.8rem;font-weight:700;color:var(--text-primary);">${m.variant}</span>
        <span style="font-size:0.75rem;font-weight:700;color:var(--accent-purple);">${m.year}</span>
      </div>
      <div class="timeline-body">
        <div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:4px;">
          Marcos: <strong>${m.anchors.join(" e ")}</strong>
        </div>
        <div class="timeline-papers">
          ${paperLinksHtml}
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

// Render Context and Area distributions (Economic Area strictly formatted)
function renderContextAndAreaDistribution(articles) {
  const contextCanvas = document.getElementById("context-chart");
  if (!contextCanvas) return;
  const contextCtx = contextCanvas.getContext("2d");
  
  if (appData.charts.context) {
    appData.charts.context.destroy();
  }
  
  const contextCounts = {
    "Decisão Individual": 0,
    "Negociação": 0,
    "Decisão em Grupo / GDSS": 0
  };
  
  articles.forEach(art => {
    if (contextCounts[art.decisionContext] !== undefined) {
      contextCounts[art.decisionContext]++;
    }
  });
  
  const isDark = document.body.classList.contains("dark-theme") || !document.body.classList.contains("light-theme");
  const textColor = isDark ? '#94a3b8' : '#475569';
  
  appData.charts.context = new Chart(contextCtx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(contextCounts),
      datasets: [{
        data: Object.values(contextCounts),
        backgroundColor: [
          'rgba(56, 189, 248, 0.75)',
          'rgba(192, 132, 252, 0.75)',
          'rgba(45, 212, 191, 0.75)'
        ],
        borderColor: isDark ? '#141c2f' : '#ffffff',
        borderWidth: 1.5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: textColor, boxWidth: 10, font: { size: 9 } }
        }
      }
    }
  });
  
  // Economic Area chart (Excludes "Teoria & Neurociência" from economic areas)
  const areaCanvas = document.getElementById("area-chart");
  if (!areaCanvas) return;
  const areaCtx = areaCanvas.getContext("2d");
  
  if (appData.charts.area) {
    appData.charts.area.destroy();
  }
  
  const areaCounts = {};
  articles.forEach(art => {
    // Strictly filter out methodology / theory category from the economy areas chart!
    if (art.economyArea && art.economyArea !== "Teoria & Neurociência" && art.economyArea !== "Outros Setores") {
      areaCounts[art.economyArea] = (areaCounts[art.economyArea] || 0) + 1;
    }
  });
  
  const sortedAreas = Object.keys(areaCounts)
    .map(key => ({ name: key, count: areaCounts[key] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Show top 10 economy areas
    
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    
  appData.charts.area = new Chart(areaCtx, {
    type: 'bar',
    data: {
      labels: sortedAreas.map(a => a.name),
      datasets: [{
        label: 'Número de Casos Práticos',
        data: sortedAreas.map(a => a.count),
        backgroundColor: 'rgba(52, 211, 153, 0.75)',
        borderColor: '#34d399',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { size: 8 } }
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor, stepSize: 1, precision: 0 }
        }
      }
    }
  });
}

// Get list of articles after applying search and variant filters
function getFilteredArticles() {
  const query = document.getElementById("search-input") ? document.getElementById("search-input").value.toLowerCase() : "";
  const filterVal = document.getElementById("variant-filter") ? document.getElementById("variant-filter").value : "all";
  
  return appData.parsedArticles.filter(art => {
    const matchesSearch = 
      art.title.toLowerCase().includes(query) ||
      art.journal.toLowerCase().includes(query) ||
      (art.economyArea && art.economyArea.toLowerCase().includes(query)) ||
      art.authors.join(" ").toLowerCase().includes(query);
      
    const matchesFilter = filterVal === "all" || art.variant === filterVal;
    
    return matchesSearch && matchesFilter;
  });
}

// Render general articles repository table
function renderRepositoryTable() {
  const tbody = document.querySelector("#repository-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  const filtered = getFilteredArticles();
  const total = filtered.length;
  
  // Calculate pagination
  const size = paginationState.pageSize;
  const maxPage = Math.max(1, Math.ceil(total / size));
  if (paginationState.currentPage > maxPage) {
    paginationState.currentPage = maxPage;
  }
  const page = paginationState.currentPage;
  
  const startIdx = (page - 1) * size;
  const endIdx = Math.min(startIdx + size, total);
  
  const pageItems = filtered.slice(startIdx, endIdx);
  
  pageItems.forEach((art, index) => {
    const globalIdx = startIdx + index;
    const tr = document.createElement("tr");
    tr.id = `repo-row-${globalIdx}`;
    
    // Format authors list with Lattes and ORCID clickable icons
    const authorsHtml = art.authors.map(auth => {
      const orcid = art.authorOrcids && art.authorOrcids[auth] ? art.authorOrcids[auth] : "";
      const lattesUrl = `https://google.com/search?q=site:lattes.cnpq.br+%22${encodeURIComponent(auth)}%22`;
      const orcidUrl = orcid ? (orcid.startsWith("http") ? orcid : `https://orcid.org/${orcid}`) : "";
      
      return `
        <span class="author-item-block" style="display:inline-block;margin-right:0.6rem;white-space:nowrap;margin-bottom:0.15rem;">
          <span class="author-name-text author-click-cell" onclick="navigateToAuthor('${auth.replace(/'/g, "\\'")}')">${auth}</span>
          <span class="author-links-inline" style="display:inline-flex;gap:3px;margin-left:3px;vertical-align:middle;">
            <a href="${lattesUrl}" target="_blank" title="Pesquisar Lattes de ${auth}" style="display:inline-flex;align-items:center;justify-content:center;background:#0d9488;color:#fff;width:12px;height:12px;border-radius:2px;font-size:7px;font-weight:bold;text-decoration:none;line-height:1;">L</a>
            ${orcidUrl ? `<a href="${orcidUrl}" target="_blank" title="Ver Perfil ORCID de ${auth}" style="display:inline-flex;align-items:center;justify-content:center;background:#a6c307;color:#fff;width:12px;height:12px;border-radius:2px;font-size:6px;font-weight:bold;text-decoration:none;line-height:1;">ID</a>` : ""}
          </span>
        </span>
      `;
    }).join(", ");
    
    tr.innerHTML = `
      <td class="td-authors">${authorsHtml}</td>
      <td class="td-year">${art.year}</td>
      <td class="td-title" style="font-weight: 600; color: var(--text-primary);">${art.title}</td>
      <td><span class="header-badge" style="background-color: var(--bg-secondary); border-color: var(--border-color); color: var(--accent-purple);">${art.variant}</span></td>
      <td><span class="header-badge" style="background-color: var(--bg-secondary); border-color: var(--border-color); color: var(--accent-blue);">${art.economyArea || "Outros Setores"}</span></td>
      <td>
        ${art.link ? `<a class="btn-theme-toggle" style="width:24px;height:24px;font-size:0.65rem;" href="${art.link}" target="_blank" title="Acessar Artigo">🔗</a>` : '<span style="color:var(--text-muted);">-</span>'}
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Update indicators
  const pStart = document.getElementById("pagination-start");
  const pEnd = document.getElementById("pagination-end");
  const pTotal = document.getElementById("pagination-total");
  const pageInd = document.getElementById("current-page-indicator");
  const prevBtn = document.getElementById("prev-page-btn");
  const nextBtn = document.getElementById("next-page-btn");

  if (pStart) pStart.textContent = total > 0 ? startIdx + 1 : 0;
  if (pEnd) pEnd.textContent = endIdx;
  if (pTotal) pTotal.textContent = total;
  if (pageInd) pageInd.textContent = `Pág. ${page} de ${maxPage}`;
  if (prevBtn) prevBtn.disabled = page === 1;
  if (nextBtn) nextBtn.disabled = page === maxPage;
}

// Render manual review table
function renderFailedTable() {
  const tbody = document.querySelector("#failed-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  if (appData.failedArticles.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="2" style="text-align:center;color:var(--color-success);font-style:italic;padding:2rem;">Nenhum artigo necessitando de revisão manual. Dados higienizados!</td>';
    tbody.appendChild(tr);
    return;
  }
  
  appData.failedArticles.forEach((art, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="raw-source" style="font-family:monospace; font-size:0.75rem; white-space:pre-wrap; color:var(--text-secondary); max-height:80px; overflow-y:auto;">${escapeHtml(art.rawText)}</div>
      </td>
      <td>
        <div class="error-msg" style="color:var(--color-error); font-weight:600;">${art.error}</div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Filter changed: reset page index
function handleFilterChange() {
  paginationState.currentPage = 1;
  renderRepositoryTable();
}

// Export clean table to CSV (Optimized for Excel in Portuguese with Semicolon Delimiter)
function exportToCSV() {
  if (appData.parsedArticles.length === 0) {
    alert("Nenhum dado higienizado para exportar.");
    return;
  }
  
  // Start with UTF-8 BOM so Excel opens accents correctly
  let csvContent = "\ufeff";
  csvContent += "Autores;Ano;Título;Variante;Periódico;Link;Contexto Social;Área Economia;País\n";
  
  appData.parsedArticles.forEach(art => {
    const row = [
      `"${art.authors.join(', ').replace(/"/g, '""')}"`,
      art.year,
      `"${art.title.replace(/"/g, '""')}"`,
      `"${art.variant}"`,
      `"${art.journal.replace(/"/g, '""')}"`,
      `"${art.link || ''}"`,
      `"${art.decisionContext}"`,
      `"${art.economyArea}"`,
      `"${art.country}"`
    ];
    csvContent += row.join(";") + "\n";
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  const dateStr = new Date().toISOString().substring(0, 10);
  link.setAttribute("download", `fitradeoff_literatura_higienizada_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Tooltip Helpers
function showTooltip(event, htmlContent) {
  const tooltip = document.getElementById("global-tooltip");
  if (!tooltip) return;
  tooltip.innerHTML = htmlContent;
  tooltip.style.display = "block";
  tooltip.style.left = (event.pageX + 15) + "px";
  tooltip.style.top = (event.pageY + 15) + "px";
}

function hideTooltip() {
  const tooltip = document.getElementById("global-tooltip");
  if (tooltip) {
    tooltip.style.display = "none";
  }
}

// Utility to escape HTML entities
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
