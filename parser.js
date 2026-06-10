// Deterministic Parser and Dynamic Classifier for FITradeoff Academic Literature
// Designed as a Zero-Hallucination parsing layer.

const KNOWN_JOURNALS = [
  "Omega",
  "Group Decision and Negotiation",
  "Group Decis Negot",
  "Central European Journal of Operations Research",
  "Cent Eur J Oper Res",
  "European Journal of Operational Research",
  "EJOR",
  "Annals of Operations Research",
  "Annals of OR",
  "International Transactions in Operational Research",
  "Intl. Trans. in Op. Res.",
  "ITOR",
  "Pesquisa Operacional",
  "OPSEARCH",
  "Mathematics",
  "Water Resources Management",
  "Journal of Cleaner Production",
  "International Journal of Production Economics",
  "Energy",
  "Sustainable Cities and Society",
  "Mathematical Problems in Engineering",
  "Production",
  "Management Decision",
  "BMC Medical Informatics and Decision Making",
  "BMC Public Health",
  "Journal of Decision Systems",
  "Business Strategy and the Environment",
  "Utilities Policy",
  "Expert Systems with Applications",
  "International Journal of Construction Management",
  "Violence Against Women",
  "Engineering, Construction and Architectural Management",
  "Gest. prod",
  "Gestão & Produção",
  "WORK",
  "IMA Journal of Management Mathematics",
  "Information Systems Frontiers",
  "Logistics",
  "Decision Science Letters",
  "Control & Cybernetics",
  "Journal of Research in Interactive Marketing",
  "International Journal of Decision Support System Technology",
  "IJDSST",
  "Innovation for Systems Information and Decision Meeting",
  "Lecture Notes in Business Information Processing",
  "Lecture Notes in Computer Science",
  "Computational Science and Its Applications",
  "IEEE International Conference on Systems, Man, and Cybernetics",
  "IEEE International Conference on Industrial Engineering and Engineering Management"
];

// Mapping structure for strict Economic Sectors / Areas of Economy
const DYNAMIC_CLUSTERS = {
  "Setor de Energia e Recursos Naturais": ["energy", "solar", "wind", "power", "generation", "electricity", "gas", "motor", "oil", "fuel", "renewable", "renewables", "eólica", "elétrica", "combustível", "water", "aquifer", "river", "supply system", "hydric", "reservoir", "distribution network", "watershed", "water supply", "aquífero", "saneamento", "água"],
  "Políticas Públicas": ["public policy", "public procurement", "compras públicas", "governo", "público", "school location", "localização de escola", "política pública", "políticas públicas"],
  "Setor Industrial": ["manufacturing", "production planning", "raw material", "job-shop", "fmea", "production systems", "agile model", "manufatura", "fábrica", "industrial", "indústria", "plásticos", "manutenção industrial", "wcm"],
  "Setor de Construção": ["construction", "subcontractor", "infrastructure", "road", "plastering", "highway", "civil construction", "roads", "construção", "obras", "subcontratados"],
  "Saúde": ["health", "medicine", "hospital", "triage", "aedes", "aegypti", "medical", "care units", "healthcare", "medicines", "hospitalar", "saúde", "domiciliar", "hiv", "ela", "esclerose", "pacientes", "paciente"],
  "Tecnologia": ["software", "information system", "strategic information", "startups", "startup", "data protection", "compliance", "tecnologia", "sistemas", "agile model", "it company", "deliberation system", "electronic negotiation", "inpi", "security", "cybersecurity"],
  "Logística": ["supplier", "logistics", "reverse logistics", "retailer", "wholesaler", "supply chain", "circular", "food supplier", "procurement", "supply disruption", "compras", "fornecedor", "delivery platform", "distribuidor"],
  "Agricultura": ["agribusiness", "agricultural", "mango", "food economy", "circular food", "agronegócio", "alimentos", "cultura", "manga", "camarão", "shrimp", "irrigado"],
  "Recursos Humanos": ["human resources", "workstations", "ergonomic", "ergonomics", "footwear", "remote work", "call center", "trabalho", "colaboradores", "perfil", "equipe", "ergonômico"],
  "Segurança Pública": ["police", "military", "budget", "armed forces", "violence", "women", "segurança", "polícia", "militar", "guerra", "combatentes"],
  "ESG": ["social sustainability", "waste", "recycling", "compliance", "lgpd", "resíduos", "lixo", "aterro", "sustentabilidade", "circular economy"],
  "Turismo": ["tourism", "cultural", "turismo"],
  "Transporte": ["mobility", "transportation", "carrier", "truck", "rotas", "transporte", "intermunicipal"]
};

// Map dynamically discovered keywords to clean Portuguese economic sectors
const KEYWORD_SECTOR_MAP = {
  "police": "Segurança Pública",
  "military": "Segurança Pública",
  "armed": "Segurança Pública",
  "budget": "Segurança Pública",
  "subcontractor": "Setor de Construção",
  "construction": "Setor de Construção",
  "startups": "Tecnologia",
  "startup": "Tecnologia",
  "ergonomics": "Recursos Humanos",
  "ergonomic": "Recursos Humanos",
  "workstations": "Recursos Humanos",
  "mobility": "Transporte",
  "transportation": "Transporte",
  "carrier": "Transporte",
  "truck": "Transporte",
  "roads": "Setor de Construção",
  "procurement": "Logística",
  "purchasing": "Logística",
  "waste": "ESG",
  "recycling": "ESG",
  "circular": "ESG",
  "retailer": "Logística",
  "wholesaler": "Logística",
  "supplier": "Logística",
  "tourism": "Turismo",
  "cultural": "Turismo",
  "school": "Políticas Públicas",
  "education": "Políticas Públicas",
  "agribusiness": "Agricultura",
  "agricultural": "Agricultura",
  "mango": "Agricultura",
  "food": "Agricultura",
  "pet": "Setor Industrial",
  "violence": "Políticas Públicas",
  "women": "Políticas Públicas",
  "work": "Recursos Humanos",
  "call": "Recursos Humanos",
  "serviço": "Políticas Públicas",
  "serviços": "Políticas Públicas",
  "educação": "Políticas Públicas",
  "escola": "Políticas Públicas",
  "hospital": "Saúde",
  "saúde": "Saúde",
  "energia": "Setor de Energia e Recursos Naturais",
  "água": "Setor de Energia e Recursos Naturais",
  "saneamento": "Setor de Energia e Recursos Naturais",
  "resíduos": "ESG",
  "lixo": "ESG",
  "fornecedor": "Logística",
  "logística": "Logística",
  "transporte": "Transporte",
  "construção": "Setor de Construção",
  "obras": "Setor de Construção",
  "militar": "Segurança Pública",
  "polícia": "Segurança Pública",
  "público": "Políticas Públicas",
  "governo": "Políticas Públicas",
  "agronegócio": "Agricultura",
  "alimentos": "Agricultura",
  "software": "Tecnologia",
  "tecnologia": "Tecnologia",
  "program": "Tecnologia",
  "irrigado": "Agricultura"
};

