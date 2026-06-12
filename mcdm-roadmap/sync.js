// Automated OpenAlex Synchronization Module for MCDM/MCDA publications (Topic-Filtered & Clustered version)
const db = require('./db.js');

// Helper to reconstruct abstract from OpenAlex inverted index
function reconstructAbstract(invertedIndex) {
  if (!invertedIndex) return '';
  const words = [];
  try {
    Object.entries(invertedIndex).forEach(([word, positions]) => {
      positions.forEach(pos => {
        words[pos] = word;
      });
    });
    return words.join(' ');
  } catch (err) {
    console.warn('Error reconstructing abstract:', err.message);
    return '';
  }
}

// Classifier rules using regex to map papers to learning roadmap nodes
function classifyArticle(title, abstract) {
  const text = `${title} ${abstract}`.toLowerCase();
  const clusters = [];

  const rules = {
    'method-fitradeoff': /fitradeoff/i,
    'method-bwm': /best[\s-]worst\s+method|bwm/i,
    'method-bwt': /best[\s-]worst\s+tradeoff|bwt/i,
    'method-ahp': /analytic\s+hierarchy\s+process|ahp/i,
    'method-electre': /electre/i,
    'method-promethee': /promethee/i,
    'method-smaa': /smaa|stochastic\s+multicriteria\s+acceptability/i,
    'method-topsis': /topsis/i,
    'method-vikor': /vikor/i,
    'method-copras': /copras/i,
    'method-oreste': /oreste/i,
    'method-macbeth': /macbeth/i,
    'method-maut': /maut|multiattribute\s+utility|multi-attribute\s+utility|uta\s+method|utilite\s+additive/i,
    'method-vft': /vft|value[\s-]focused\s+thinking/i,
    'method-swing': /swing\s+weight/i,
    'method-smarts': /smarts/i,
    'method-smarter': /smarter/i,
    'method-drsa': /drsa|dominance[\s-]based\s+rough|dominance\s+rough/i,
    'method-fuzzy': /fuzzy/i,
    'method-critic': /critic\s+method|entropy\s+weight/i,
    'method-merec': /merec\s+method|removal\s+effects\s+of\s+criteria/i,
    'method-dea': /data\s+envelopment\s+analysis|dea\s+method/i,
    'method-pref-learning': /preference\s+learning/i,
    'method-xai': /explainable\s+ai|xai|shapley\s+additive\s+explanations|shap\s+value/i,
    'env-group': /group\s+decision|group\s+elicitation|group\s+consensus|multi-expert/i,
    'env-negotiation': /negotiation|bargaining/i,
    'front-behavioral': /behavioral\s+mcda|behavioral\s+mcdm|neuroscience|eye[\s-]tracking|cognitive\s+load|pupil\s+dilation/i,
    'front-ai-integration': /machine\s+learning|preference\s+learning|artificial\s+intelligence|neural\s+network|deep\s+learning|explainable\s+ai|xai/i
  };

  Object.entries(rules).forEach(([nodeId, regex]) => {
    if (regex.test(text)) {
      clusters.push(nodeId);
    }
  });

  if (clusters.length === 0) {
    // General classification fallback inside Multi-Criteria Decision Making topic
    if (/elicitation|preference|weighting|workload|bias/i.test(text)) {
      clusters.push('elicitation-concepts');
    } else if (/problematic|sorting|portfolio|choice|ranking/i.test(text)) {
      clusters.push('decision-problematics');
    } else {
      clusters.push('mcdm-intro');
    }
  }

  return clusters;
}