// Methodological words to ignore completely in economic clustering
const METHODOLOGY_STOP_WORDS = new Set([
  'the', 'and', 'for', 'using', 'with', 'from', 'under', 'based', 'method', 'fitradeoff', 'multicriteria', 
  'decision', 'making', 'model', 'approach', 'selection', 'ranking', 'sorting', 'portfolio', 'application', 
  'problems', 'aiding', 'elicitation', 'support', 'additive', 'models', 'analysis', 'study', 'experiment', 
  'evaluating', 'evaluation', 'prioritizing', 'prioritization', 'solving', 'case', 'system', 'systems', 
  'dss', 'results', 'preferences', 'information', 'partial', 'interactive', 'flexible', 'procedure', 
  'value', 'focused', 'thinking', 'alternatives', 'criteria', 'weights', 'scales', 'constants', 'project', 
  'projects', 'rules', 'rule', 'combining', 'paradigms', 'problematic', 'new', 'novel', 'aspects', 'analytical',
  'selected', 'selecting', 'interventions', 'transition', 'performance', 'actions', 'improved', 'improving',
  'integrating', 'integration', 'hybrid', 'concept', 'concepts', 'special', 'criticality', 'investigate',
  'tradeoff', 'tradeoffs', 'eliciting', 'dominance', 'relationship', 'relationships', 'scale', 'parameters', 'cognitive',
  'visualizations', 'visualization', 'simulation', 'experiments', 'success-based', 'diagram', 'alpha-theta',
  'neuroscience', 'neurois', 'behavioral', 'preference', 'mcdm', 'mcgdm', 'holistic', 'decomposition',
  'group', 'negotiation', 'negotiators', 'choice', 'stakeholders', 'collective', 'rebuilding', 'feedback',
  'compensatory', 'context', 'brain', 'e-waste', 'waste', 'fmea', 'failures', 'modes', 'effects', 'remote',
  'setting', 'assessing', 'decisions', 'developing', 'summary', 'review', 'framework', 'survey', 'overview',
  'perspectives', 'developments', 'trends', 'challenges', 'advances', 'state-of-the-art', 'assigning',
  'priorities', 'modelling', 'modeling', 'methods', 'methodology', 'methodologies', 'apply', 'applying',
  'applied', 'studies', 'problem', 'problematic', 'flexibility', 'decomposition-based', 'web-based',
  'software-based', 'system-based', 'agile', 'scrum', 'lean', 'kanban', 'numerical', 'simulated', 'experimental',
  'assessment', 'evaluate', 'criterion', 'alternative', 'weighting', 'scaling', 'decision-aid', 'decision-support',
  'imprecise', 'uncertain', 'vague', 'fuzzy', 'rough', 'interval', 'consensus', 'negotiations', 'cooperation',
  'information-driven', 'benefit-to-cost', 'cost-benefit', 'multi-criteria', 'group-decision', 'decision-making',
  'decision-maker', 'decision-makers', 'multiple-criteria', 'public-private', 'bestfit', 'outsourcing',
  'location', 'locating', 'facilities', 'all', 'allocation', 'resources',
  'driven', 'benefit', 'cost', 'ratio', 'maker', 'makers', 'private', 'bestfit', 'public',
  'análise', 'analise', 'modelo', 'modelagem', 'método', 'metodo', 'metodologia', 'estudo', 'caso', 'apoio', 
  'decisão', 'decisao', 'multicritério', 'multicriterio', 'aplicação', 'aplicacao', 'artigo', 'pesquisa', 
  'operacional', 'priorização', 'priorizacao', 'definição', 'definicao', 'seleção', 'selecao', 'estruturação', 
  'estruturacao', 'problemas', 'avaliação', 'avaliacao', 'sistema', 'sistemas', 'processo', 'processos', 
  'investigação', 'investigacao', 'utilizando', 'abordagem', 'proposta', 'comportamental', 'comportamento', 
  'preferência', 'preferencia', 'preferências', 'preferencias', 'elicitação', 'elicitacao', 'grupo', 
  'negociação', 'negociacao', 'alternativas', 'todo', 'sobre', 'estudos', 'desenho', 'localiza', 'localização',
  'localizacao', 'indicadores', 'lise', 'neuroci', 'desempenho', 'modelos', 'portfólio', 'melhorando', 
  'aprimoramento', 'conceito', 'incorporação', 'incorporacao', 'ordens', 'atividades', 'unidades', 'equipe', 
  'perímetro', 'perimetro', 'avaliar', 'escolha', 'apoio', 'tomada', 'procedimentos', 'busca', 'produto',
  'problemática', 'algoritmo', 'durante', 'meio', 'manutenções', 'atenção', 'trabalho', 'aplicado', 'comparação',
  'comparacao', 'impacto', 'real', 'layout', 'subcontratados', 'inconsistencies', 'aspectos', 'informação',
  'informacao', 'para', 'horários', 'horarios', 'laboratórios', 'laboratorios', 'otimização', 'otimizacao',
  'movimentos', 'interfaces', 'ativa', 'combinada', 'contexto', 'evolucionário', 'evolucionario', 'estratégica',
  'estrategica', 'jogo', 'arquitetura', 'corretivas', 'domiciliar', 'neurociência', 'neurociencia', 'avanços',
  'avancos', 'descritiva', 'maturity', 'improvement', 'identifying', 'incorporating', 'graphical', 'indicators',
  'bpmm', 'intracritério', 'intracriterio', 'normas', 'novo', 'problema', 'ordenação', 'ordenacao', 'melhoria',
  'celebrity', 'unidades', 'atividades', 'perímetro', 'perimetro', 'hierarchical', 'improvements', 'structure',
  'seattle', 'ottawa', 'informs', 'meeting', 'annual', 'conference', 'symposium', 'proceedings', 'anais', 'simpósio',
  'simposio', 'enegep', 'sbpo', 'encontro', 'nacional', 'congresso', 'congress', 'workshop', 'special', 'session',
  'section', 'sections', 'journal', 'publishing', 'publisher', 'editorial', 'hindawi', 'springer', 'elsevier',
  'ieee', 'taylor', 'francis', 'emerald', 'mdpi', 'scielo', 'wiley', 'inpi', 'joint', 'intervention', 'interventions',
  'activities', 'control', 'loughborough', 'international', 'bellingham', 'university', 'spie', 'universidade',
  'faculdade', 'instituto', 'department', 'departamento', 'press', 'editora', 'editorial', 'taipei'
]);

// Normalizes and unifies author names (exhaustive deduplication mappings)
function normalizeAuthorName(name) {
  if (!name) return "";
  
  // Clean punctuation, extra spaces, and brackets
  let raw = name.trim()
    .replace(/^[\s,;\*]+|[\s,;\*]+$/g, '')
    .replace(/\s*et\s*al\.?\s*/i, '')
    .replace(/\[|\]/g, '')
    .trim();
  
  const lower = raw.toLowerCase();
  const cleanLower = lower.replace(/[\s\.;\*,&\[\]]+/g, ' ');
  
  // 1. Adiel Teixeira de Almeida (Seminar)
  if (cleanLower.includes("adiel teixeira") || 
      (cleanLower.includes("almeida") && (cleanLower.includes("a t") || cleanLower.includes("at") || cleanLower.includes("adiel"))) && 
      !cleanLower.includes("filho") && !cleanLower.includes("jonatas") && !cleanLower.includes("jônatas") && !cleanLower.includes("j a") && !cleanLower.includes("j. a.")) {
    return "Almeida, A. T.";
  }
  
  // 2. Eduarda Asfora Frej (Seminar)
  if (cleanLower.includes("frej") && (cleanLower.includes("eduarda") || cleanLower.includes("e a") || cleanLower.includes("ea") || cleanLower.includes("asfora"))) {
    return "Frej, E. A.";
  }
  
  // 3. Lucia Reis Peixoto Roselli (Seminar)
  if (cleanLower.includes("roselli") && (cleanLower.includes("lucia") || cleanLower.includes("l r p") || cleanLower.includes("lrp") || cleanLower.includes("l r") || cleanLower.includes("peixoto"))) {
    return "Roselli, L. R. P.";
  }
  
  // 4. Jônatas Araújo de Almeida
  if (cleanLower.includes("almeida") && (cleanLower.includes("jonatas") || cleanLower.includes("jônatas") || cleanLower.includes("j a a") || cleanLower.includes("j a d") || cleanLower.includes("j a") || cleanLower.includes("araujo") || cleanLower.includes("araújo"))) {
    return "Almeida, J. A.";
  }
  
  // 5. Ana Paula Cabral Seixas Costa
  if (cleanLower.includes("costa") && (cleanLower.includes("ana paula") || cleanLower.includes("a p c s") || cleanLower.includes("apcs") || cleanLower.includes("a p c") || cleanLower.includes("seixas"))) {
    return "Costa, A. P. C. S.";
  }
  
  // 6. Danielle Costa Morais
  if (cleanLower.includes("morais") && (cleanLower.includes("danielle") || cleanLower.includes("d c") || cleanLower.includes("dc") || cleanLower.includes("danielle costa"))) {
    return "Morais, D. C.";
  }
  
  // 7. Anderson Thiago de Almeida Filho (Son)
  if (cleanLower.includes("almeida") && cleanLower.includes("filho")) {
    return "Almeida-Filho, A. T.";
  }
  
  // 8. Luciana Hazin Alencar
  if (cleanLower.includes("alencar") && (cleanLower.includes("luciana") || cleanLower.includes("l h") || cleanLower.includes("lh") || cleanLower.includes("hazin"))) {
    return "Alencar, L. H.";
  }
  
  // 9. Ana Paula Henriques de Gusmão
  if (cleanLower.includes("gusmao") || cleanLower.includes("gusmão")) {
    return "Gusmão, A. P. H.";
  }
  
  // 10. Robson José Pinho Ferreira
  if (cleanLower.includes("ferreira") && (cleanLower.includes("robson") || cleanLower.includes("r j p") || cleanLower.includes("rjp"))) {
    return "Ferreira, R. J. P.";
  }

  // 11. Caroline Maria de Miranda Mota
  if (cleanLower.includes("mota") && (cleanLower.includes("caroline") || cleanLower.includes("c m") || cleanLower.includes("c m d") || cleanLower.includes("miranda"))) {
    return "Mota, C. M. M.";
  }

  // 12. Cristiano Alexandre Virginio Cavalcante
  if (cleanLower.includes("cavalcante") && (cleanLower.includes("cristiano") || cleanLower.includes("c a") || cleanLower.includes("c a v"))) {
    return "Cavalcante, C. A. V.";
  }

  // 13. Thalles Ricardo de Souza Vasconcelos
  if (cleanLower.includes("vasconcelos") || cleanLower.includes("thalles")) {
    return "Vasconcelos, T. R. S.";
  }

  // 14. Tianxiang Kang (T. H. A. Kang)
  if (cleanLower.includes("kang") && (cleanLower.includes("t h a") || cleanLower.includes("tha") || cleanLower.includes("takanni") || cleanLower.includes("tianxiang"))) {
    return "Kang, T. H. A.";
  }

  // 15. Petr Ekel
  if (cleanLower.includes("ekel") && (cleanLower.includes("p") || cleanLower.includes("petr"))) {
    return "Ekel, P.";
  }

  // 16. Tomasz Wachowicz
  if (cleanLower.includes("wachowicz") && (cleanLower.includes("t") || cleanLower.includes("tomasz"))) {
    return "Wachowicz, T.";
  }

  // 17. Alessandra Oppio
  if (cleanLower.includes("oppio") && (cleanLower.includes("a") || cleanLower.includes("alessandra"))) {
    return "Oppio, A.";
  }

  // 18. Marta Dell'Ovo
  if ((cleanLower.includes("dell'ovo") || cleanLower.includes("dell’ovo") || cleanLower.includes("dell ovo")) && (cleanLower.includes("m") || cleanLower.includes("marta"))) {
    return "Dell'Ovo, M.";
  }

  // 19. José Rui Figueira
  if (cleanLower.includes("figueira") && (cleanLower.includes("j") || cleanLower.includes("r") || cleanLower.includes("josé") || cleanLower.includes("jose"))) {
    return "Figueira, J. R.";
  }

  // 20. Fernando Schramm
  if (cleanLower.includes("schramm") && (cleanLower.includes("f") || cleanLower.includes("fernando"))) {
    return "Schramm, F.";
  }

  // 21. Vanessa Batisti Schramm
  if (cleanLower.includes("schramm") && (cleanLower.includes("v") || cleanLower.includes("b") || cleanLower.includes("vanessa"))) {
    return "Schramm, V. B.";
  }

  // 22. Suzana Daher
  if (cleanLower.includes("daher") && (cleanLower.includes("s") || cleanLower.includes("f") || cleanLower.includes("suzana") || cleanLower.includes("suzan"))) {
    return "Daher, S. F. D.";
  }

  // General fallback parsing Surname, Initials
  const parts = raw.split(',').map(p => p.trim());
  if (parts.length === 2) {
    const surname = parts[0].replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
    let initialsPart = parts[1].trim();
    if (/^[A-Z]{2,4}$/.test(initialsPart)) {
      initialsPart = initialsPart.split('').join('. ');
    }
    let initialsWords = initialsPart.split(/[\s\.]+/).filter(w => w.length > 0);
    let initials = initialsWords.map(w => w.charAt(0).toUpperCase() + ".").join(" ");
    return `${surname}, ${initials}`;
  }
  
  return raw.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

// Checks if a text token is strictly initials (e.g. "A. T.", "M.E.B.T.", "AT", "LRP")
function isInitialsToken(str) {
  const clean = str.trim();
  if (!clean) return false;
  
  if (clean.includes('.')) {
    return /^[A-Z\s\.-]+$/i.test(clean) && clean.replace(/[\s\.-]/g, '').length <= 5;
  }
  
  const isUpper = /^[A-Z\s-]+$/.test(clean);
  if (isUpper) {
    const len = clean.length;
    if (len === 1) return true;
    if (len <= 4) {
      const shortSurnames = new Set(["DU", "KANG", "FREJ", "RICO", "LUGO", "WANG", "CHEN", "LI", "OPPIO", "EKEL"]);
      if (shortSurnames.has(clean)) {
        return false;
      }
      return true;
    }
  }
  return false;
}

// Split authors block into standardized individual names
function splitAuthorsBlock(authorsRaw) {
  let parts = [];
  if (authorsRaw.includes(";")) {
    parts = authorsRaw.split(";");
  } else {
    let cleaned = authorsRaw.replace(/\s+&\s+/g, ', ').replace(/\s+and\s+/g, ', ');
    let rawParts = cleaned.split(",");
    
    for (let i = 0; i < rawParts.length; i++) {
      let part = rawParts[i].trim();
      if (!part) continue;
      
      const isInitials = isInitialsToken(part);
      if (isInitials && parts.length > 0) {
        let prev = parts.pop();
        parts.push(prev + ", " + part);
      } else {
        parts.push(part);
      }
    }
  }
  
  return parts
    .map(p => normalizeAuthorName(p))
    .filter(p => p.length > 0);
}

// Unsupervised Dynamic Economy Area Classifier
function classifyEconomyArea(title, authors = [], year = null) {
  if (!title) return "Teoria & Neurociência";
  
  const titleLower = title.toLowerCase();
  const yearNum = year ? parseInt(year) : null;
  
  // Format authors array to lower case surnames for ease of lookup
  const authSurnames = (Array.isArray(authors) ? authors : [authors])
    .map(a => {
      if (!a) return "";
      const commaIdx = a.indexOf(",");
      return (commaIdx !== -1 ? a.substring(0, commaIdx) : a).trim().toLowerCase();
    })
    .filter(a => a.length > 0);

  const hasAuthor = (surname) => authSurnames.includes(surname.toLowerCase());
  
  // --- 1. USER CITATION EXACT MATCH OVERRIDES ---
  
  // Setor de Energia e Recursos Naturais
  // Ferreira et al., 2025; Fossile et al., 2020; Martins et al., 2020; Kang et al., 2018; de Macedo et al., 2018; da Silva Monte & Morais, 2019; Frej et al., 2024
  if (hasAuthor("fossile") && yearNum === 2020) return "Setor de Energia e Recursos Naturais";
  if (hasAuthor("martins") && yearNum === 2020) return "Setor de Energia e Recursos Naturais";
  if (hasAuthor("kang") && yearNum === 2018) return "Setor de Energia e Recursos Naturais";
  if (hasAuthor("macedo") && yearNum === 2018) return "Setor de Energia e Recursos Naturais";
  if (hasAuthor("monte") && yearNum === 2019) return "Setor de Energia e Recursos Naturais";
  if (hasAuthor("frej") && yearNum === 2024 && (titleLower.includes("wind") || titleLower.includes("eólica"))) return "Setor de Energia e Recursos Naturais";
  if (hasAuthor("ferreira") && yearNum === 2025 && (titleLower.includes("loss") || titleLower.includes("distribution") || titleLower.includes("perdas") || titleLower.includes("elétrico") || titleLower.includes("elétrica"))) {
    return "Setor de Energia e Recursos Naturais";
  }

  // Políticas Públicas
  // Costa & Silva, 2025; da Cunha et al., 2024; Oliveira et al., 2024; Corrêa & Morais, 2024; Frej & de Almeida, 2024; Oliveira et al., 2023; Santos et al., 2023
  if (hasAuthor("costa") && (hasAuthor("silva") || hasAuthor("seixas")) && yearNum === 2025 && (titleLower.includes("violence") || titleLower.includes("women") || titleLower.includes("violência") || titleLower.includes("mulher") || titleLower.includes("políticas públicas") || titleLower.includes("public policies"))) {
    return "Políticas Públicas";
  }
  if (hasAuthor("cunha") && yearNum === 2024) return "Segurança Pública";
  if (hasAuthor("oliveira") && yearNum === 2024 && (titleLower.includes("procurement") || titleLower.includes("compras"))) return "Políticas Públicas";
  if ((hasAuthor("corrêa") || hasAuthor("correa")) && hasAuthor("morais") && yearNum === 2024) return "Políticas Públicas";
  if (hasAuthor("frej") && hasAuthor("almeida") && yearNum === 2024 && (titleLower.includes("school") || titleLower.includes("escola"))) return "Políticas Públicas";
  if (hasAuthor("oliveira") && hasAuthor("morais") && yearNum === 2023 && (titleLower.includes("mobility") || titleLower.includes("urban") || titleLower.includes("mobilidade") || titleLower.includes("rotas"))) {
    return "Políticas Públicas";
  }
  if (hasAuthor("santos") && yearNum === 2023 && (titleLower.includes("military") || titleLower.includes("militar"))) return "Políticas Públicas";

  // Setor Industrial
  // Ribeiro et al., 2024; Zanazzi et al., 2023; Carvalho et al., 2023; Cyreno & Roselli, 2023; Rico Lugo et al., 2023; Rodrigues et al., 2020; Pergher et al., 2020
  if (hasAuthor("ribeiro") && yearNum === 2024 && (titleLower.includes("planning") || titleLower.includes("production") || titleLower.includes("industrial") || titleLower.includes("manufatura") || titleLower.includes("produção"))) {
    return "Setor Industrial";
  }
  if (hasAuthor("zanazzi") && yearNum === 2023) return "Setor Industrial";
  if (hasAuthor("carvalho") && yearNum === 2023 && (titleLower.includes("pet") || titleLower.includes("raw material") || titleLower.includes("matéria-prima"))) return "Setor Industrial";
  if (hasAuthor("cyreno") && hasAuthor("roselli") && yearNum === 2023) return "Setor Industrial";
  if ((hasAuthor("rico") || hasAuthor("lugo")) && yearNum === 2023) return "Setor Industrial";
  if (hasAuthor("rodrigues") && yearNum === 2020 && (titleLower.includes("maintenance") || titleLower.includes("manutenção") || titleLower.includes("ativos") || titleLower.includes("assets"))) {
    return "Setor Industrial";
  }
  if (hasAuthor("pergher") && yearNum === 2020) return "Setor Industrial";

  // Setor de Construção
  // Ferreira et al., 2025; Monteiro do Nascimento et al., 2025; Rodrigues et al., 2023
  if (hasAuthor("ferreira") && yearNum === 2025 && (titleLower.includes("construction") || titleLower.includes("construção") || titleLower.includes("subcontractor") || titleLower.includes("subcontratado"))) {
    return "Setor de Construção";
  }
  if (hasAuthor("nascimento") && yearNum === 2025) return "Setor de Construção";
  if (hasAuthor("rodrigues") && yearNum === 2023 && (titleLower.includes("inspection") || titleLower.includes("inspeção") || titleLower.includes("delay"))) return "Setor de Construção";

  // Saúde
  // de Assis et al., 2022; dos Santos et al., 2022; Frazão et al., 2021; Camilo et al., 2020; Oppio et al., 2020
  if (hasAuthor("assis") && yearNum === 2022) return "Saúde";
  if (hasAuthor("santos") && yearNum === 2022 && (titleLower.includes("aedes") || titleLower.includes("aegypti"))) return "Saúde";
  if ((hasAuthor("frazão") || hasAuthor("frazao")) && yearNum === 2021) return "Saúde";
  if (hasAuthor("camilo") && yearNum === 2020) return "Saúde";
  if (hasAuthor("oppio") && yearNum === 2020) return "Saúde";

  // Tecnologia
  // dos Santos Júnior & Cardoso, 2025; Schramm et al., 2023; Poleto et al., 2020; Gusmão & Medeiros, 2016
  if ((hasAuthor("júnior") || hasAuthor("junior") || hasAuthor("santos")) && hasAuthor("cardoso") && yearNum === 2025 && (titleLower.includes("software") || titleLower.includes("prioritization"))) return "Tecnologia";
  if (hasAuthor("schramm") && yearNum === 2023 && (titleLower.includes("agile") || titleLower.includes("scrum") || titleLower.includes("bestfit"))) return "Tecnologia";
  if (hasAuthor("poleto") && yearNum === 2020) return "Tecnologia";
  if ((hasAuthor("gusmão") || hasAuthor("gusmao")) && hasAuthor("medeiros") && yearNum === 2016) return "Tecnologia";

  // Logística
  // De Medeiros et al., 2024; Causil & Morais, 2023; Manuele dos Santos et al., 2020; Carvalho et al., 2023; Cyreno et al., 2022
  if (hasAuthor("medeiros") && yearNum === 2024 && (titleLower.includes("logistics") || titleLower.includes("logística") || titleLower.includes("startups"))) return "Logística";
  if (hasAuthor("causil") && hasAuthor("morais") && yearNum === 2023) return "Logística";
  if (hasAuthor("santos") && yearNum === 2020 && (titleLower.includes("supplier") || titleLower.includes("fornecedor"))) return "Logística";
  if (hasAuthor("carvalho") && yearNum === 2023 && (titleLower.includes("supply") || titleLower.includes("suprimentos") || titleLower.includes("reverse logistics"))) return "Logística";
  if (hasAuthor("cyreno") && yearNum === 2022) return "Logística";

  // Agricultura
  // Alvarez Carrillo et al., 2018; Rodríguez et al., 2023; Morais et al., 2022
  if (hasAuthor("alvarez") && yearNum === 2018) return "Agricultura";
  if ((hasAuthor("rodríguez") || hasAuthor("rodriguez")) && yearNum === 2023 && (titleLower.includes("laboratory") || titleLower.includes("laboratório") || titleLower.includes("agricultural"))) return "Agricultura";
  if (hasAuthor("morais") && yearNum === 2022 && (titleLower.includes("mango") || titleLower.includes("manga") || titleLower.includes("variety"))) return "Agricultura";

  // Recursos Humanos
  // da Silva et al., 2025; De Morais Correia et al., 2021; de Lacerda & Cardoso, 2023
  if (hasAuthor("silva") && yearNum === 2025 && (titleLower.includes("work") || titleLower.includes("trabalho") || titleLower.includes("remote") || titleLower.includes("call center"))) return "Recursos Humanos";
  if (hasAuthor("correia") && yearNum === 2021) return "Recursos Humanos";
  if (hasAuthor("lacerda") && hasAuthor("cardoso") && yearNum === 2023 && (titleLower.includes("ergonomic") || titleLower.includes("ergonomia") || titleLower.includes("workstations"))) return "Recursos Humanos";

  // Segurança Pública
  // da Cunha et al., 2024; de Lacerda & Cardoso, 2023
  if (hasAuthor("cunha") && yearNum === 2024) return "Segurança Pública";
  if (hasAuthor("lacerda") && hasAuthor("cardoso") && yearNum === 2023 && (titleLower.includes("armed") || titleLower.includes("forces") || titleLower.includes("military") || titleLower.includes("militar") || titleLower.includes("armed forces"))) return "Segurança Pública";

  // ESG
  // Pessoa et al., 2022; Vieira Dantas et al., 2023
  if (hasAuthor("pessoa") && yearNum === 2022) return "ESG";
  if (hasAuthor("dantas") && yearNum === 2023) return "ESG";

  // Turismo
  // Czekajski et al., 2023
  if (hasAuthor("czekajski") && yearNum === 2023) return "Turismo";

  // Transporte
  // Oliveira et al., 2023
  if (hasAuthor("oliveira") && yearNum === 2023 && (titleLower.includes("mobility") || titleLower.includes("urban") || titleLower.includes("transport") || titleLower.includes("transporte"))) return "Transporte";

  // --- 2. KEYWORDS MATCHING FOR 13 PREDEFINED SECTORS ---
  for (let [area, keywords] of Object.entries(DYNAMIC_CLUSTERS)) {
    for (let kw of keywords) {
      if (titleLower.includes(kw)) {
        return area;
      }
    }
  }

  // --- 3. THEORETICAL / METHODOLOGY DETECTION ---
  const isTheoretical = 
    titleLower.includes("neuroscience") || 
    titleLower.includes("neurociência") || 
    titleLower.includes("eeg") || 
    titleLower.includes("eye-tracking") || 
    titleLower.includes("eye tracking") || 
    titleLower.includes("cognitive") || 
    titleLower.includes("comportamental") || 
    titleLower.includes("behavioral") || 
    titleLower.includes("holistic") || 
    titleLower.includes("inconsistencies") || 
    titleLower.includes("inconsistências") || 
    titleLower.includes("partial information") || 
    titleLower.includes("informação parcial") || 
    titleLower.includes("elicitation") || 
    titleLower.includes("elicitação") || 
    titleLower.includes("decomposition") || 
    titleLower.includes("decomposição") || 
    titleLower.includes("tradeoff") || 
    titleLower.includes("trade-off") || 
    titleLower.includes("sorting") || 
    titleLower.includes("ranking") || 
    titleLower.includes("portfolio") || 
    titleLower.includes("group decision") || 
    titleLower.includes("decisão em grupo") || 
    titleLower.includes("negotiation") || 
    titleLower.includes("negociação") || 
    titleLower.includes("mcdm");

  if (isTheoretical) {
    return "Teoria & Neurociência";
  }

  // --- 4. UNSUPERVISED KEYWORD CLUSTERING (ECONOMY SECTOR ONLY) ---
  const words = titleLower
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 4 && !/\d/.test(w) && !METHODOLOGY_STOP_WORDS.has(w));
    
  if (words.length > 0) {
    const clusterWord = words[0];
    
    if (KEYWORD_SECTOR_MAP[clusterWord]) {
      return KEYWORD_SECTOR_MAP[clusterWord];
    }
    
    // Fallback: If it's a new noun that represents an application, we can capitalise it
    // But let's avoid dynamic clusters that are just verbs or adjectives
    const badDynamicWords = new Set(["based", "using", "multi", "criteria", "model", "study", "analysis", "system", "support", "applied", "application", "problem", "decision", "making", "framework"]);
    if (!badDynamicWords.has(clusterWord)) {
      const newClusterName = clusterWord.charAt(0).toUpperCase() + clusterWord.slice(1);
      // Verify that the generated sector name is not methodological
      const methodCheck = newClusterName.toLowerCase();
      if (!methodCheck.includes("tradeoff") && !methodCheck.includes("holistic") && !methodCheck.includes("mcdm")) {
        DYNAMIC_CLUSTERS[methodCheck] = [clusterWord]; // Store in lower case for search
        console.log(`[Dynamic Clustering] Novo setor da economia: "${newClusterName}" (Chave: "${clusterWord}")`);
        return newClusterName;
      }
    }
  }

  return "Teoria & Neurociência";
}