// Fetch a batch of works matching keyword under topic T10050 (Multi-Criteria Decision Making)
async function fetchOpenAlexBatch(keyword) {
  // If keyword is empty, fetch top cited general MCDM works
  const filter = keyword 
    ? `primary_topic.id:T10050,title_and_abstract.search:${encodeURIComponent(keyword)}`
    : `primary_topic.id:T10050`;
  const limit = keyword ? 30 : 80;
  
  const url = `https://api.openalex.org/works?filter=${filter},publication_year:>2023&per_page=${limit}&sort=cited_by_count:desc`;
  console.log(`Fetching OpenAlex works for keyword: "${keyword || 'General MCDM'}" ...`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MCDMRoadmap/1.0 (mailto:pedro.gouveia@cdsid.org.br)'
      }
    });

    if (!response.ok) {
      console.warn(`OpenAlex query for [${keyword}] failed with status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map(work => {
      // Extract author names
      const authors = [];
      if (work.authorships && Array.isArray(work.authorships)) {
        work.authorships.forEach(auth => {
          if (auth.author && auth.author.display_name) {
            authors.push(auth.author.display_name);
          }
        });
      }

      // Extract journal source
      let journal = 'Unknown Journal / Conference';
      if (work.primary_location && work.primary_location.source && work.primary_location.source.display_name) {
        journal = work.primary_location.source.display_name;
      }

      // Extract DOI or landing page
      const link = work.doi || (work.primary_location && work.primary_location.landing_page_url) || '#';

      // Reconstruct abstract and classify
      const abstract = reconstructAbstract(work.abstract_inverted_index);
      const clusterIds = classifyArticle(work.title || '', abstract);

      return {
        id: work.id,
        title: work.title || 'Untitled Publication',
        authors: authors.length > 0 ? authors : ['Unknown Author'],
        journal: journal,
        year: work.publication_year || new Date().getFullYear(),
        citation_count: work.cited_by_count || 0,
        link: link,
        cluster_ids: clusterIds
      };
    });
  } catch (err) {
    console.error(`Error fetching batch for keyword [${keyword}]:`, err.message);
    return [];
  }
}

// Synchronize MCDM/MCDA publications with OpenAlex and categorise them
async function syncOpenAlex() {
  console.log('Initiating topic-filtered and clustered sync with OpenAlex...');

  // Search terms to retrieve specific research publications under Topic T10050
  const searchQueries = [
    '', // general stream
    'FITradeoff',
    'Best Worst Method',
    'Best-Worst Tradeoff',
    'ELECTRE',
    'PROMETHEE',
    'SMAA',
    'TOPSIS',
    'VIKOR',
    'COPRAS',
    'ORESTE',
    'MACBETH',
    'MAUT',
    'UTA method',
    'Value-Focused Thinking',
    'DRSA',
    'group decision',
    'negotiation',
    'behavioral decision',
    'preference learning',
    'CRITIC method',
    'Entropy method',
    'MEREC method',
    'Data Envelopment Analysis',
    'explainable AI'
  ];

  try {
    // Execute fetches in parallel
    const fetchPromises = searchQueries.map(q => fetchOpenAlexBatch(q));
    const results = await Promise.allSettled(fetchPromises);

    const mergedArticles = new Map();

    results.forEach((result, idx) => {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        result.value.forEach(art => {
          if (mergedArticles.has(art.id)) {
            // Merge cluster tags for duplicate papers found across search queries
            const existing = mergedArticles.get(art.id);
            const mergedTags = Array.from(new Set([...existing.cluster_ids, ...art.cluster_ids]));
            existing.cluster_ids = mergedTags;
          } else {
            mergedArticles.set(art.id, art);
          }
        });
      }
    });

    const finalArticles = Array.from(mergedArticles.values());
    // Sort by citation count descending
    finalArticles.sort((a, b) => b.citation_count - a.citation_count);

    console.log(`Exhaustive sync complete. Clustered ${finalArticles.length} unique relevant MCDM articles.`);

    if (finalArticles.length === 0) {
      throw new Error('Could not retrieve any articles from OpenAlex.');
    }

    // Cache to DB
    const count = await db.saveArticles(finalArticles);
    console.log(`DB write completed. successfully cached ${count} articles.`);
    return { success: true, count, message: `Sync concluído! ${count} artigos categorizados com sucesso.` };

  } catch (err) {
    console.error('Error in syncOpenAlex:', err);
    return { success: false, error: err.message };
  }
}

// Support running this script directly for manual verification
if (require.main === module) {
  const args = process.argv;
  if (args.includes('--test-sync')) {
    (async () => {
      console.log('--- RUNNING STANDALONE EXHAUSTIVE SYNC TEST ---');
      await db.testConnection();
      const result = await syncOpenAlex();
      console.log('Sync Result:', result);
      
      const stats = await db.getStats();
      console.log('Updated Stats:', JSON.stringify(stats, null, 2));
      process.exit(0);
    })();
  }
}

module.exports = {
  syncOpenAlex
};