// Server-side regex-based HTML parsing for Node.js when DOMParser is undefined
function parseHTMLWithoutDOMParser(html) {
  const items = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match;
  while ((match = liRegex.exec(html)) !== null) {
    const liContent = match[1];
    
    // Extract link in href attribute
    const hrefMatch = liContent.match(/href="([^"]+)"/i);
    const link = hrefMatch ? hrefMatch[1] : "";
    
    // Clean tags and entities
    let text = liContent
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .replace(/&#8217;/g, "'")
      .replace(/&#8211;/g, "-")
      .replace(/\s+/g, " ")
      .trim();
      
    if (text) {
      items.push({ text, link });
    }
  }
  return items;
}

// Parse references from raw pasted text/HTML (Tolerant & High-Fidelity)
function parseReferences(rawInput) {
  const parsedArticles = [];
  const failedArticles = [];
  const titlesSeen = new Set();

  if (!rawInput) return { parsedArticles, failedArticles };

  let lines = [];
  if (rawInput.includes("<html") || rawInput.includes("<li") || rawInput.includes("<a href")) {
    if (typeof DOMParser !== 'undefined') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawInput, "text/html");
      const listItems = doc.querySelectorAll("li, p, div");
      listItems.forEach(item => {
        let text = item.textContent.trim();
        let linkEl = item.querySelector("a");
        let link = linkEl ? linkEl.getAttribute("href") : "";
        if (text) {
          lines.push({ text, link });
        }
      });
    } else {
      lines = parseHTMLWithoutDOMParser(rawInput);
    }
    
    if (lines.length === 0) {
      lines = rawInput.split("\n").map(l => ({ text: l.trim(), link: "" }));
    }
  } else {
    lines = rawInput.split("\n").map(l => ({ text: l.trim(), link: "" }));
  }

  for (let lineObj of lines) {
    let rawLine = lineObj.text;
    let link = lineObj.link;
    
    if (!rawLine) continue;

    // Filter structural menu tags and titles
    if (/^(journals|technological products|books and book chapters|conference communications|other conference communications|behavioral studies|applications|about the method|1\.|2\.|3\.)/i.test(rawLine) && rawLine.length < 50) {
      continue;
    }
    
    if (rawLine.includes("Last updated on") || rawLine.includes("GeneratePress") || rawLine.includes("title suggestion for inclusion")) {
      continue;
    }

    try {
      let citationText = rawLine;

      const mdLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/;
      const mdMatch = rawLine.match(mdLinkRegex);
      if (mdMatch) {
        citationText = mdMatch[1].trim();
        link = mdMatch[2].trim();
      } else {
        const urlRegex = /(https?:\/\/[^\s]+)$/;
        const urlMatch = citationText.match(urlRegex);
        if (urlMatch) {
          link = urlMatch[1].trim();
          citationText = citationText.replace(urlRegex, "").trim();
        }
      }

      citationText = citationText
        .replace(/^[\-\*\s]+/, "")
        .replace(/^\d+\.\s*/, "")
        .replace(/^https?:\/\/\S+\s*/, "")
        .trim();

      if (citationText.length < 15) continue;

      let year = null;
      const yearMatches = citationText.match(/\b(20\d{2}|19\d{2})\b/g);
      
      if (yearMatches) {
        const parenYearMatch = citationText.match(/\((20\d{2}|19\d{2})(?:,\s*[^)]+)?\)/);
        if (parenYearMatch) {
          year = parseInt(parenYearMatch[1]);
        } else {
          year = parseInt(yearMatches[0]);
        }
      }

      // --- STRATEGY 1: Conference Session links (e.g. Special Session on SBPO) ---
      if (citationText.toLowerCase().includes("special session of fitradeoff") || citationText.toLowerCase().includes("special session on sbpo")) {
        const extractedYear = year || 2024;
        parsedArticles.push({
          rawText: rawLine,
          authors: ["FITradeoff Event"],
          authorsRaw: "FITradeoff Event",
          year: extractedYear,
          title: citationText.replace(/\.$/, "").trim(),
          journal: "SBPO (Comunicação em Evento)",
          details: "Sessão Especial de Conferência",
          link: link || "",
          variant: "Aplicação Geral/Extensão",
          decisionContext: "Decisão Individual",
          economyArea: "Setor Público & Defesa",
          country: "Brazil",
          authorOrcids: {}
        });
        continue;
      }

      // Check year requirement after session parser
      if (!year) {
        throw new Error("Ano de publicação não encontrado na citação.");
      }

      // --- STRATEGY 2: Software / Technological Products ---
      if (citationText.toLowerCase().includes("computer program") || citationText.toLowerCase().includes("registro: inpi") || citationText.toLowerCase().includes("inpi")) {
        let authorsRaw = "";
        let title = "";
        let details = "Registro INPI";
        
        const compIndex = citationText.toLowerCase().indexOf("computer program");
        let preComp = compIndex !== -1 ? citationText.substring(0, compIndex).trim() : citationText;
        
        // Split by the year to separate authors and title
        const yearIndex = preComp.indexOf(`${year}`);
        if (yearIndex !== -1) {
          authorsRaw = preComp.substring(0, yearIndex).trim();
          title = preComp.substring(yearIndex).replace(/^\d{4}\.?\s*/, "").replace(/[,\.\s]+$/, "").trim();
        } else if (preComp.includes(";")) {
          const lastSemi = preComp.lastIndexOf(";");
          authorsRaw = preComp.substring(0, lastSemi).trim();
          title = preComp.substring(lastSemi + 1).trim();
        } else {
          title = preComp;
          authorsRaw = "Almeida, A. T.";
        }

        // Clean names
        authorsRaw = authorsRaw.replace(/^[,\.\s]+|[,\.\s]+$/g, "").trim();
        const authors = splitAuthorsBlock(authorsRaw);
        
        if (compIndex !== -1) {
          details = citationText.substring(compIndex).trim();
        }

        parsedArticles.push({
          rawText: rawLine,
          authors: authors.length > 0 ? authors : ["Almeida, A. T."],
          authorsRaw: authorsRaw || "Almeida, A. T.",
          year,
          title: title.replace(/^["“”'‘]|["¼“”'’]$/g, "").trim(),
          journal: "Software (Registro INPI)",
          details,
          link: link || "",
          variant: title.toLowerCase().includes("ranking") ? "Ranking Problematic" : "Choice Problematic",
          decisionContext: "Decisão Individual",
          economyArea: "Tecnologia da Informação & Software",
          country: "Brazil",
          authorOrcids: {}
        });
        continue;
      }

      // --- STRATEGY 3: Book Chapters (In: / In ) ---
      let authorsRaw = "";
      let rest = "";
      
      const yearParenIndex = citationText.indexOf(`(${year}`);
      if (yearParenIndex > 10 && yearParenIndex < citationText.length - 20) {
        authorsRaw = citationText.substring(0, yearParenIndex).trim();
        rest = citationText.substring(yearParenIndex).replace(/^\([^)]+\)\.?\s*/, "").trim();
      } else {
        const yearBareIndex = citationText.indexOf(`${year}`);
        if (yearBareIndex > 10 && yearBareIndex < citationText.length - 20) {
          authorsRaw = citationText.substring(0, yearBareIndex).trim();
          rest = citationText.substring(yearBareIndex).replace(/^\d{4}\.?\s*/, "").trim();
        } else {
          // Fallback if year at the end
          if (citationText.includes("et al.")) {
            const etAlIndex = citationText.indexOf("et al.");
            authorsRaw = citationText.substring(0, etAlIndex + 6).trim();
            rest = citationText.substring(etAlIndex + 6).trim();
          } else if (citationText.includes(";")) {
            const lastSemi = citationText.lastIndexOf(";");
            const afterSemi = citationText.substring(lastSemi);
            const firstDot = afterSemi.indexOf(".");
            if (firstDot !== -1) {
              authorsRaw = citationText.substring(0, lastSemi + firstDot).trim();
              rest = citationText.substring(lastSemi + firstDot + 1).trim();
            } else {
              authorsRaw = citationText.substring(0, lastSemi).trim();
              rest = citationText.substring(lastSemi + 1).trim();
            }
          } else {
            const match = citationText.match(/^((?:[A-Za-z\s'-]+,\s*[A-Z\s.-]+\.?(?:\s*&\s*|\s*,\s*|;|\s+and\s+)?)+)(.*?)$/);
            if (match) {
              authorsRaw = match[1].trim();
              rest = match[2].trim();
            } else {
              throw new Error("Não foi possível separar os autores do título deterministicamente.");
            }
          }
        }
      }

      authorsRaw = authorsRaw.replace(/^[,\.\s]+|[,\.\s]+$/g, "").trim();
      const authors = splitAuthorsBlock(authorsRaw);
      if (authors.length === 0) {
        throw new Error("Nenhum autor válido pôde ser extraído.");
      }

      let title = "";
      let journal = "Não Especificado";
      let details = "";

      // Check if it's a Book Chapter containing "In: " or "In "
      const inMatch = rest.match(/\bIn\b:?\s+(.+)$/i);
      if (inMatch) {
        title = rest.substring(0, inMatch.index).replace(/[,\.\s“”"”]+$/, "").replace(/^[,\.\s“”"”]+/, "").trim();
        const bookDetails = inMatch[1].trim();
        const firstDot = bookDetails.indexOf(". ");
        if (firstDot !== -1) {
          journal = bookDetails.substring(0, firstDot).trim();
          details = bookDetails.substring(firstDot + 2).trim();
        } else {
          journal = bookDetails.replace(/\.$/, "").trim();
        }
      } else {
        // Standard Journal match
        let journalMatched = false;
        for (let jName of KNOWN_JOURNALS) {
          const jIndex = rest.toLowerCase().indexOf(jName.toLowerCase());
          if (jIndex !== -1) {
            title = rest.substring(0, jIndex).replace(/[,\.\s“”"”]+$/, "").replace(/^[,\.\s“”"”]+/, "").trim();
            journal = jName;
            details = rest.substring(jIndex + jName.length).replace(/^[,\.\s]+/, "").trim();
            journalMatched = true;
            break;
          }
        }

        if (!journalMatched) {
          const dotIndex = rest.indexOf(". ");
          if (dotIndex !== -1) {
            title = rest.substring(0, dotIndex).replace(/^[,\.\s“”"”]+|[,\.\s“”"”]+$/g, "").trim();
            let journalPart = rest.substring(dotIndex + 2).trim();
            const commaIndex = journalPart.indexOf(",");
            if (commaIndex !== -1) {
              journal = journalPart.substring(0, commaIndex).trim();
              details = journalPart.substring(commaIndex + 1).trim();
            } else {
              journal = journalPart.replace(/\.$/, "").trim();
            }
          } else {
            throw new Error("Periódico/Revista não identificado na citação.");
          }
        }
      }

      title = title.replace(/^["“”'‘]|["“”'’]$/g, "").trim();
      if (!title) {
        throw new Error("Título do artigo está vazio.");
      }

      // Deduplication check
      const dedupKey = title.toLowerCase().substring(0, 30);
      if (titlesSeen.has(dedupKey)) {
        continue;
      }
      titlesSeen.add(dedupKey);

      // Metodological Variant Mapping
      let variant = "Aplicação Geral/Extensão";
      const authorsStr = authors.join(" ");
      const titleLower = title.toLowerCase();

      const isSeminalChoice = 
        (authorsStr.includes("Almeida") && year === 2016 && (titleLower.includes("weight") || titleLower.includes("elicitation") || titleLower.includes("additive"))) ||
        (authorsStr.includes("Almeida") && authorsStr.includes("Frej") && authorsStr.includes("Roselli") && year === 2021 && (titleLower.includes("holistic") || titleLower.includes("flexibility")));
      const isSeminalRanking = 
        (authorsStr.includes("Frej") && authorsStr.includes("Almeida") && authorsStr.includes("Costa") && year === 2019 && (titleLower.includes("ranking") || titleLower.includes("visualization"))) ||
        (authorsStr.includes("Almeida") && authorsStr.includes("Frej") && authorsStr.includes("Roselli") && year === 2021 && (titleLower.includes("holistic") || titleLower.includes("flexibility")));
      const isSeminalSorting = 
        (authorsStr.includes("Kang") && authorsStr.includes("Frej") && authorsStr.includes("Almeida") && year === 2020 && titleLower.includes("sorting"));
      const isSeminalPortfolio = 
        (authorsStr.includes("Frej") && authorsStr.includes("Ekel") && authorsStr.includes("Almeida") && year === 2021 && (titleLower.includes("portfolio") || titleLower.includes("benefit-to-cost"))) ||
        (authorsStr.includes("Marques") && authorsStr.includes("Frej") && authorsStr.includes("Almeida") && year === 2022 && titleLower.includes("portfolio"));
      const isSeminalNegotiation = 
        (authorsStr.includes("Frej") && authorsStr.includes("Morais") && authorsStr.includes("Almeida") && (year === 2021 || year === 2022) && (titleLower.includes("negotiation") || titleLower.includes("dominance")));
      const isSeminalGroup = 
        (authorsStr.includes("Almeida") && authorsStr.includes("Frej") && year === 2025 && (titleLower.includes("group") || titleLower.includes("gdss") || titleLower.includes("group decision-making")));

      if (isSeminalChoice && isSeminalRanking) {
        variant = "Choice / Ranking";
      } else if (isSeminalChoice) {
        variant = "Choice Problematic";
      } else if (isSeminalRanking) {
        variant = "Ranking Problematic";
      } else if (isSeminalSorting) {
        variant = "Sorting Problematic";
      } else if (isSeminalPortfolio) {
        variant = "Portfolio Problematic";
      } else if (isSeminalNegotiation) {
        variant = "Negotiation";
      } else if (isSeminalGroup) {
        variant = "Group Decision";
      } else {
        if (titleLower.includes("sorting")) {
          variant = "Sorting Problematic";
        } else if (titleLower.includes("ranking")) {
          variant = "Ranking Problematic";
        } else if (titleLower.includes("portfolio")) {
          variant = "Portfolio Problematic";
        } else if (titleLower.includes("group decision") || titleLower.includes("gdss") || titleLower.includes("group decision-making") || titleLower.includes("stakeholders")) {
          variant = "Group Decision";
        } else if (titleLower.includes("negotiation")) {
          variant = "Negotiation";
        } else if (titleLower.includes("choice")) {
          variant = "Choice Problematic";
        }
      }

      let decisionContext = "Decisão Individual";
      if (variant === "Negotiation" || titleLower.includes("negotiation") || titleLower.includes("negotiators")) {
        decisionContext = "Negociação";
      } else if (variant === "Group Decision" || titleLower.includes("group") || titleLower.includes("gdss") || titleLower.includes("stakeholders") || titleLower.includes("collective")) {
        decisionContext = "Decisão em Grupo / GDSS";
      }

      // Dynamic Economy Area Classification
      const economyArea = classifyEconomyArea(title, authors, year);

      // Country detection
      let country = "Não Especificado";
      const titleAndDetails = (title + " " + details).toLowerCase();
      if (titleAndDetails.includes("brazil") || titleAndDetails.includes("brasileiro") || titleAndDetails.includes("brazilian") || 
          titleAndDetails.includes("pernambuco") || titleAndDetails.includes("recife") || titleAndDetails.includes("natal") || 
          titleAndDetails.includes("ceará") || titleAndDetails.includes("paraíba") || titleAndDetails.includes("rio grande do norte") || 
          titleAndDetails.includes("são paulo") || titleAndDetails.includes("paraná") || titleAndDetails.includes("belo horizonte") ||
          titleAndDetails.includes("northeast of brazil")) {
        country = "Brazil";
      } else if (titleAndDetails.includes("colombia") || titleAndDetails.includes("colombian")) {
        country = "Colombia";
      } else if (titleAndDetails.includes("poland") || titleAndDetails.includes("polish") || titleAndDetails.includes("czeladź")) {
        country = "Poland";
      } else if (titleAndDetails.includes("italy") || titleAndDetails.includes("italian") || titleAndDetails.includes("milan")) {
        country = "Italy";
      } else if (titleAndDetails.includes("india") || titleAndDetails.includes("indian") || titleAndDetails.includes("delhi") || titleAndDetails.includes("dubey")) {
        country = "India";
      } else if (titleAndDetails.includes("argentina")) {
        country = "Argentina";
      } else if (titleAndDetails.includes("china") || titleAndDetails.includes("chinese")) {
        country = "China";
      } else if (titleAndDetails.includes("japan") || titleAndDetails.includes("japanese")) {
        country = "Japan";
      }

      parsedArticles.push({
        rawText: rawLine,
        authors,
        authorsRaw,
        year,
        title,
        journal,
        details,
        link,
        variant,
        decisionContext,
        economyArea,
        country,
        authorOrcids: {}
      });

    } catch (err) {
      failedArticles.push({
        rawText: rawLine,
        error: err.message
      });
    }
  }

  return { parsedArticles, failedArticles };
}

// OpenAlex JSON Work Object Parser
function parseOpenAlexWork(work) {
  if (!work || !work.title) return null;

  try {
    const title = work.title.replace(/^["“”'‘]|["“”'’]$/g, "").trim();
    const year = work.publication_year;
    const link = work.doi || (work.primary_location ? work.primary_location.landing_page_url : "") || "";

    const journal = (work.primary_location && work.primary_location.source && work.primary_location.source.display_name)
      ? work.primary_location.source.display_name
      : "Não Especificado";

    let vol = work.biblio ? work.biblio.volume : null;
    let iss = work.biblio ? work.biblio.issue : null;
    let firstPage = work.biblio ? work.biblio.first_page : null;
    let lastPage = work.biblio ? work.biblio.last_page : null;
    let pages = firstPage ? (firstPage + (lastPage ? "-" + lastPage : "")) : null;
    const details = [vol ? "v. " + vol : null, iss ? "n. " + iss : null, pages ? "p. " + pages : null].filter(x => x).join(", ");

    const authors = [];
    const authorOrcids = {};
    const rawAuthorsArr = [];

    if (work.authorships && Array.isArray(work.authorships)) {
      work.authorships.forEach(aship => {
        const name = aship.author.display_name;
        if (!name) return;

        const stdName = normalizeAuthorName(name);
        authors.push(stdName);
        rawAuthorsArr.push(name);
        
        if (aship.author.orcid) {
          authorOrcids[stdName] = aship.author.orcid;
        }
      });
    }

    if (authors.length === 0) return null;
    const authorsRaw = rawAuthorsArr.join("; ");

    let variant = "Aplicação Geral/Extensão";
    const authorsStr = authors.join(" ");
    const titleLower = title.toLowerCase();

    const isSeminalChoice = 
      (authorsStr.includes("Almeida") && year === 2016 && (titleLower.includes("weight") || titleLower.includes("elicitation") || titleLower.includes("additive"))) ||
      (authorsStr.includes("Almeida") && authorsStr.includes("Frej") && authorsStr.includes("Roselli") && year === 2021 && (titleLower.includes("holistic") || titleLower.includes("flexibility")));
    const isSeminalRanking = 
      (authorsStr.includes("Frej") && authorsStr.includes("Almeida") && authorsStr.includes("Costa") && year === 2019 && (titleLower.includes("ranking") || titleLower.includes("visualization"))) ||
      (authorsStr.includes("Almeida") && authorsStr.includes("Frej") && authorsStr.includes("Roselli") && year === 2021 && (titleLower.includes("holistic") || titleLower.includes("flexibility")));
    const isSeminalSorting = 
      (authorsStr.includes("Kang") && authorsStr.includes("Frej") && authorsStr.includes("Almeida") && year === 2020 && titleLower.includes("sorting"));
    const isSeminalPortfolio = 
      (authorsStr.includes("Frej") && authorsStr.includes("Ekel") && authorsStr.includes("Almeida") && year === 2021 && (titleLower.includes("portfolio") || titleLower.includes("benefit-to-cost"))) ||
      (authorsStr.includes("Marques") && authorsStr.includes("Frej") && authorsStr.includes("Almeida") && year === 2022 && titleLower.includes("portfolio"));
    const isSeminalNegotiation = 
      (authorsStr.includes("Frej") && authorsStr.includes("Morais") && authorsStr.includes("Almeida") && (year === 2021 || year === 2022) && (titleLower.includes("negotiation") || titleLower.includes("dominance")));
    const isSeminalGroup = 
      (authorsStr.includes("Almeida") && authorsStr.includes("Frej") && year === 2025 && (titleLower.includes("group") || titleLower.includes("gdss") || titleLower.includes("group decision-making")));

    if (isSeminalChoice && isSeminalRanking) {
      variant = "Choice / Ranking";
    } else if (isSeminalChoice) {
      variant = "Choice Problematic";
    } else if (isSeminalRanking) {
      variant = "Ranking Problematic";
    } else if (isSeminalSorting) {
      variant = "Sorting Problematic";
    } else if (isSeminalPortfolio) {
      variant = "Portfolio Problematic";
    } else if (isSeminalNegotiation) {
      variant = "Negotiation";
    } else if (isSeminalGroup) {
      variant = "Group Decision";
    } else {
      if (titleLower.includes("sorting")) {
        variant = "Sorting Problematic";
      } else if (titleLower.includes("ranking")) {
        variant = "Ranking Problematic";
      } else if (titleLower.includes("portfolio")) {
        variant = "Portfolio Problematic";
      } else if (titleLower.includes("group decision") || titleLower.includes("gdss") || titleLower.includes("group decision-making") || titleLower.includes("stakeholders")) {
        variant = "Group Decision";
      } else if (titleLower.includes("negotiation")) {
        variant = "Negotiation";
      } else if (titleLower.includes("choice")) {
        variant = "Choice Problematic";
      }
    }

    let decisionContext = "Decisão Individual";
    if (variant === "Negotiation" || titleLower.includes("negotiation") || titleLower.includes("negotiators")) {
      decisionContext = "Negociação";
    } else if (variant === "Group Decision" || titleLower.includes("group") || titleLower.includes("gdss") || titleLower.includes("stakeholders") || titleLower.includes("collective")) {
      decisionContext = "Decisão em Grupo / GDSS";
    }

    // Dynamic Economy Area Classifier
    const economyArea = classifyEconomyArea(title, authors, year);

    let country = "Não Especificado";
    const titleAndDetails = (title + " " + details).toLowerCase();
    if (titleAndDetails.includes("brazil") || titleAndDetails.includes("brasileiro") || titleAndDetails.includes("brazilian") || 
        titleAndDetails.includes("pernambuco") || titleAndDetails.includes("recife") || titleAndDetails.includes("natal") || 
        titleAndDetails.includes("ceará") || titleAndDetails.includes("paraíba") || titleAndDetails.includes("rio grande do norte") || 
        titleAndDetails.includes("são paulo") || titleAndDetails.includes("paraná") || titleAndDetails.includes("belo horizonte") ||
        titleAndDetails.includes("northeast of brazil")) {
      country = "Brazil";
    } else if (titleAndDetails.includes("colombia") || titleAndDetails.includes("colombian")) {
      country = "Colombia";
    } else if (titleAndDetails.includes("poland") || titleAndDetails.includes("polish") || titleAndDetails.includes("czeladź")) {
      country = "Poland";
    } else if (titleAndDetails.includes("italy") || titleAndDetails.includes("italian") || titleAndDetails.includes("milan")) {
      country = "Italy";
    } else if (titleAndDetails.includes("india") || titleAndDetails.includes("indian") || titleAndDetails.includes("delhi") || titleAndDetails.includes("dubey")) {
      country = "India";
    } else if (titleAndDetails.includes("argentina")) {
      country = "Argentina";
    } else if (titleAndDetails.includes("china") || titleAndDetails.includes("chinese")) {
      country = "China";
    } else if (titleAndDetails.includes("japan") || titleAndDetails.includes("japanese")) {
      country = "Japan";
    }

    return {
      rawText: "OpenAlex ID: " + work.id,
      authors,
      authorsRaw,
      year,
      title,
      journal,
      details,
      link,
      variant,
      decisionContext,
      economyArea,
      country,
      authorOrcids
    };

  } catch (err) {
    console.error('Error parsing OpenAlex work:', err);
    return null;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseReferences,
    parseOpenAlexWork,
    normalizeAuthorName,
    splitAuthorsBlock,
    classifyEconomyArea,
    KNOWN_JOURNALS,
    DYNAMIC_CLUSTERS
  };
}
