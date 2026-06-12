// Front-end SPA Controller - MCDM/MCDA Learning Roadmap (Expanded Video Lecture Version)
// Handles bilingual translations, theme switching, interactive roadmap nodes, author profiles, timeline, video classes, and OpenAlex data sync

// ==================== 1. ROADMAP CONTENT DATA ====================
const ROADMAP_NODES = [
  // LEVEL 1: FOUNDATIONS (Básico)
  {
    id: "mcdm-intro",
    level: 1,
    category: "Foundations",
    title: {
      pt: "1.1 Introdução ao MCDM/MCDA",
      en: "1.1 Introduction to MCDM/MCDA"
    },
    desc: {
      pt: "Compreensão dos conceitos fundamentais de Tomada de Decisão Multicritério (MCDM) e Apoio Multicritério à Decisão (MCDA). Diferença entre a escola americana (foco em otimização e utilidade) e a escola europeia (sobreclassificação e apoio).",
      en: "Understanding the fundamental concepts of Multicriteria Decision Making (MCDM) and Multicriteria Decision Aiding (MCDA). Differences between the American school (optimization & utility) and the European school (outranking & decision support)."
    },
    equation: "MCDA Goals: Choice (P.alpha), Ranking (P.beta), Sorting (P.gamma), Portfolio (P.delta)",
    authors: "Bernard Roy, Ralph Keeney, Howard Raiffa, Valerie Belton",
    video: "https://www.youtube.com/embed/U3l0rV7gK0I",
    readings: [
      { name: "Roy, B. (1996). Multicriteria Methodology for Decision Aiding.", link: "https://doi.org/10.1007/978-1-4757-2500-1" },
      { name: "Belton, V., & Stewart, T. (2002). Multiple Criteria Decision Analysis: An Integrated Approach.", link: "https://doi.org/10.1007/978-1-4615-1495-4" }
    ]
  },
  {
    id: "decision-problematics",
    level: 1,
    category: "Foundations",
    title: {
      pt: "1.2 Problemáticas de Decisão",
      en: "1.2 Decision Problematics"
    },
    desc: {
      pt: "Formulação do problema com base nas quatro problemáticas principais: Seleção/Escolha (Choice), Ordenação/Ranking (Ranking), Classificação (Sorting), e Portfólio (Subset selection sob restrições).",
      en: "Problem formulation based on the four primary problematics: Selection (Choice), Ordering (Ranking), Categorization (Sorting), and Portfolio selection under resource constraints."
    },
    equation: "P.alpha (Choice) -> P.beta (Ranking) -> P.gamma (Sorting) -> P.delta (Portfolio)",
    authors: "Bernard Roy, Adiel Teixeira de Almeida",
    readings: [
      { name: "Roy, B. (1985). Méthodologie Multicritère d'Aide à la Décision.", link: "#" },
      { name: "de Almeida et al. (2015). Multicriteria Decison Making with FITradeoff.", link: "https://doi.org/10.1007/978-3-319-11277-0" }
    ]
  },
  {
    id: "elicitation-concepts",
    level: 1,
    category: "Foundations",
    title: {
      pt: "1.3 O Processo de Elicitação",
      en: "1.3 The Elicitation Process"
    },
    desc: {
      pt: "Compreensão de como extrair as preferências subjetivas e constantes de escala (pesos) do Decisor (DM). Estudo sobre carga cognitiva, consistência e vieses psicológicos durante o processo de entrevistas.",
      en: "Understanding how to elicit subjective preferences and scaling constants (weights) from the Decision Maker (DM). Study of cognitive workload, consistency, and psychological biases during interviews."
    },
    equation: "DM Preferences -> Elicitation protocol -> Weight/Parameter Vector (w)",
    authors: "Ralph Keeney, Adiel Teixeira de Almeida, Ward Edwards",
    readings: [
      { name: "Keeney, R. L. (1996). Value-Focused Thinking: A Path to Creative Decisionmaking.", link: "#" }
    ]
  },
  {
    id: "method-maut",
    level: 1,
    category: "Foundations",
    title: {
      pt: "1.4 MAUT & Método UTA",
      en: "1.4 MAUT & UTA Method"
    },
    desc: {
      pt: "Teoria da Utilidade Multiatributo (MAUT) e método UTA (UTilité Additive). Elicitação axiomática que incorpora risco (curvas de utilidade côncavas ou convexas). O método UTA utiliza programação linear para estimar funções de utilidade aditiva a partir de ordenações de referência.",
      en: "Multi-Attribute Utility Theory (MAUT) & UTA (UTilité Additive) method. Axiomatic elicitation incorporating risk preferences (concave or convex utility curves). UTA utilizes linear programming to estimate additive utility functions from reference rankings."
    },
    equation: "MAUT: U(x) = Sum(w_i * u_i(x_i)) or Multiplicative: 1 + k*U(x) = Product(1 + k * w_i * u_i(x_i))",
    authors: "Ralph Keeney, Howard Raiffa, E. Jacquet-Lagreze, Yannis Siskos",
    readings: [
      { name: "Keeney, R. L., & Raiffa, H. (1976). Decisions with Multiple Objectives.", link: "#" },
      { name: "Jacquet-Lagreze, E., & Siskos, J. (1982). Assessing a set of additive utility functions for multicriteria decision-making (UTA method).", link: "https://doi.org/10.1016/0377-2217(82)90155-2" }
    ]
  },
  {
    id: "method-vft",
    level: 1,
    category: "Foundations",
    title: {
      pt: "1.5 VFT (Value-Focused Thinking)",
      en: "1.5 VFT (Value-Focused Thinking)"
    },
    desc: {
      pt: "Pensamento Focado em Valores. Abordagem criada por Ralph Keeney que defende que os objetivos e valores devem ser definidos antes de se identificarem as alternativas de decisão. Estimula a criatividade e a criação de alternativas customizadas.",
      en: "Value-Focused Thinking. Paradigm proposed by Ralph Keeney advocating that values and objectives should be defined before identifying alternatives, encouraging creativity and the creation of custom-tailored alternatives."
    },
    equation: "Decision Context -> Fundamental Objectives Hierarchy -> Alternatives Creation",
    authors: "Ralph Keeney",
    readings: [
      { name: "Keeney, R. L. (1992). Value-Focused Thinking: A Path to Creative Decisionmaking.", link: "#" }
    ]
  },

  // LEVEL 2: CORE METHODS (Intermediário)
  {
    id: "pref-vs-data-driven",
    level: 2,
    category: "Paradigms",
    title: {
      pt: "2.1 Decisão por Preferência vs Dados (Data-Driven)",
      en: "2.1 Preference-Driven vs Data-Driven MCDA"
    },
    desc: {
      pt: "Exploração da dicotomia e sinergia entre decisões baseadas em preferências humanas (Preference-Driven) e em análise de dados (Data-Driven).\n\nCampos de Estudo:\n1. Ponderação Objetiva: Extração de pesos a partir da variação matemática dos dados (Entropia, CRITIC, MEREC, LOPCOW).\n2. Eficiência de Fronteira: Medição de eficiência relativa de unidades sem pesos subjetivos pré-definidos (DEA).\n3. Aprendizado de Preferências: Indução de modelos de decisão a partir de dados históricos usando Machine Learning (SVM-Rank, DRSA).\n4. IA Explicável (XAI em MCDA): Métodos de interpretabilidade e transparência em rankings sugeridos por algoritmos complexos (SHAP, LIME).\n5. Sistemas Fuzzy Híbridos: Tomada de decisão em grandes matrizes sob imprecisão matemática e incerteza.\n\nAutores Principais: William W. Cooper, Abraham Charnes, Roman Slowinski, Salvatore Greco, Jafar Rezaei, Muhammet Deveci, Dragan Pamučar.\n\nSociedades Científicas: IEEE Computational Intelligence Society (IEEE CIS), International Rough Set Society (IRSS), INFORMS Section on Data Mining.",
      en: "Exploration of the dichotomy and synergy between decisions based on human preferences (Preference-Driven) and statistical data analysis (Data-Driven).\n\nKey Study Fields:\n1. Objective Weighting: Deriving criteria weights from statistical properties of data (Entropy, CRITIC, MEREC, LOPCOW).\n2. Frontier Efficiency: Measuring relative performance of units using mathematical programming (DEA) without pre-defined weights.\n3. Preference Learning: Inducing decision models from historical logs using Machine Learning algorithms (SVM-Rank, DRSA).\n4. Explainable AI (XAI in MCDA): Enhancing auditability and transparency of black-box ranking algorithms (SHAP, LIME).\n5. Hybrid Fuzzy Systems: Combining big data decisions with advanced fuzzy sets under high uncertainty.\n\nProminent Authors: William W. Cooper, Abraham Charnes, Roman Slowinski, Salvatore Greco, Jafar Rezaei, Muhammet Deveci, Dragan Pamučar.\n\nScientific Societies: IEEE Computational Intelligence Society (IEEE CIS), International Rough Set Society (IRSS), INFORMS Section on Data Mining."
    },
    equation: "Data-Driven Paradigms: Statistical Properties (Variance, Correlation, Entropy) OR Machine Learning Optimization (Loss Minimization on Preference Data)",
    authors: "William W. Cooper, Abraham Charnes, Roman Slowinski, Salvatore Greco, Jafar Rezaei, Dragan Pamučar",
    readings: [
      { name: "Charnes et al. (1978). Measuring the efficiency of decision making units. EJOR.", link: "https://doi.org/10.1016/0377-2217(78)90138-8" },
      { name: "Fürnkranz & Hüllermeier (2010). Preference Learning. Springer.", link: "https://doi.org/10.1007/978-3-642-14125-6" },
      { name: "Slowinski et al. (2024). Explainable AI and Multicriteria Decision Support. JMCDA.", link: "#" },
      { name: "Diakoulaki et al. (1995). Determining objective weights in multiple criteria problems. Computers & OR.", link: "https://doi.org/10.1016/0305-0548(94)E0017-X" }
    ]
  },
  // SUBGROUP: Complete Information Methods (Utility & Attribute Value)
  {
    id: "method-tradeoff",
    level: 2,
    category: "Complete Info Methods",
    title: {
      pt: "2.2.1 Método Tradeoff Clássico",
      en: "2.2.1 Classical Tradeoff Method"
    },
    desc: {
      pt: "Baseado na Teoria da Utilidade Multiatributo (MAUT). Encontra pontos de indiferença exatos entre consequências para calcular as constantes de escala. Elevada carga cognitiva para o decisor devido à necessidade de ajuste fino de valores indiferentes.",
      en: "Based on Multi-Attribute Utility Theory (MAUT). Solves for exact indifference points between consequences to calculate scaling constants. High cognitive load on the decision maker due to precise adjustments."
    },
    equation: "Indifference: (x_i_best, x_j_worst) ~ (x_i_value, x_j_best) => w_i = w_j * u_j(x_j_best)",
    authors: "Ralph Keeney, Howard Raiffa",
    readings: [
      { name: "Keeney, R. L., & Raiffa, H. (1976). Decisions with Multiple Objectives: Preferences and Value Trade-Offs.", link: "#" }
    ]
  },
  {
    id: "method-swing",
    level: 2,
    category: "Complete Info Methods",
    title: {
      pt: "2.2.2 Método Swing Weighting",
      en: "2.2.2 Swing Weighting Method"
    },
    desc: {
      pt: "Método de elicitação direta onde o decisor compara um estado hipotético pior (todas as alternativas no pior nível) e avalia o ganho ('swing') ao elevar cada critério, um por vez, ao seu melhor nível, ordenando e pontuando de 0 a 100.",
      en: "Direct elicitation method where the decision maker compares a hypothetical worst-case state (all criteria at worst levels) and scores the value gain ('swing') of turning each criterion to its best level from 0 to 100."
    },
    equation: "Weight calculation: w_i = Score_i / Sum(Score_j)",
    authors: "Ward Edwards, Valerie Belton",
    readings: [
      { name: "Von Winterfeldt, D., & Edwards, W. (1986). Decision Analysis and Behavioral Research.", link: "#" }
    ]
  },
  {
    id: "method-ratio",
    level: 2,
    category: "Complete Info Methods",
    title: {
      pt: "2.2.3 Método Ratio (Elicitação por Razão)",
      en: "2.2.3 Ratio Weighting Methods"
    },
    desc: {
      pt: "Abordagem baseada na estimativa direta de razões de importância entre critérios (ex: 'Critério A é 2.5 vezes mais importante que o Critério B'). Utilizado de forma preliminar em frameworks heurísticos.",
      en: "Approaches based on direct estimation of importance ratios between criteria (e.g., 'Criterion A is 2.5 times more important than Criterion B'). Often used in early heuristic frameworks."
    },
    equation: "Ratio: w_i / w_j = r_ij",
    authors: "Ward Edwards, Thomas Saaty",
    readings: [
      { name: "Edwards, W. (1977). How to use multiattribute utility measurement for social decision making.", link: "#" }
    ]
  },
  {
    id: "method-ahp",
    level: 2,
    category: "Complete Info Methods",
    title: {
      pt: "2.2.4 AHP (Analytic Hierarchy Process)",
      en: "2.2.4 AHP (Analytic Hierarchy Process)"
    },
    desc: {
      pt: "Estrutura o problema em uma hierarquia e realiza comparações par a par usando a escala de Saaty (1 a 9). Calcula os pesos usando o autovetor principal da matriz de julgamentos. Avalia a consistência do decisor através do Índice de Consistência (CI).",
      en: "Structures the problem hierarchically and performs pairwise comparisons using Saaty's 1-to-9 scale. Calculates weights using the principal eigenvector of the comparison matrix. Evaluates inconsistency using the Consistency Ratio (CR)."
    },
    equation: "A * w = lambda_max * w | CR = CI / RI < 0.10",
    authors: "Thomas L. Saaty",
    video: "https://www.youtube.com/embed/Jt1a7S3L8qg",
    readings: [
      { name: "Saaty, T. L. (1980). The Analytic Hierarchy Process: Planning, Priority Setting, Resource Allocation.", link: "#" }
    ]
  },
  {
    id: "method-bwm",
    level: 2,
    category: "Complete Info Methods",
    title: {
      pt: "2.2.5 BWM (Best Worst Method)",
      en: "2.2.5 BWM (Best Worst Method)"
    },
    desc: {
      pt: "Elicitação estruturada onde o decisor seleciona o melhor (mais importante) e o pior (menos importante) critério. Em seguida, compara o Melhor com os demais, e todos os demais com o Pior. Otimiza pesos resolvendo um modelo matemático linear/não-linear de inconsistência mínima.",
      en: "Structured weights elicitation where the DM selects the best (most important) and worst (least important) criteria. Then compares Best-to-others and others-to-Worst. Computes weights by solving a minimax mathematical programming model."
    },
    equation: "Min max |w_best/w_j - a_best_j| and |w_j/w_worst - a_j_worst|",
    authors: "Jafar Rezaei",
    video: "https://www.youtube.com/embed/s2v386eK2wQ",
    readings: [
      { name: "Rezaei, J. (2015). Best-worst multi-criteria decision-making method.", link: "https://doi.org/10.1016/j.omega.2014.11.009" }
    ]
  },
  {
    id: "method-bwt",
    level: 2,
    category: "Complete Info Methods",
    title: {
      pt: "2.2.6 BWT (Best-Worst Tradeoff)",
      en: "2.2.6 BWT (Best-Worst Tradeoff)"
    },
    desc: {
      pt: "Evolução do BWM que integra explicitamente o intervalo das escalas dos atributos (ranges) para evitar o viés de ancoragem comum em comparações abstratas de importância. Combina a estruturação do BWM com a consistência axiomática do Tradeoff clássico.",
      en: "Evolution of BWM that explicitly integrates attribute ranges to prevent anchoring bias typical of abstract criterion importance judgments. Combines the structured pairwise comparisons of BWM with the axiomatic rigor of the Tradeoff method."
    },
    equation: "Combines Best-to-Others and Others-to-Worst scales aligned with Attribute Ranges.",
    authors: "Jafar Rezaei, Liang, Brunelli",
    readings: [
      { name: "Liang, F., Brunelli, M., & Rezaei, J. (2022). The Best-Worst Tradeoff method.", link: "https://doi.org/10.1016/j.ejor.2022.05.021" }
    ]
  },
  {
    id: "method-macbeth",
    level: 2,
    category: "Complete Info Methods",
    title: {
      pt: "2.2.7 MACBETH",
      en: "2.2.7 MACBETH"
    },
    desc: {
      pt: "Abordagem de medição de atratividade baseada em categorias semânticas de diferença (Nula, Muito Fraca, Fraca, Moderada, Forte, Muito Forte, Extrema). Utiliza programação linear para derivar um sistema de escala de valor cardinal único e consistente.",
      en: "Measuring Attractiveness by a Categorical Based Evaluation Technique. Performs pairwise comparisons using 7 semantic categories. Employs linear programming to calculate consistent, cardinal value scales."
    },
    equation: "Linear Program: v(a) - v(b) >= threshold for category steps, checking consistency.",
    authors: "Carlos A. Bana e Costa, Jean-Claude Vansnick",
    readings: [
      { name: "Bana e Costa, C. A., & Vansnick, J.-C. (1994). MACBETH - An interactive path-oriented procedure.", link: "https://doi.org/10.1007/978-3-642-60184-2_2" }
    ]
  },
  {
    id: "method-smarts",
    level: 2,
    category: "Complete Info Methods",
    title: {
      pt: "2.2.8 SMARTS",
      en: "2.2.8 SMARTS"
    },
    desc: {
      pt: "Simple Multi-Attribute Rating Technique using Swings. Versão refinada do SMART que introduz o uso formal do swing-weighting para evitar o erro conceitual de ignorar a amplitude das escalas físicas dos critérios.",
      en: "Simple Multi-Attribute Rating Technique using Swings. A refined version of SMART that enforces swing weights to prevent the common conceptual error of ignoring physical scale ranges during elicitation."
    },
    equation: "v(x) = Sum(w_i * u_i(x_i)) using swing-elicited scaling constants",
    authors: "Ward Edwards",
    readings: [
      { name: "Edwards, W., & Barron, F. H. (1994). SMARTS and SMARTER: Improved simple methods.", link: "https://doi.org/10.1006/obhd.1994.1087" }
    ]
  },
  {
    id: "method-smarter",
    level: 2,
    category: "Complete Info Methods",
    title: {
      pt: "2.2.9 SMARTER",
      en: "2.2.9 SMARTER"
    },
    desc: {
      pt: "Extensão simplificada do SMARTS. O decisor apenas ordena os critérios em ordem de importância. Os pesos numéricos são atribuídos matematicamente através da fórmula do Centroide de Ordem de Ranking (ROC - Rank Order Centroid), reduzindo drasticamente o esforço cognitivo.",
      en: "Extended version of SMARTS. The DM only ranks criteria by importance. Quantitative weights are computed mathematically using the Rank Order Centroid (ROC) formulas, drastically lowering elicitation effort."
    },
    equation: "ROC Weights: w_i = (1 / K) * Sum_{j=i}^{K} (1 / j)",
    authors: "Ward Edwards, F. Hutton Barron",
    readings: [
      { name: "Edwards, W., & Barron, F. H. (1994). SMARTS and SMARTER: Improved simple methods.", link: "https://doi.org/10.1006/obhd.1994.1087" }
    ]
  },
  {
    id: "method-topsis",
    level: 2,
    category: "Complete Info Methods",
    title: {
      pt: "2.2.10 TOPSIS",
      en: "2.2.10 TOPSIS"
    },
    desc: {
      pt: "Método baseado na proximidade à solução ideal. Calcula distâncias geométricas (euclidianas) de cada alternativa para a Solução Ideal Positiva (SIP) e a Solução Ideal Negativa (SIN). Ranka as alternativas com base no coeficiente de proximidade relativa.",
      en: "Technique for Order of Preference by Similarity to Ideal Solution. Measures Euclidean distances of alternatives to both Positive-Ideal (PIS) and Negative-Ideal (NIS) solutions, ranking them by relative closeness."
    },
    equation: "S_i^+ = sqrt(Sum((v_ij - v_j^+)^2)) | S_i^- = sqrt(Sum((v_ij - v_j^-)^2)) | C_i = S_i^- / (S_i^+ + S_i^-)",
    authors: "Ching-Lai Hwang, Kwangsun Yoon",
    readings: [
      { name: "Hwang, C. L., & Yoon, K. (1981). Multiple Attribute Decision Making: Methods and Applications.", link: "#" }
    ]
  },
  {
    id: "method-vikor",
    level: 2,
    category: "Complete Info Methods",
    title: {
      pt: "2.2.11 VIKOR",
      en: "2.2.11 VIKOR"
    },
    desc: {
      pt: "Método de otimização multicritério e solução de compromisso. Ranka alternativas equilibrando a utilidade máxima do grupo (parâmetro S, baseado na distância Manhattan) e o arrependimento individual do decisor (parâmetro R, baseado na distância Chebyshev).",
      en: "Multicriteria Optimization and Compromise Solution. Ranks alternatives by establishing a compromise score that balances the maximum group utility (S index) and individual opponent regret (R index)."
    },
    equation: "Q_i = v * (S_i - S*) / (S^- - S*) + (1-v) * (R_i - R*) / (R^- - R*)",
    authors: "Serafim Opricovic",
    readings: [
      { name: "Opricovic, S., & Tzeng, G. H. (2004). Compromise solution by MCDM methods: A comparative analysis of VIKOR and TOPSIS.", link: "https://doi.org/10.1016/j.ejor.2003.10.014" }
    ]
  },
  {
    id: "method-copras",
    level: 2,
    category: "Complete Info Methods",
    title: {
      pt: "2.2.12 COPRAS",
      en: "2.2.12 COPRAS"
    },
    desc: {
      pt: "Complex Proportional Assessment. Avalia alternativas estimando sua significância e prioridade proporcional. Separa e calcula de forma independente as somas dos critérios que maximizam e minimizam o valor final.",
      en: "Complex Proportional Assessment. Evaluates alternatives proportionally based on the significance of criteria. Calculates separate indexes for maximizing (beneficial) and minimizing (non-beneficial) values."
    },
    equation: "Q_i = S_+i + (Sum(S_-j) / (S_-i * Sum(1 / S_-j)))",
    authors: "Edmundas Kazimieras Zavadskas, A. Kaklauskas",
    readings: [
      { name: "Zavadskas, E. K., Kaklauskas, A., & Sarka, Z. (1994). The new method of multicriteria complex proportional assessment.", link: "#" }
    ]
  },
  // SUBGROUP: Outranking Methods (School of Bernard Roy)
  {
    id: "method-electre",
    level: 2,
    category: "Outranking Methods",
    title: {
      pt: "2.3.1 Família ELECTRE",
      en: "2.3.1 ELECTRE Family"
    },
    desc: {
      pt: "Família de métodos de sobreclassificação desenvolvida pela escola francesa (Bernard Roy). Constrói relações de sobreclassificação baseadas em índices de Concordância (teste de maioria) e Discordância (teste de veto minoritário forte). Aborda incompatibilidades e incomparabilidade. ELECTRE I (escolha), III (ordenação) e TRI (classificação).",
      en: "Outranking methods family established by the French School (Bernard Roy). Builds outranking relations based on Concordance (majority validation) and Discordance (strong minority veto) indexes. Directly handles incomparability. ELECTRE I (choice), III (ranking), and TRI (sorting)."
    },
    equation: "Concordance C(a,b) >= c_min | Discordance D_j(a,b) <= d_max (Veto check)",
    authors: "Bernard Roy, José Figueira, Roman Slowinski",
    readings: [
      { name: "Roy, B. (1991). The outranking approach and the foundations of LBS-methods.", link: "https://doi.org/10.1016/0377-2217(91)90003-3" },
      { name: "Figueira, J., Mousseau, V., & Roy, B. (2005). ELECTRE Methods.", link: "https://doi.org/10.1007/0-387-23081-5_4" }
    ]
  },
  {
    id: "method-promethee",
    level: 2,
    category: "Outranking Methods",
    title: {
      pt: "2.3.2 Família PROMETHEE",
      en: "2.3.2 PROMETHEE Family"
    },
    desc: {
      pt: "Preference Ranking Organization Method for Enrichment Evaluations. Constrói sobreclassificação calculando fluxos de preferências positivas e negativas para cada alternativa com base em funções de preferências generalizadas. PROMETHEE I fornece pré-ordem parcial; PROMETHEE II fornece ranking completo.",
      en: "Preference Ranking Organization Method for Enrichment Evaluations. Computes positive (leaving) and negative (entering) preference flows for each alternative using generalized preference functions. PROMETHEE I yields partial rankings, PROMETHEE II yields full rankings."
    },
    equation: "Net Flow Phi(a) = Phi_plus(a) - Phi_minus(a)",
    authors: "Jean-Pierre Brans, Bertrand Mareschal",
    readings: [
      { name: "Brans, J. P., & Vincke, P. (1985). Note on the PROMETHEE multicriteria method.", link: "https://doi.org/10.1027/1012-2443.31.6.647" }
    ]
  },
  {
    id: "method-oreste",
    level: 2,
    category: "Outranking Methods",
    title: {
      pt: "2.3.3 ORESTE",
      en: "2.3.3 ORESTE Method"
    },
    desc: {
      pt: "Método de sobreclassificação que lida com dados puramente ordinais (rankings de critérios e de alternativas). Utiliza projeções e distâncias relativas em matrizes de ordenações para gerar uma ordenação global dos compromissos.",
      en: "Outranking method utilizing strictly ordinal inputs (rankings of criteria and alternative scores). Uses projections and relative distances within ordinal matrices to construct a consensus ranking."
    },
    equation: "Projection: d(r_j, r_ij) = [ 1/2 * (r_j)^p + 1/2 * (r_ij)^p ]^(1/p)",
    authors: "H. Pastijn, J. Leysen",
    readings: [
      { name: "Pastijn, H., & Leysen, J. (1989). Using an ordinal multicriteria method (ORESTE) in military decision making.", link: "https://doi.org/10.1016/0377-2217(89)90374-5" }
    ]
  },
  {
    id: "method-critic",
    level: 2,
    category: "Data-Driven Methods",
    title: {
      pt: "2.4.1 Critérios por Entropia & Método CRITIC",
      en: "2.4.1 Entropy & CRITIC Methods"
    },
    desc: {
      pt: "Abordagens estatísticas para obter pesos objetivos a partir da matriz de decisão, sem elicitação subjetiva com o decisor. A Entropia avalia a dispersão de dados de cada critério. O CRITIC (Criteria Importance Through Intercriteria Correlation) mede a intensidade de contraste e o conflito entre critérios.",
      en: "Statistical approaches to obtain objective criteria weights directly from the decision matrix without subjective interviews. Entropy measures data dispersion. CRITIC measures contrast intensity and conflict between criteria."
    },
    equation: "Entropy: e_j = -k * Sum(p_ij * ln(p_ij)) | CRITIC: C_j = sigma_j * Sum(1 - r_jk)",
    authors: "D. Diakoulaki, Claude Shannon",
    readings: [
      { name: "Diakoulaki, D. et al. (1995). Determining objective weights in multiple criteria problems. Computers & OR.", link: "https://doi.org/10.1016/0305-0548(94)E0017-X" }
    ]
  },
  {
    id: "method-merec",
    level: 2,
    category: "Data-Driven Methods",
    title: {
      pt: "2.4.2 Método MEREC",
      en: "2.4.2 MEREC Method"
    },
    desc: {
      pt: "Method Based on the Removal Effects of Criteria. Determina pesos objetivos avaliando o efeito da remoção de cada critério do desempenho global das alternativas. Critérios cuja remoção gera maior alteração na avaliação recebem maior peso.",
      en: "Method Based on the Removal Effects of Criteria. Determines objective criteria weights by measuring the effect of removing each criterion from the overall performance of alternatives. Criteria causing larger performance shifts get higher weights."
    },
    equation: "MEREC: S_ij = ln( 1 + 1/m * Sum(|x_ij - x_kj|) ) | w_j = d_j / Sum(d_k)",
    authors: "M. Keshavarz-Ghorabaee",
    readings: [
      { name: "Keshavarz-Ghorabaee, M. et al. (2021). A new method for calculating criteria weights based on removal effects (MEREC). Symmetry.", link: "https://doi.org/10.3390/sym13040525" }
    ]
  },
  {
    id: "method-dea",
    level: 2,
    category: "Data-Driven Methods",
    title: {
      pt: "2.4.3 DEA (Análise Envoltória de Dados)",
      en: "2.4.3 DEA (Data Envelopment Analysis)"
    },
    desc: {
      pt: "Técnica baseada em programação linear para medir a eficiência relativa de unidades tomadoras de decisão (DMUs) que consomem múltiplos inputs para produzir múltiplos outputs, definindo uma fronteira empírica de eficiência sem pesos a priori.",
      en: "Linear programming technique to measure the relative efficiency of decision-making units (DMUs) consuming multiple inputs to produce multiple outputs, establishing an empirical efficiency frontier without pre-defined weights."
    },
    equation: "DEA: Max h_0 = Sum(u_r * y_r0) / Sum(v_i * x_i0) s.t. Efficiency_j <= 1",
    authors: "A. Charnes, W. W. Cooper, E. Rhodes",
    readings: [
      { name: "Charnes, A., Cooper, W. W., & Rhodes, E. (1978). Measuring the efficiency of decision making units. EJOR.", link: "https://doi.org/10.1016/0377-2217(78)90138-8" }
    ]
  },

  // LEVEL 3: ADVANCED & EMERGING FRONTIERS (Avançado)
  // SUBGROUP: Partial Information Methods
  {
    id: "method-fitradeoff",
    level: 3,
    category: "Partial Info Methods",
    title: {
      pt: "3.1.1 Método FITradeoff",
      en: "3.1.1 FITradeoff Method"
    },
    desc: {
      pt: "Flexible Iterative Tradeoff. Desenvolvido no CDSID/UFPE. Combina MAVT com Programação Linear. O decisor não precisa encontrar pontos exatos de indiferença (difíceis e exaustivos). Em vez disso, responde a relações de preferência estritas, e o modelo atualiza a matriz de ordenação viável dinamicamente até obter uma solução inequívoca. Aplicável a Choice, Ranking, Sorting e Portfolio.",
      en: "Flexible Iterative Tradeoff. Developed at CDSID/UFPE. Combines MAVT with Linear Programming. DMs only state strict preference inequalities rather than exact indifference points. The software solves LPs to filter possible weights and updates rankings iteratively with minimal cognitive effort. Tailored for Choice, Ranking, Sorting, and Portfolio."
    },
    equation: "LP: Max/Min v(a) s.t. w_i in Weights Space, w_i >= w_j for stated preferences",
    authors: "Adiel Teixeira de Almeida, Eduarda Frej, Lucia Roselli",
    video: "https://www.youtube.com/embed/5a6q-tU3KzM",
    readings: [
      { name: "de Almeida et al. (2016). FITradeoff: A multi-criteria method for eliciting scaling constants.", link: "https://doi.org/10.1007/s10479-016-2240-8" },
      { name: "Frej, E. A. et al. (2019). FITradeoff sorting method.", link: "https://doi.org/10.1016/j.ejor.2018.11.025" }
    ]
  },
  {
    id: "method-smaa",
    level: 3,
    category: "Partial Info Methods",
    title: {
      pt: "3.1.2 SMAA (Stochastic Multicriteria Acceptability Analysis)",
      en: "3.1.2 SMAA (Stochastic Multicriteria Acceptability Analysis)"
    },
    desc: {
      pt: "Método desenhado para lidar com ausência extrema ou imprecisão de dados de pesos e critérios. Explora o espaço de pesos viáveis via simulação estocástica (Monte Carlo) para gerar índices de aceitabilidade da alternativa para cada rank (SMAA-1, SMAA-2, SMAA-TRI).",
      en: "Designed for scenarios with extreme data gaps or missing criterion weights. Explores the weights space through Monte Carlo simulation to calculate rank acceptability indices for each alternative (SMAA-1, SMAA-2, SMAA-TRI)."
    },
    equation: "Acceptability: b_i^r = Integral_{w in W} P(rank(i, w) == r) * f(w) dw",
    authors: "Risto Lahdelma, Pekka Salminen, Roman Slowinski",
    readings: [
      { name: "Lahdelma, R., & Salminen, P. (2001). SMAA-2: Stochastic multicriteria acceptability analysis.", link: "https://doi.org/10.1016/S0377-2217(00)00138-0" }
    ]
  },
  {
    id: "method-fuzzy",
    level: 3,
    category: "Partial Info Methods",
    title: {
      pt: "3.1.3 Fuzzy MCDM",
      en: "3.1.3 Fuzzy MCDM"
    },
    desc: {
      pt: "Incorpora a teoria dos conjuntos fuzzy de Zadeh nas decisões. Utiliza números triangulares ou trapezoidais fuzzy para representar termos linguísticos e imprecisão semântica em matrizes de decisão e julgamentos (ex: Fuzzy AHP, Fuzzy TOPSIS, Intuitionistic Fuzzy).",
      en: "Incorporates Zadeh's fuzzy set theory into multicriteria decisions. Employs triangular or trapezoidal fuzzy numbers to model linguistic labels and semantic uncertainty in evaluations (e.g., Fuzzy AHP, Fuzzy TOPSIS, Intuitionistic Fuzzy)."
    },
    equation: "Fuzzy Number: t = (l, m, u) | Membership function: mu(x)",
    authors: "Lotfi A. Zadeh, Roman Slowinski, Cengiz Kahraman",
    readings: [
      { name: "Zadeh, L. A. (1965). Fuzzy sets. Information and Control.", link: "#" }
    ]
  },
  {
    id: "method-drsa",
    level: 3,
    category: "Partial Info Methods",
    title: {
      pt: "3.1.4 DRSA (Dominance Rough Set)",
      en: "3.1.4 DRSA (Dominance Rough Set)"
    },
    desc: {
      pt: "Dominance-based Rough Set Approach. Adaptação da teoria de conjuntos rough à tomada de decisão multicritério. Induz regras lógicas do tipo 'Se ... Então' baseadas na dominância a partir de dados exemplares de treinamento de decisões passadas do DM.",
      en: "Dominance-based Rough Set Approach. Extension of rough set theory to multicriteria decision problems. Induces logical 'If... then...' decision rules based on dominance relations from past decision examples."
    },
    equation: "Approximations: Cl_t^>= = {x in U | D_P^+(x) subset of Cl_t^>=} and induced decision rules.",
    authors: "Salvatore Greco, Benedetto Matarazzo, Roman Slowinski",
    readings: [
      { name: "Greco, S., Matarazzo, B., & Slowinski, R. (2001). Rough sets theory for multicriteria decision analysis.", link: "https://doi.org/10.1016/S0377-2217(00)00167-7" }
    ]
  },
  // SUBGROUP: Decision Contexts
  {
    id: "env-individual",
    level: 3,
    category: "Decision Contexts",
    title: {
      pt: "3.2.1 Decisão Individual",
      en: "3.2.1 Individual Decision"
    },
    desc: {
      pt: "MCDA focado em um único decisor (DM) individual. Os métodos se concentram em estruturar a mente do decisor, aliviar seus vieses cognitivos e derivar uma função de valor de forma coerente.",
      en: "MCDA focusing on a single, individual decision maker (DM). Methods focus on cognitive structuring, mitigating individual bias, and constructing coherent preference functions."
    },
    equation: "Preferences of DM_1 -> Single Value Function V(x)",
    authors: "Ralph Keeney, Bernard Roy",
    readings: [
      { name: "Keeney, R. L. (1992). Value-Focused Thinking.", link: "#" }
    ]
  },
  {
    id: "env-group",
    level: 3,
    category: "Decision Contexts",
    title: {
      pt: "3.2.2 Decisão em Grupo",
      en: "3.2.2 Group Decision Making"
    },
    desc: {
      pt: "Envolve múltiplos tomadores de decisão com perspectivas divergentes. Analisa a agregação de preferências individuais em uma preferência coletiva e o suporte a métodos de votação e agregação de pesos.",
      en: "Involves multiple DMs with divergent priorities. Analyzes the mathematical aggregation of individual preferences/weights into collective indicators and consensus metrics."
    },
    equation: "Group Utility V_G(x) = Sum(alpha_k * V_k(x)) | Voting models",
    authors: "Adiel Teixeira de Almeida, J.P. Brans, Eduarda Frej",
    readings: [
      { name: "de Almeida, A. T., & Frej, E. A. (2020). Group Decision and Negotiation.", link: "#" }
    ]
  },
  {
    id: "env-negotiation",
    level: 3,
    category: "Decision Contexts",
    title: {
      pt: "3.2.3 Negociação & Consenso",
      en: "3.2.3 Negotiation & Consensus"
    },
    desc: {
      pt: "Processos iterativos apoiados por sistemas onde as partes envolvidas realizam concessões mútuas. Análise de ponto de equilíbrio, teoria dos jogos corporativa e modelos de mediação baseados em MCDA.",
      en: "Iterative negotiation support systems where parties trade concessions. Game-theoretic equilibrium models, mutual gains analysis, and mediation protocols based on MCDA."
    },
    equation: "Nash Bargaining Solution: Max Product (U_k(x) - U_k(status_quo))",
    authors: "Gregory Kersten, Roman Slowinski",
    readings: [
      { name: "Kersten, G. E. (2001). Support for group decisions and negotiations.", link: "#" }
    ]
  },
  // SUBGROUP: Research Frontiers
  {
    id: "front-behavioral",
    level: 3,
    category: "Frontiers",
    title: {
      pt: "3.3.1 MCDA Comportamental e Neurociência",
      en: "3.3.1 Behavioral MCDA & Neuroscience"
    },
    desc: {
      pt: "Pesquisa de ponta sobre como os decisores realmente se comportam (Behavioral MCDA). Integração de ferramentas de neurociência (como rastreadores oculares/eye-tracking, EEG) para avaliar a fadiga, carga cognitiva e tempo de decisão, especialmente em métodos interativos como FITradeoff.",
      en: "Cutting edge research on how decision makers actually behave (Behavioral MCDA). Employs neuroscience tools (eye-tracking, pupil dilation, EEG) to evaluate fatigue, cognitive workload, and response times in interactive methods like FITradeoff."
    },
    equation: "Cognitive Load = f(Fixation Duration, Pupil Dilation, Decision Time)",
    authors: "Lucia Roselli, Adiel Teixeira de Almeida",
    readings: [
      { name: "Roselli, L. Reis P. et al. (2023). Neuroscience tools applied to MCDM.", link: "#" }
    ]
  },
  {
    id: "front-ai-integration",
    level: 3,
    category: "Frontiers",
    title: {
      pt: "3.3.2 Integração com IA e Machine Learning",
      en: "3.3.2 Integration with AI and Machine Learning"
    },
    desc: {
      pt: "Pesquisas atuais focadas em combinar a capacidade preditiva da IA com o rigor prescritivo do MCDA. Aprendizado de preferências por redes neurais, explicação de rankings (XAI em MCDA) e modelagem adaptativa de preferências.",
      en: "Modern research combining the predictive power of AI with the prescriptive rigor of MCDA. Preference learning via neural networks, explainable AI rankings (XAI in MCDA), and adaptive preference models."
    },
    equation: "Explainable MCDA: Feature Importance (ML) -> Scaling Constants (MCDA)",
    authors: "Roman Slowinski, Jafar Rezaei",
    readings: [
      { name: "Slowinski, R. (2024). Explainable AI and Multicriteria Decision Support.", link: "#" }
    ]
  },
  {
    id: "method-pref-learning",
    level: 3,
    category: "Frontiers",
    title: {
      pt: "3.3.3 Aprendizado de Preferências (Preference Learning)",
      en: "3.3.3 Preference Learning"
    },
    desc: {
      pt: "Modelos de Machine Learning (como SVM-Rank, redes neurais e regressão ordinal) projetados para aprender funções de utilidade ou relações de sobreclassificação a partir de decisões históricas observadas ou comparações passivas do decisor.",
      en: "Machine Learning models (such as SVM-Rank, neural networks, and ordinal regression) designed to learn utility functions or outranking relationships from observed historical decisions or passive pairwise comparisons."
    },
    equation: "Loss Minimization: Min Sum( max(0, 1 - y_ij * (f(x_i) - f(x_j))) ) + regularization",
    authors: "Roman Slowinski, Salvatore Greco, Johannes Fürnkranz",
    readings: [
      { name: "Fürnkranz, J., & Hüllermeier, E. (2010). Preference Learning. Springer.", link: "https://doi.org/10.1007/978-3-642-14125-6" }
    ]
  },
  {
    id: "method-xai",
    level: 3,
    category: "Frontiers",
    title: {
      pt: "3.3.4 Inteligência Artificial Explicável (XAI) em MCDA",
      en: "3.3.4 Explainable AI (XAI) in MCDA"
    },
    desc: {
      pt: "Integração de frameworks de explicabilidade (SHAP, LIME, indução de regras baseada em dominância) com modelos híbridos de decisão. Garante transparência e auditoria de modelos caixa-preta que sugerem ordens de priorização de alternativas.",
      en: "Integration of explainability frameworks (SHAP, LIME, dominance-based rule induction) with hybrid decision models. Enforces transparency and auditability of black-box models suggesting prioritization rankings."
    },
    equation: "Explainability: g(z') = phi_0 + Sum(phi_i * z'_i) (SHAP local attribution)",
    authors: "Roman Slowinski, Salvatore Greco",
    readings: [
      { name: "Slowinski, R. (2024). Explainable AI and Multicriteria Decision Support. JMCDA.", link: "#" }
    ]
  }
];

// ==================== 2. DICTIONARY TRANSLATIONS ====================
const TRANSLATIONS = {
  pt: {
    nav_roadmap: "Trilha de Aprendizado",
    nav_timeline: "Linha do Tempo",
    nav_classes: "Videoaulas & Aulas",
    nav_authors: "Rede de Autores",
    nav_journals: "Periódicos & Redes",
    nav_sync: "Pesquisa & Atualização",
    sidebar_intro_auth: "Salve seu progresso",
    btn_login: "Entrar / Cadastrar",
    btn_logout: "Sair",
    title_roadmap: "Trilha de Decisão Multicritério",
    subtitle_roadmap: "Guia completo para explorar conceitos, métodos e fronteiras de pesquisa de MCDM/MCDA.",
    legend_ns: "Não Iniciado",
    legend_ip: "Em Progresso",
    legend_co: "Concluído",
    timeline_title: "Linha do Tempo de MCDM/MCDA",
    timeline_subtitle: "Evolução histórica dos principais marcos, teorias e métodos que estruturaram a ciência de decisão multicritério (1772 - 2026).",
    classes_title: "Videoaulas e Tutoriais Prescritivos",
    classes_subtitle: "Aprenda a fundamentação e a aplicação prática de métodos como FITradeoff, AHP e BWM diretamente com as aulas dos autores e pesquisadores da área.",
    authors_net_title: "Rede Global de Autores",
    authors_net_desc: "O desenvolvimento da ciência de decisões multicritério é moldado por pioneiros históricos europeus e norte-americanos, consolida-se em hubs globais de pesquisa (como o CDSID no Brasil) e expande-se com jovens pesquisadores de destaque no mundo.",
    auth_cat_pioneers: "Pioneiros Históricos",
    auth_cat_young: "Pesquisadores Promissores e Contemporâneos",
    journals_title: "Principais Periódicos Acadêmicos",
    journals_subtitle: "Periódicos internacionais com maior impacto na publicação de teorias, métodos e aplicações de MCDM/MCDA.",
    th_journal: "Periódico",
    th_publisher: "Editora",
    th_if: "Fator de Impacto",
    th_sjr: "SJR Q-Ranking",
    th_hindex: "H-Index (Scimago)",
    comm_title: "Comunidades Científicas e Grupos",
    sync_title: "Monitoramento de Pesquisa e Estatísticas",
    stat_cached_lbl: "Artigos Recentes Mapeados (2024-2026)",
    sync_info_txt: "O roadmap atualiza-se conectando-se diretamente à base do OpenAlex API. Ele puxa publicações recentes com as palavras-chave da área e calcula estatísticas de pesquisa moderna automaticamente.",
    btn_sync_now: "Sincronizar OpenAlex",
    feed_title: "Publicações Recentes da Área (2024-2026)",
    feed_loading: "Buscando banco de dados...",
    dr_sec_desc: "Conceito e Explicação",
    dr_sec_math: "Estrutura Matemática / Elicitação",
    dr_sec_video: "Videoaula do Tópico",
    dr_sec_authors: "Autores Chave",
    dr_sec_readings: "Leituras Recomendadas",
    dr_sec_research: "Pesquisa Recente no OpenAlex",
    dr_status_title: "Seu progresso neste tópico:",
    btn_ns: "Não Iniciado",
    btn_ip: "Em Progresso",
    btn_co: "Concluído",
    modal_login_title: "Acessar Guia de Estudos",
    modal_login_subtitle: "Entre ou crie uma conta para salvar seu progresso no roadmap e customizar sua trilha.",
    form_pwd: "Senha",
    modal_toggle_txt: "Ainda não tem uma conta?",
    modal_toggle_lnk: "Cadastre-se",
    toast_welcome: "Bem-vindo!",
    toast_auth_success: "Autenticação realizada com sucesso!",
    toast_logout: "Você saiu da conta.",
    toast_progress_saved: "Progresso atualizado com sucesso!",
    toast_sync_success: "Sincronização com OpenAlex concluída!",
    toast_sync_fail: "Erro ao sincronizar com OpenAlex.",
    toast_error: "Ocorreu um erro.",
    level_1: "Nível 1: Fundações",
    level_2: "Nível 2: Métodos Principais",
    level_3: "Nível 3: Avançado & Fronteiras"
  },
  en: {
    nav_roadmap: "Learning Roadmap",
    nav_timeline: "Timeline",
    nav_classes: "Video Lectures",
    nav_authors: "Authors Network",
    nav_journals: "Journals & Networks",
    nav_sync: "Research & Updates",
    sidebar_intro_auth: "Save your progress",
    btn_login: "Login / Register",
    btn_logout: "Logout",
    title_roadmap: "Multicriteria Decision Roadmap",
    subtitle_roadmap: "A complete guide to explore MCDM/MCDA concepts, methods, and research frontiers.",
    legend_ns: "Not Started",
    legend_ip: "In Progress",
    legend_co: "Completed",
    timeline_title: "MCDM/MCDA Historical Timeline",
    timeline_subtitle: "Historical milestones, theories, and methods that structured multicriteria decision science (1772 - 2026).",
    classes_title: "Prescriptive Video Lectures",
    classes_subtitle: "Learn the mathematical foundations and practical applications of methods like FITradeoff, AHP, and BWM directly from video tutorials of the authors.",
    authors_net_title: "Global Authors Network",
    authors_net_desc: "The development of decision science is shaped by North American and European pioneers, centered in prominent global hubs (like CDSID in Brazil), and driving forward through promising young researchers.",
    auth_cat_pioneers: "Historical Pioneers",
    auth_cat_young: "Promising & Contemporary Researchers",
    journals_title: "Leading Academic Journals",
    journals_subtitle: "International journals with the highest impact in publishing MCDM/MCDA theories, methods, and applications.",
    th_journal: "Journal",
    th_publisher: "Publisher",
    th_if: "Impact Factor",
    th_sjr: "SJR Q-Ranking",
    th_hindex: "H-Index (Scimago)",
    comm_title: "Scientific Communities & Groups",
    sync_title: "Research Monitoring & Analytics",
    stat_cached_lbl: "Cached Recent Articles (2024-2026)",
    sync_info_txt: "This roadmap auto-updates by connecting to the OpenAlex API database. It aggregates recent publications with relevant keywords and calculates research stats.",
    btn_sync_now: "Sync OpenAlex Live",
    feed_title: "Recent Area Publications (2024-2026)",
    feed_loading: "Fetching database...",
    dr_sec_desc: "Concept & Explanation",
    dr_sec_math: "Mathematical / Elicitation Structure",
    dr_sec_video: "Topic Video Lecture",
    dr_sec_authors: "Key Authors",
    dr_sec_readings: "Recommended Readings",
    dr_sec_research: "Recent Research on OpenAlex",
    dr_status_title: "Your progress on this topic:",
    btn_ns: "Not Started",
    btn_ip: "In Progress",
    btn_co: "Completed",
    modal_login_title: "Access Study Guide",
    modal_login_subtitle: "Login or register an account to save your roadmap progress and map your study path.",
    form_pwd: "Password",
    modal_toggle_txt: "Don't have an account?",
    modal_toggle_lnk: "Sign Up",
    toast_welcome: "Welcome!",
    toast_auth_success: "Authenticated successfully!",
    toast_logout: "Logged out successfully.",
    toast_progress_saved: "Progress updated successfully!",
    toast_sync_success: "OpenAlex sync completed!",
    toast_sync_fail: "Failed to sync OpenAlex.",
    toast_error: "An error occurred.",
    level_1: "Level 1: Foundations",
    level_2: "Level 2: Core Methods",
    level_3: "Level 3: Advanced & Frontiers"
  }
};

// ==================== 3. SCIENTIFIC AUTHORS DATA ====================
const PIONEER_AUTHORS = [
  {
    name: "Ralph Keeney",
    orcid: "0000-0002-3987-1941",
    label: "MAUT / VFT",
    labelClass: "pioneer",
    affiliation: "Duke University, USA",
    societies: ["MCDM Society", "INFORMS", "Decision Analysis Society (DAS)"],
    journals: ["Operations Research", "Management Science", "Decision Analysis"],
    publications: "Teoria da Utilidade Multiatributo (MAUT), Value-Focused Thinking (VFT), Análise de Risco.",
    bio: {
      pt: "Co-autor da obra seminal 'Decisions with Multiple Objectives' (1976) junto com Howard Raiffa. Criador da Teoria da Utilidade Multiatributo (MAUT) e do pensamento focado em valores (Value-Focused Thinking).",
      en: "Co-author of the seminal book 'Decisions with Multiple Objectives' (1976) with Howard Raiffa. Developed Multi-Attribute Utility Theory (MAUT) and Value-Focused Thinking (VFT)."
    },
    connections: "Howard Raiffa, Ward Edwards"
  },
  {
    name: "Bernard Roy",
    orcid: "Not Available (Deceased)",
    label: "ELECTRE / Outranking",
    labelClass: "pioneer",
    affiliation: "LAMSADE, Université Paris-Dauphine, France",
    societies: ["EWG-MCDA", "EURO (European Association of OR Societies)"],
    journals: ["EJOR", "Journal of Multi-Criteria Decision Analysis", "Metrika"],
    publications: "Paradigma de Sobreclassificação (Outranking), Família de Métodos ELECTRE, Fundamentos do Apoio à Decisão.",
    bio: {
      pt: "Fundador da Escola Europeia de Apoio Multicritério à Decisão (MCDA). Desenvolvedor da família de métodos ELECTRE e introdutor do paradigma de sobreclassificação.",
      en: "Founder of the European School of Multicriteria Decision Aiding (MCDA). Developed the ELECTRE family of methods and pioneered the outranking paradigm."
    },
    connections: "José Figueira, Roman Slowinski, EWG-MCDA"
  },
  {
    name: "Thomas L. Saaty",
    orcid: "Not Available (Deceased)",
    label: "AHP / ANP",
    labelClass: "pioneer",
    affiliation: "University of Pittsburgh, USA",
    societies: ["International Society on AHP (ISAHP)", "MCDM Society", "INFORMS"],
    journals: ["Mathematical Modelling", "European Journal of Operational Research", "Socio-Economic Planning Sciences"],
    publications: "Analytic Hierarchy Process (AHP), Analytic Network Process (ANP), Escalas de autovalor/autovetor.",
    bio: {
      pt: "Criador do Analytic Hierarchy Process (AHP) e do Analytic Network Process (ANP) na década de 1970, estruturando a tomada de decisão em matrizes de autovetores par a par.",
      en: "Creator of the Analytic Hierarchy Process (AHP) and Analytic Network Process (ANP) in the 1970s, structuring decision-making using pairwise ratio matrices."
    },
    connections: "Luis Vargas"
  },
  {
    name: "Valerie Belton",
    orcid: "0000-0002-3856-9112",
    label: "MCDA Integration",
    labelClass: "pioneer",
    affiliation: "University of Strathclyde, Scotland",
    societies: ["Operational Research Society (UK)", "EWG-MCDA", "MCDM Society"],
    journals: ["Journal of the Operational Research Society (JORS)", "EJOR", "JMCDA"],
    publications: "Integração de Métodos MCDA, Visual MCDA, Apoio de Decisão Facilitado (Facilitated Decision Analysis).",
    bio: {
      pt: "Uma das principais vozes da sistematização e integração de abordagens multicritério. Autora de obras essenciais que unificam o MAVT, AHP e Métodos de Sobreclassificação.",
      en: "A leading voice in the systematization and integration of multicriteria approaches. Author of key texts unifying MAVT, AHP, and Outranking Methods."
    },
    connections: "Theodor Stewart"
  },
  {
    name: "Adiel Teixeira de Almeida",
    orcid: "0000-0002-2305-6547",
    label: "FITradeoff / MCDM",
    labelClass: "pioneer",
    affiliation: "CDSID, UFPE, Brazil",
    societies: ["MCDM Society (Vice-President)", "SOBRAPO", "EWG-MCDA", "INFORMS"],
    journals: ["European Journal of Operational Research", "Group Decision and Negotiation", "Annals of OR"],
    publications: "Elicitação Flexível de Preferências, Método FITradeoff, Decisão em Grupo, Seleção de Portfólio, Sistemas de Informação.",
    bio: {
      pt: "Fundador do CDSID e criador do método FITradeoff. Vice-Presidente da Sociedade Internacional de MCDM. Referência mundial em elicitação de preferências flexível.",
      en: "Founder of CDSID and developer of the FITradeoff method. Vice-President of the International MCDM Society. Global reference in flexible preference elicitation."
    },
    connections: "Eduarda Frej, Lucia Roselli, Bernard Roy"
  },
  {
    name: "Ward Edwards",
    orcid: "Not Available (Deceased)",
    label: "SMART / Swing",
    labelClass: "pioneer",
    affiliation: "University of Southern California, USA",
    societies: ["Psychonomic Society", "INFORMS"],
    journals: ["Psychological Review", "Organizational Behavior and Human Decision Processes", "IEEE Transactions"],
    publications: "SMART, SMARTS, SMARTER, Elicitação por swings, Psicologia Comportamental da Tomada de Decisão.",
    bio: {
      pt: "Psicólogo pioneiro que introduziu a análise de decisão nos campos comportamentais. Desenvolveu os métodos SMART, SMARTS e SMARTER com foco em simplificação cognitiva.",
      en: "Pioneering psychologist who brought decision analysis to behavioral fields. Created the SMART, SMARTS, and SMARTER methods focused on cognitive simplicity."
    },
    connections: "Ralph Keeney, Hutton Barron"
  },
  {
    name: "Jean-Pierre Brans",
    orcid: "0000-0002-4521-8890",
    label: "PROMETHEE",
    labelClass: "pioneer",
    affiliation: "Vrije Universiteit Brussel, Belgium",
    societies: ["EURO", "Belgian OR Society (SOGESCI)", "MCDM Society"],
    journals: ["EJOR", "Journal of Multi-Criteria Decision Analysis", "Operational Research"],
    publications: "Família de Métodos PROMETHEE, Tomada de Decisão e Otimização em Redes, Métodos Multicritério baseados em fluxos.",
    bio: {
      pt: "Desenvolvedor dos métodos PROMETHEE de sobreclassificação baseados em fluxos líquidos de preferências, amplamente utilizados em logística e avaliação ambiental.",
      en: "Developer of the PROMETHEE outranking methods based on positive/negative preference flows, widely utilized in logistics and environmental assessment."
    },
    connections: "Bertrand Mareschal"
  },
  {
    name: "Roman Slowinski",
    orcid: "0000-0002-0927-6111",
    label: "DRSA / Rough Sets",
    labelClass: "pioneer",
    affiliation: "Poznan University of Technology, Poland",
    societies: ["EWG-MCDA (Co-coordinator)", "Polish Academy of Sciences", "MCDM Society"],
    journals: ["EJOR", "Fuzzy Sets and Systems", "Decision Support Systems"],
    publications: "Dominance-based Rough Set Approach (DRSA), Aprendizado de Preferências, IA e Tomada de Decisão Explicável.",
    bio: {
      pt: "Líder e co-coordenador do EWG-MCDA. Desenvolvedor da abordagem DRSA de indução de regras baseada em dominância rough. Pioneiro no cruzamento de IA com apoio à decisão.",
      en: "Leader and co-coordinator of EWG-MCDA. Developed the Dominance-based Rough Set Approach (DRSA). Pioneer in the intersection of AI and decision aiding."
    },
    connections: "Salvatore Greco, Benedetto Matarazzo"
  },
  {
    name: "Salvatore Greco",
    orcid: "0000-0003-3490-4828",
    label: "DRSA / Preference Learning",
    labelClass: "pioneer",
    affiliation: "University of Catania, Italy / University of Portsmouth, UK",
    societies: ["EWG-MCDA", "MCDM Society", "IRSS (Rough Sets)"],
    journals: ["EJOR", "European Journal of Operational Research", "JMCDA", "Decision Sciences"],
    publications: "Dominance-based Rough Set Approach (DRSA), Elicitação de Regras de Decisão baseadas em Dominância, IA Explicável.",
    bio: {
      pt: "Pesquisador renomado internacionalmente. Co-criador do método DRSA junto a Slowinski e pioneiro no uso de Inteligência Artificial e Machine Learning para aprendizado de preferências.",
      en: "Globally renowned researcher. Co-creator of DRSA with Slowinski, and pioneer in integrating AI and Machine Learning for preference learning."
    },
    connections: "Roman Slowinski, Benedetto Matarazzo"
  },
  {
    name: "Theodor Stewart",
    orcid: "0000-0001-9457-3625",
    label: "MCDA Integration / MAUT",
    labelClass: "pioneer",
    affiliation: "University of Cape Town, South Africa",
    societies: ["MCDM Society (Past President)", "Operations Research Society of South Africa", "EWG-MCDA"],
    journals: ["EJOR", "JMCDA", "Operations Research"],
    publications: "Integração de Escolas de Decisão, Otimização Multiobjetivo, MAUT, Tomada de Decisão em Recursos Naturais.",
    bio: {
      pt: "Presidente honorário e ex-presidente da Sociedade Internacional de MCDM. Co-autor do principal livro de integração da área junto a Valery Belton.",
      en: "Honorary president and past president of the International MCDM Society. Co-authored the leading integration textbook in the field with Valery Belton."
    },
    connections: "Valerie Belton, Adiel Teixeira de Almeida"
  },
  {
    name: "Carlos A. Bana e Costa",
    orcid: "0000-0002-3987-9204",
    label: "MACBETH Method",
    labelClass: "pioneer",
    affiliation: "University of Lisbon, Portugal",
    societies: ["EWG-MCDA", "EURO", "LSE Decision Sciences"],
    journals: ["EJOR", "Journal of Multi-Criteria Decision Analysis", "Interfaces"],
    publications: "Método MACBETH, Teoria da Medição de Atratividade Semântica, Decisão Facilitada.",
    bio: {
      pt: "Criador do método MACBETH (com Vansnick). Pioneiro em processos facilitados de tomada de decisão com foco na modelagem de atratividade semântica qualitativa.",
      en: "Creator of the MACBETH method (with Vansnick). Pioneer in facilitated decision processes focusing on qualitative semantic attractiveness modeling."
    },
    connections: "Jean-Claude Vansnick, Carlos Ferreira"
  },
  {
    name: "Luis C. Dias",
    orcid: "0000-0002-8610-8260",
    label: "MCDA Sorting / Robustness",
    labelClass: "pioneer",
    affiliation: "University of Coimbra, Portugal",
    societies: ["EWG-MCDA (Co-coordinator)", "APDIO (Portuguese OR Society)", "MCDM Society"],
    journals: ["EJOR", "Group Decision and Negotiation", "Annals of OR"],
    publications: "Problemática de Classificação (Sorting), Análise de Robustez, Elicitação em Grupo, Avaliação Ambiental e Energética.",
    bio: {
      pt: "Co-coordenador do EWG-MCDA. Autoridade reconhecida em análises de robustez com informação imprecisa, modelagens de classificação e decisões de energia sustentável.",
      en: "Co-coordinator of EWG-MCDA. Renowned expert in robustness analysis under imprecise information, sorting models, and sustainable energy decisions."
    },
    connections: "Bernard Roy, Joao Climaco, EWG-MCDA"
  },
  {
    name: "Ching-Lai Hwang & Kwangsun Yoon",
    orcid: "Not Available (Deceased)",
    label: "TOPSIS / MADM Pioneers",
    labelClass: "pioneer",
    affiliation: "Kansas State University, USA",
    societies: ["MCDM Society", "INFORMS"],
    journals: ["Lecture Notes in Economics and Mathematical Systems", "European Journal of Operational Research", "Computers & Operations Research"],
    publications: "TOPSIS, Multiple Attribute Decision Making, Multiple Objective Decision Making.",
    bio: {
      pt: "Autores da obra seminal de 1981 'Multiple Attribute Decision Making: Methods and Applications', que formalizou o método TOPSIS (baseado na proximidade à solução ideal).",
      en: "Authors of the seminal 1981 monograph 'Multiple Attribute Decision Making: Methods and Applications', which introduced the TOPSIS method (closeness to ideal solutions)."
    },
    connections: "Serafim Opricovic"
  },
  {
    name: "Edmundas Kazimieras Zavadskas",
    orcid: "0000-0002-3106-9040",
    label: "COPRAS / WASPAS / Hybrid MCDM",
    labelClass: "pioneer",
    affiliation: "Vilnius Gediminas Technical University, Lithuania",
    societies: ["Lithuanian Academy of Sciences", "MCDM Society", "EWG-MCDA"],
    journals: ["Technological and Economic Development of Economy", "EJOR", "Symmetry"],
    publications: "Métodos COPRAS, WASPAS, MULTIMOORA, Decisão em Engenharia Civil e Sustentabilidade.",
    bio: {
      pt: "Um dos pesquisadores mais citados do mundo na área de PO. Fundador e criador dos métodos COPRAS e WASPAS, pioneiro em aplicações híbridas em infraestruturas e construções.",
      en: "One of the most highly cited researchers globally in OR. Founder of the COPRAS and WASPAS methods, pioneering hybrid MCDM applications in infrastructure and engineering."
    },
    connections: "Jafar Rezaei, Dragan Pamucar"
  },
  {
    name: "Enrique Herrera-Viedma",
    orcid: "0000-0002-3103-6112",
    label: "Fuzzy Consensus / Group Decision",
    labelClass: "pioneer",
    affiliation: "University of Granada, Spain",
    societies: ["IEEE CIS (Fellow)", "IFSA", "MCDM Society"],
    journals: ["IEEE Transactions on Fuzzy Systems", "Information Sciences", "Knowledge-Based Systems"],
    publications: "Consenso Fuzzy em Grupo, Relações de Preferência Fuzzy, Sistemas de Recomendação, Tomada de Decisão de Grupo Multi-especialistas.",
    bio: {
      pt: "Líder mundial altamente citado no desenvolvimento de modelos matemáticos de consenso e consistência sob preferências fuzzy para tomadas de decisão em grupo.",
      en: "Highly cited world leader in developing mathematical consensus and consistency models under fuzzy preferences for group decision-making."
    },
    connections: "Francisco Chiclana, Muhammet Deveci"
  },
  {
    name: "Yannis Siskos",
    orcid: "0000-0002-3687-2415",
    label: "UTA Method / Preference Disaggregation",
    labelClass: "pioneer",
    affiliation: "University of Piraeus, Greece",
    societies: ["HELLORS (Greek OR Society)", "EWG-MCDA", "MCDM Society"],
    journals: ["EJOR", "JMCDA", "European Journal of Decision Process"],
    publications: "Método UTA, Desagregação de Preferências (Preference Disaggregation), Qualidade de Serviço, Apoio à Decisão Prescritivo.",
    bio: {
      pt: "Co-criador do influente método UTA (UTilité Additive) junto com Jacquet-Lagreze, pioneiro em técnicas de desagregação de preferências via programação linear.",
      en: "Co-developer of the influential UTA (UTilité Additive) method with Jacquet-Lagreze, pioneering preference disaggregation techniques via linear programming."
    },
    connections: "E. Jacquet-Lagreze, Roman Slowinski"
  }
];

const YOUNG_AUTHORS = [
  {
    name: "Eduarda Asfora Frej",
    orcid: "0000-0002-8356-9269",
    label: "MCDM Sorting / FITradeoff",
    labelClass: "young",
    affiliation: "CDSID, UFPE, Brazil",
    societies: ["MCDM Society", "SOBRAPO", "EWG-MCDA"],
    journals: ["European Journal of Operational Research", "Group Decision and Negotiation", "JMCDA"],
    publications: "FITradeoff Sorting (Classificação), FITradeoff Portfolio, Elicitação em Grupo, Sistemas de Apoio à Decisão Web.",
    bio: {
      pt: "Professora Associada da UFPE. Desenvolveu a extensão do FITradeoff para problemáticas de classificação (sorting), seleção de portfólio e decisões de grupo em ambiente Web.",
      en: "Associate Professor at UFPE. Developed extensions of FITradeoff for sorting problematics, portfolio selection, and group decisions within web-based contexts."
    },
    connections: "Adiel Teixeira de Almeida, Lucia Roselli"
  },
  {
    name: "Lucia Reis Peixoto Roselli",
    orcid: "0000-0002-5812-7013",
    label: "Neuroscience / Behavioral MCDA",
    labelClass: "young",
    affiliation: "CDSID, UFPE, Brazil",
    societies: ["MCDM Society", "SOBRAPO", "CDSID"],
    journals: ["EJOR", "Journal of Multi-Criteria Decision Analysis", "Group Decision and Negotiation"],
    publications: "MCDA Comportamental, Ferramentas de Neurociência em Tomada de Decisão (Eye-tracking, fMRI), Carga Cognitiva no FITradeoff.",
    bio: {
      pt: "Pesquisadora de destaque no CDSID. Conduz investigações pioneiras que integram ferramentas de neurociência (eye-tracking e fMRI) para estudar a carga cognitiva em DMs.",
      en: "Prominent CDSID researcher. Conducts pioneering investigations integrating neuroscience tools (eye-tracking, fMRI) to examine cognitive load in decision makers."
    },
    connections: "Adiel Teixeira de Almeida, Eduarda Frej"
  },
  {
    name: "Jafar Rezaei",
    orcid: "0000-0002-9907-7429",
    label: "Best Worst Method (BWM)",
    labelClass: "young",
    affiliation: "TU Delft, Netherlands",
    societies: ["MCDM Society", "EWG-MCDA", "INFORMS"],
    journals: ["European Journal of Operational Research", "Computers & Industrial Engineering", "Omega"],
    publications: "Best Worst Method (BWM), Best-Worst Tradeoff (BWT), Gerenciamento de Cadeias de Suprimentos, Logística Reversa.",
    bio: {
      pt: "Criador do Best Worst Method (BWM) em 2015 e do Best-Worst Tradeoff (BWT) em 2022. Líder internacional no estudo da consistência em julgamentos de preferência.",
      en: "Creator of the Best Worst Method (BWM) in 2015 and the Best-Worst Tradeoff (BWT) in 2022. Global leader in consistency research for preference elicitation."
    },
    connections: "Matteo Brunelli, Adiel Teixeira de Almeida"
  },
  {
    name: "Jônatas Araújo de Almeida",
    orcid: "0000-0002-1818-4903",
    label: "FITradeoff / DSS Systems",
    labelClass: "young",
    affiliation: "CDSID, UFPE, Brazil",
    societies: ["MCDM Society", "SOBRAPO", "CDSID"],
    journals: ["European Journal of Operational Research", "Annals of Operations Research", "DSS"],
    publications: "Sistemas de Apoio à Decisão (DSS) Web, FITradeoff Group, Seleção de Portfólio, Heurísticas de Decisão.",
    bio: {
      pt: "Pesquisador sênior do CDSID. Desenvolveu a infraestrutura de arquitetura computacional web do FITradeoff e suas extensões para decisões de portfólio e processos de grupo.",
      en: "Senior researcher at CDSID. Developed the web-based computer architecture of FITradeoff and its extensions for portfolio selection and group decision processes."
    },
    connections: "Adiel Teixeira de Almeida, Eduarda Frej"
  },
  {
    name: "Muhammet Deveci",
    orcid: "0000-0002-4514-4171",
    label: "Hybrid Fuzzy MCDM / Logistics",
    labelClass: "young",
    affiliation: "National Defence University, Turkey / Imperial College London, UK",
    societies: ["IEEE Computational Intelligence Society", "MCDM Society", "IFSA"],
    journals: ["Applied Soft Computing", "Engineering Applications of AI", "Information Sciences"],
    publications: "MCDM Baseado em Dados, Logística Verde, Fermatean Fuzzy, Tomada de Decisão Inteligente para Cidades Inteligentes.",
    bio: {
      pt: "Pesquisador altamente citado globalmente (Highly Cited Researcher). Desenvolve algoritmos avançados integrando inteligência computacional, dados e lógica fuzzy híbrida com MCDM.",
      en: "Highly Cited Researcher globally. Develops advanced algorithms integrating computational intelligence, data-driven systems, and hybrid fuzzy logic with MCDM."
    },
    connections: "Dragan Pamucar, Francisco Chiclana"
  },
  {
    name: "Dragan Pamučar",
    orcid: "0000-0001-8522-1926",
    label: "Hybrid MCDM / Logistics",
    labelClass: "young",
    affiliation: "University of Belgrade, Serbia / University of Portsmouth, UK",
    societies: ["MCDM Society", "EURO", "Serbian OR Society"],
    journals: ["EJOR", "Computers & Industrial Engineering", "Expert Systems with Applications"],
    publications: "Fuzzy MCDM Híbrido, Modelagem Neutrosófica, Algoritmos de Otimização e Roteamento, Decisão sob Extrema Incerteza.",
    bio: {
      pt: "Pesquisador altamente influente na área de métodos híbridos baseados em dados. Criador de extensões de ordenação e pesos de critérios aplicados a cadeias de suprimentos circulares.",
      en: "Highly cited and influential researcher in data-driven hybrid decision methods. Creator of ranking and objective weighting extensions applied to circular supply chains."
    },
    connections: "Muhammet Deveci, Jafar Rezaei"
  },
  {
    name: "Matteo Brunelli",
    orcid: "0000-0002-0941-8622",
    label: "Consistency / AHP & BWM",
    labelClass: "young",
    affiliation: "University of Trento, Italy",
    societies: ["EWG-MCDA", "MCDM Society", "INFORMS"],
    journals: ["EJOR", "Fuzzy Sets and Systems", "Journal of Multi-Criteria Decision Analysis"],
    publications: "Consistência em Comparações Pareadas, Teoria Matemática do AHP, Livros-texto de MCDA.",
    bio: {
      pt: "Especialista internacional na modelagem matemática da consistência e coerência de julgamentos ordinais e cardinais. Autor de livros fundamentais sobre AHP.",
      en: "International expert in mathematical modeling of consistency and coherence in ratio pairwise comparisons. Author of key introductory textbooks on AHP."
    },
    connections: "Jafar Rezaei, Roman Slowinski"
  },
  {
    name: "Francisco Chiclana",
    orcid: "0000-0003-3486-1919",
    label: "Fuzzy Preferences / Consensus",
    labelClass: "young",
    affiliation: "De Montfort University, Leicester, UK",
    societies: ["IEEE CIS", "MCDM Society", "IFSA"],
    journals: ["Information Sciences", "IEEE Transactions on Fuzzy Systems", "Applied Soft Computing"],
    publications: "Matrizes de Preferências Fuzzy, Modelos de Consenso em Grupo, Operadores de Agregação (OWA).",
    bio: {
      pt: "Autoridade amplamente citada no estudo de consistência de relações de preferências fuzzy e modelagens matemáticas de consenso para tomadas de decisão de grupos multi-especialistas.",
      en: "Highly cited authority in modeling consistency of fuzzy preference relations and mathematical consensus processes for multi-expert group decision aiding."
    },
    connections: "Muhammet Deveci, Enrique Herrera-Viedma"
  },
  {
    name: "Wojciech Sałabun",
    orcid: "0000-0001-6638-3482",
    label: "COMET Method / MCDA Validation",
    labelClass: "young",
    affiliation: "West Pomeranian University of Technology, Szczecin, Poland",
    societies: ["IEEE CIS", "EWG-MCDA", "MCDM Society"],
    journals: ["Applied Soft Computing", "Expert Systems with Applications", "Symmetry"],
    publications: "Método COMET (Characteristic Objects METhod), Validação de Métodos MCDA, Fenômeno da Reversão de Rank (Rank Reversal).",
    bio: {
      pt: "Desenvolvedor do método COMET (Characteristic Objects METhod), projetado para ser totalmente imune à reversão de ranking. Pesquisa consistência estrutural e validação de modelos de decisão.",
      en: "Developer of the COMET method (Characteristic Objects METhod), designed to be completely free of rank reversal. Researches structural consistency and validation in decision models."
    },
    connections: "Roman Slowinski, Dragan Pamucar"
  },
  {
    name: "Morteza Keshavarz-Ghorabaee",
    orcid: "0000-0002-5369-2313",
    label: "MEREC / Objective Weighting",
    labelClass: "young",
    affiliation: "Gonbad Kavous University, Iran",
    societies: ["MCDM Society", "EWG-MCDA"],
    journals: ["Symmetry", "Applied Soft Computing", "Computers & Industrial Engineering"],
    publications: "Método MEREC (Removal Effects of Criteria), Métodos EDAS e WASPAS, Algoritmos de Pesquisa Operacional baseados em dados.",
    bio: {
      pt: "Criador do método MEREC de cálculo de pesos estatísticos por efeito de remoção, e desenvolvedor de métodos de ordenação como EDAS, amplamente utilizados em logística sustentável.",
      en: "Creator of the MEREC objective weighting method based on criteria removal effects, and developer of ranking methods like EDAS, widely used in sustainable logistics."
    },
    connections: "Dragan Pamucar, Muhammet Deveci"
  },
  {
    name: "Zeshui Xu",
    orcid: "0000-0003-3490-6725",
    label: "Fuzzy MCDM / Information Aggregation",
    labelClass: "young",
    affiliation: "Sichuan University, China",
    societies: ["IEEE CIS (Fellow)", "IFSA (Fellow)", "MCDM Society"],
    journals: ["IEEE Transactions on Fuzzy Systems", "Information Sciences", "Knowledge-Based Systems"],
    publications: "Conjuntos Fuzzy Intuicionistas, Operadores de Agregação, Tomada de Decisão Fuzzy sob Incerteza Extrema.",
    bio: {
      pt: "Um dos cientistas mais influentes e citados do mundo na área de Fuzzy MCDM. Desenvolveu operadores matemáticos fundamentais de agregação para tomada de decisão.",
      en: "One of the most highly cited computer scientists globally in Fuzzy Logic and MCDM. Developed fundamental mathematical aggregation operators for decision models under uncertainty."
    },
    connections: "Francisco Chiclana, Muhammet Deveci"
  },
  {
    name: "Vladimir Šimić",
    orcid: "0000-0003-1025-4514",
    label: "Fuzzy MCDM / Circular Economy",
    labelClass: "young",
    affiliation: "University of Belgrade, Serbia",
    societies: ["MCDM Society", "EURO", "Serbian OR Society"],
    journals: ["EJOR", "Transportation Research Part E", "Computers & Industrial Engineering"],
    publications: "MCDM Híbrido, Otimização de Transporte, Reciclagem de Veículos em Fim de Vida, Logística Circular.",
    bio: {
      pt: "Pesquisador altamente citado focado na aplicação prática de métodos híbridos multicritério para problemas de sustentabilidade, transporte ecológico e economia circular.",
      en: "Highly cited researcher focusing on the practical application of hybrid multicriteria methods to problems of sustainability, green transportation, and circular economy."
    },
    connections: "Dragan Pamucar, Muhammet Deveci"
  }
];

// ==================== 4. JOURNAL STATS DATA ====================
const JOURNALS_DATA = [
  { name: "European Journal of Operational Research (EJOR)", publisher: "Elsevier", if: "6.0", sjr: "2.239 (Q1)", hindex: "270" },
  { name: "Decision Support Systems (DSS)", publisher: "Elsevier", if: "6.8", sjr: "2.366 (Q1)", hindex: "170" },
  { name: "Group Decision and Negotiation (GDN)", publisher: "Springer", if: "2.5", sjr: "0.641 (Q2)", hindex: "70" },
  { name: "Journal of Multi-Criteria Decision Analysis (JMCDA)", publisher: "Wiley", if: "2.4", sjr: "0.581 (Q2)", hindex: "45" },
  { name: "Computers & Industrial Engineering (C&IE)", publisher: "Elsevier", if: "7.0", sjr: "1.854 (Q1)", hindex: "160" },
  { name: "Annals of Operations Research (ANOR)", publisher: "Springer", if: "4.8", sjr: "1.150 (Q1)", hindex: "120" },
  { name: "Pesquisa Operacional", publisher: "SOBRAPO", if: "1.2", sjr: "0.220 (Q3)", hindex: "28" }
];

const COMMUNITIES_DATA = [
  {
    name: "MCDM Society",
    desc: {
      pt: "Sociedade Científica Internacional de Tomada de Decisão Multicritério. Organiza a conferência bienal MCDM desde a década de 1970.",
      en: "International Society on Multiple Criteria Decision Making. Sponsors the premier biennial MCDM conferences since the 1970s."
    },
    link: "http://www.mcdmsociety.org/"
  },
  {
    name: "EWG-MCDA",
    desc: {
      pt: "EURO Working Group on Multicriteria Decision Aiding. O mais ativo grupo europeu, fundado por Bernard Roy, com reuniões técnicas semestrais.",
      en: "EURO Working Group on Multicriteria Decision Aiding. Highly active European research community founded by Bernard Roy, hosting biannual meetings."
    },
    link: "https://www.euro-online.org/web/ewg/1/ewg-mcda"
  },
  {
    name: "CDSID (UFPE)",
    desc: {
      pt: "Centro de Desenvolvimento de Sistemas de Informação e Decisão. Principal hub de pesquisa em MCDA da América Latina, focado em FITradeoff.",
      en: "Center for Decision Systems and Information Development. Premier MCDA research hub in Latin America, focusing on FITradeoff applications."
    },
    link: "https://cdsid.org.br/"
  },
  {
    name: "INFORMS MCDM Section",
    desc: {
      pt: "Seção de MCDM do Institute for Operations Research and the Management Sciences (EUA), focada em otimização multiobjetivo.",
      en: "MCDM Section within the Institute for Operations Research and the Management Sciences (USA), focusing on multiobjective optimization."
    },
    link: "https://connect.informs.org/multiple-criteria-decision-making/home"
  },
  {
    name: "SOBRAPO",
    desc: {
      pt: "Sociedade Brasileira de Pesquisa Operacional. Promove anualmente o SBPO, onde o MCDA representa um dos maiores grupos de trabalhos.",
      en: "Brazilian Operational Research Society. Organizes the annual SBPO conference, where MCDA tracks represent a major technical division."
    },
    link: "https://www.sobrapo.org.br/"
  },
  {
    name: "IEEE Computational Intelligence Society (IEEE CIS)",
    desc: {
      pt: "Sociedade focada em inteligência computacional, redes neurais e lógica fuzzy aplicada a dados em sistemas complexos de tomada de decisão.",
      en: "Society focusing on computational intelligence, neural networks, and fuzzy logic applied to data systems in complex decision making."
    },
    link: "https://cis.ieee.org/"
  },
  {
    name: "International Rough Set Society (IRSS)",
    desc: {
      pt: "Sociedade científica internacional que desenvolve e aplica a teoria de conjuntos rough (incluindo a abordagem baseada em dominância DRSA) à inteligência artificial e mineração de dados para apoio à decisão.",
      en: "International scientific society promoting the research and application of rough set theory (including DRSA) to AI and data mining for decision support."
    },
    link: "https://www.roughsets.org/"
  },
  {
    name: "INFORMS Section on Data Mining",
    desc: {
      pt: "Seção focada em mineração de dados, analytics e aprendizado de máquina aplicados a problemas de pesquisa operacional e multicritério.",
      en: "Section focusing on data mining, analytics, and machine learning applied to operations research and multicriteria decision problems."
    },
    link: "https://connect.informs.org/datamining/home"
  }
];

// ==================== 4.5 TIMELINE DATA ====================
const TIMELINE_DATA = [
  { year: "1772", title: { pt: "Álgebra Moral de Benjamin Franklin", en: "Benjamin Franklin's Moral Algebra" }, desc: { pt: "Primeira menção documentada a um tradeoff multicritério em carta a Joseph Priestley, onde lista prós e contras e risca os que se anulam.", en: "First documented multicriteria tradeoff method in a letter to Joseph Priestley, listing pros and cons and crossing out balanced values." } },
  { year: "1785", title: { pt: "Paradoxo de Condorcet", en: "Condorcet's Voting Paradox" }, desc: { pt: "Introdutor das inconsistências em preferências de grupo (relação de maioria cíclica), base para os métodos outranking modernos.", en: "Pioneered group preference inconsistencies (cyclical majorities), laying foundations for modern outranking methods." } },
  { year: "1896", title: { pt: "Eficiência de Pareto", en: "Pareto Optimality / Efficiency" }, desc: { pt: "Vilfredo Pareto introduz a noção de soluções não-dominadas, base fundamental para a otimização multiobjetivo.", en: "Vilfredo Pareto introduces non-dominated solutions, the mathematical core of multiobjective optimization." } },
  { year: "1944", title: { pt: "Teoria da Utilidade Esperada", en: "Expected Utility Theory" }, desc: { pt: "von Neumann e Morgenstern publicam as bases axiomáticas de utilidade, que depois serviriam de fundação para a MAUT.", en: "von Neumann and Morgenstern publish axiomatic utility foundations, later supporting MAUT development." } },
  { year: "1951", title: { pt: "Teorema da Impossibilidade de Arrow", en: "Arrow's Impossibility Theorem" }, desc: { pt: "Kenneth Arrow demonstra que não há método de decisão em grupo perfeito sob axiomas razoáveis. Koopmans formaliza vetores de eficiência.", en: "Kenneth Arrow proves no perfect group decision rule exists under reasonable axioms. Koopmans formalizes vector efficiency." } },
  { year: "1961", title: { pt: "Programação por Metas (Goal Programming)", en: "Goal Programming (Charnes & Cooper)" }, desc: { pt: "Charnes e Cooper propõem a programação linear por metas, o primeiro método de otimização multiobjetivo em PO.", en: "Charnes and Cooper propose goal programming, the first operational multiobjective optimization method." } },
  { year: "1968", title: { pt: "Nascimento da Escola Francesa: ELECTRE I", en: "ELECTRE I & The French School" }, desc: { pt: "Bernard Roy propõe o ELECTRE I, introduzindo a sobreclassificação e marcando o nascimento oficial do Apoio Multicritério à Decisão (MCDA).", en: "Bernard Roy proposes ELECTRE I, introducing the outranking paradigm and formally establishing MCDA." } },
  { year: "1976", title: { pt: "Consolidação da MAUT: Keeney & Raiffa", en: "MAUT Consolidation: Keeney & Raiffa" }, desc: { pt: "Publicação do livro clássico 'Decisions with Multiple Objectives', consolidando a Teoria da Utilidade Multiatributo.", en: "Publication of 'Decisions with Multiple Objectives', establishing Multi-Attribute Utility Theory (MAUT)." } },
  { year: "1977", title: { pt: "Framework SMART: Ward Edwards", en: "SMART Framework: Ward Edwards" }, desc: { pt: "Apresentação do SMART (Simple Multi-Attribute Rating Technique), simplificando a elicitação no contexto comportamental.", en: "Introduction of SMART, simplifying preference elicitation in behavioral contexts." } },
  { year: "1978", title: { pt: "Análise Envoltória de Dados (DEA)", en: "Data Envelopment Analysis (DEA)" }, desc: { pt: "Charnes, Cooper e Rhodes propõem o modelo DEA de programação linear, permitindo avaliar a eficiência de unidades sem pesos subjetivos.", en: "Charnes, Cooper, and Rhodes publish the Data Envelopment Analysis (DEA) linear programming model to measure relative efficiency without subjective weights." } },
  { year: "1980", title: { pt: "Método AHP: Thomas Saaty", en: "AHP Method: Thomas Saaty" }, desc: { pt: "Saaty publica o Analytic Hierarchy Process (AHP), revolucionando a área com matrizes de comparação par a par.", en: "Saaty publishes the Analytic Hierarchy Process (AHP), using eigenvectors for pairwise comparisons." } },
  { year: "1981", title: { pt: "Método TOPSIS: Hwang & Yoon", en: "TOPSIS Method: Hwang & Yoon" }, desc: { pt: "Hwang e Yoon propõem o TOPSIS, método baseado na menor distância à solução ideal e maior distância à anti-ideal.", en: "Hwang and Yoon propose TOPSIS, selecting alternatives based on closest distance to ideal and furthest from anti-ideal." } },
  { year: "1982", title: { pt: "Método PROMETHEE & UTA", en: "PROMETHEE & UTA Methods" }, desc: { pt: "Brans introduz o PROMETHEE de fluxos de sobreclassificação. Jacquet-Lagreze e Siskos criam o UTA para aprender funções de utilidade.", en: "Brans introduces PROMETHEE outranking flows. Jacquet-Lagreze and Siskos develop UTA for additive utility learning." } },
  { year: "1992", title: { pt: "Pensamento Focado em Valores (VFT)", en: "Value-Focused Thinking" }, desc: { pt: "Ralph Keeney publica o conceito de VFT, mudando o foco da escolha de alternativas pré-existentes para a estruturação de valores do decisor.", en: "Ralph Keeney publishes VFT, shifting focus from choosing alternatives to structuring core decision values." } },
  { year: "1995", title: { pt: "Método CRITIC: Diakoulaki et al.", en: "CRITIC Method: Diakoulaki et al." }, desc: { pt: "Apresentação do CRITIC para cálculo de pesos objetivos integrando desvios-padrão e correlações lineares entre critérios.", en: "Introduction of the CRITIC method for calculating objective criteria weights based on standard deviations and linear correlations." } },
  { year: "1998", title: { pt: "SMAA: Decisão sob Altíssima Incerteza", en: "SMAA: Deciding under Uncertainty" }, desc: { pt: "Lahdelma et al. publicam o Stochastic Multicriteria Acceptability Analysis (SMAA), usando simulação estocástica de pesos.", en: "Lahdelma et al. publish SMAA, utilizing Monte Carlo simulation for decision aiding with imprecise data." } },
  { year: "2001", title: { pt: "Abordagem DRSA: Greco, Matarazzo & Slowinski", en: "DRSA Approach: Greco, Matarazzo & Slowinski" }, desc: { pt: "Introdução da Teoria dos Conjuntos Rough Dominada (DRSA) para extração de regras de decisão lógicas em problemas de classificação e ordenação.", en: "Introduction of Dominance-based Rough Set Approach (DRSA) for extracting logical decision rules in sorting and ranking." } },
  { year: "2015", title: { pt: "Best Worst Method (BWM): Jafar Rezaei", en: "Best Worst Method (BWM): Jafar Rezaei" }, desc: { pt: "Rezaei publica o BWM, reduzindo a complexidade de comparações pareadas frente ao AHP clássico através de análises melhor-pior.", en: "Rezaei publishes BWM, reducing pairwise comparison complexity compared to traditional AHP matrices." } },
  { year: "2016", title: { pt: "Elicitação Flexível: FITradeoff", en: "Flexible Tradeoff Elicitation: FITradeoff" }, desc: { pt: "Adiel T. de Almeida e equipe do CDSID criam o FITradeoff, revolucionando MAVT com elicitação interativa baseada em programação linear.", en: "Adiel T. de Almeida and the CDSID team introduce FITradeoff, combining MAVT with linear programming for flexible weights." } },
  { year: "2021", title: { pt: "Método MEREC", en: "MEREC Method" }, desc: { pt: "Keshavarz-Ghorabaee et al. introduzem o MEREC para cálculo de pesos estatísticos através dos efeitos de remoção de critérios.", en: "Keshavarz-Ghorabaee et al. propose the MEREC method for objective weighting based on the removal effects of criteria." } },
  { year: "2022", title: { pt: "Best-Worst Tradeoff (BWT)", en: "Best-Worst Tradeoff (BWT)" }, desc: { pt: "Liang, Brunelli e Rezaei criam o BWT para mitigar o viés de ancoragem em pesos usando ranges de atributos no Best Worst.", en: "Liang, Brunelli, and Rezaei create BWT to resolve anchoring bias in BWM by incorporating attribute scales." } },
  { year: "2023+", title: { pt: "Fronteiras Comportamentais e Neuro-MCDA", en: "Behavioral Frontiers & Neuro-MCDA" }, desc: { pt: "Adoção de eye-tracking e fMRI por Roselli et al. para estudar a cognição humana. Modelos combinando IA e Machine Learning explicáveis (XAI) com MCDA.", en: "Adoção de eye-tracking e fMRI por Roselli et al. para estudar a cognição humana. Modelos combinando IA e Machine Learning explicáveis (XAI) com MCDA." } }
];

// ==================== 4.6 CURATED VIDEO CLASSES ====================
const VIDEO_CLASSES = [
  {
    id: "class-mcdm-intro",
    title: { pt: "Introdução aos Métodos Multicritério (MCDM/MCDA)", en: "Introduction to Multicriteria Decision Methods" },
    instructor: "CDSID / UFPE",
    duration: "24 min",
    video: "https://www.youtube.com/embed/U3l0rV7gK0I",
    desc: {
      pt: "Aula introdutória sobre as bases do apoio multicritério à decisão, abordando a diferença entre alternativas, critérios e o papel do decisor.",
      en: "Introductory lecture on the foundations of multicriteria decision support, explaining alternatives, criteria, and the decision maker's role."
    }
  },
  {
    id: "class-fitradeoff-choice",
    title: { pt: "Tutorial FITradeoff: Problemática de Escolha (Choice)", en: "FITradeoff Tutorial: Choice Problematic" },
    instructor: "Adiel Teixeira de Almeida (CDSID/UFPE)",
    duration: "15 min",
    video: "https://www.youtube.com/embed/5a6q-tU3KzM",
    desc: {
      pt: "Tutorial oficial demonstrando o uso do FITradeoff para selecionar a melhor alternativa (Choice P.alpha), exemplificando a redução de carga cognitiva.",
      en: "Official tutorial demonstrating how to use FITradeoff to select the single best alternative, illustrating the reduction in cognitive load."
    }
  },
  {
    id: "class-fitradeoff-sorting",
    title: { pt: "Tutorial FITradeoff: Classificação (Sorting)", en: "FITradeoff Tutorial: Sorting Problematic" },
    instructor: "Eduarda Asfora Frej (CDSID/UFPE)",
    duration: "12 min",
    video: "https://www.youtube.com/embed/3vM-Gv43Zro",
    desc: {
      pt: "Aula prática sobre a aplicação do FITradeoff na problemática de classificação (Sorting P.gamma) para alocar alternativas em classes ordenadas.",
      en: "Practical class on applying FITradeoff to sorting problematics, categorizing alternatives into pre-defined ordered classes."
    }
  },
  {
    id: "class-fitradeoff-portfolio",
    title: { pt: "Tutorial FITradeoff: Portfólio", en: "FITradeoff Tutorial: Portfolio Selection" },
    instructor: "Adiel T. de Almeida / Eduarda Frej (CDSID)",
    duration: "18 min",
    video: "https://www.youtube.com/embed/i0LlzxP6qR0",
    desc: {
      pt: "Explicação detalhada sobre a extensão do FITradeoff para seleção de portfólio (Portfolio P.delta) sob restrições de recursos.",
      en: "Detailed lecture on the FITradeoff extension for portfolio selection under budgetary or resource constraints."
    }
  },
  {
    id: "class-bwm",
    title: { pt: "Tutorial Best-Worst Method (BWM) no Excel", en: "Best-Worst Method (BWM) Excel Tutorial" },
    instructor: "ResearchHUB / Jafar Rezaei",
    duration: "14 min",
    video: "https://www.youtube.com/embed/s2v386eK2wQ",
    desc: {
      pt: "Guia prático ensinando a formular e resolver o Best-Worst Method para cálculo de pesos utilizando o Excel Solver.",
      en: "Step-by-step tutorial on formulating and solving the Best-Worst Method to calculate criteria weights using Excel Solver."
    }
  },
  {
    id: "class-ahp",
    title: { pt: "AHP: Tomada de Decisão Passo a Passo", en: "AHP: Step-by-Step Decision Making" },
    instructor: "IIT Roorkee / Academic Lectures",
    duration: "28 min",
    video: "https://www.youtube.com/embed/Jt1a7S3L8qg",
    desc: {
      pt: "Videoaula acadêmica explicando o cálculo do autovetor principal, matrizes de comparação par a par e a taxa de consistência (CR) no AHP.",
      en: "Academic lecture explaining the calculation of the principal eigenvector, pairwise comparison matrices, and the consistency ratio (CR) in AHP."
    }
  }
];

// ==================== 5. APPLICATION STATE ====================
const state = {
  currentLanguage: localStorage.getItem('mcdm_roadmap_lang') || 'pt',
  currentTheme: localStorage.getItem('mcdm_roadmap_theme') || 'dark',
  currentView: 'roadmap',
  currentUser: JSON.parse(localStorage.getItem('mcdm_roadmap_user')) || null,
  userProgress: {}, // maps nodeId -> status
  selectedNodeId: null
};

// API Endpoint prefix
const API_BASE = window.location.origin;

// ==================== 6. INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Setup theme and language visual status
  document.documentElement.setAttribute('data-theme', state.currentTheme);
  updateThemeIcon();
  updateLangLabel();
  
  // Set up auth state UI
  updateAuthUI();

  // Load user progress
  loadProgress();

  // Render static lists
  renderAuthors();
  renderJournals();
  renderCommunities();
  renderTimeline();
  renderClasses();
  renderRoadmap();

  // Fetch literature data
  fetchArticles();

  // Event Listeners
  setupEventListeners();

  // Translate entire DOM
  translatePage();
}

// ==================== 7. EVENT LISTENERS ====================
function setupEventListeners() {
  // Navigation View Switching
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const view = e.currentTarget.getAttribute('data-view');
      switchView(view);
    });
  });

  // Theme Toggler
  document.getElementById('theme-toggle-btn').addEventListener('click', () => {
    state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.currentTheme);
    localStorage.setItem('mcdm_roadmap_theme', state.currentTheme);
    updateThemeIcon();
  });

  // Language Toggler
  document.getElementById('lang-toggle-btn').addEventListener('click', () => {
    state.currentLanguage = state.currentLanguage === 'pt' ? 'en' : 'pt';
    localStorage.setItem('mcdm_roadmap_lang', state.currentLanguage);
    updateLangLabel();
    translatePage();
    renderRoadmap(); // re-render roadmap titles and text
    renderTimeline(); // re-render timeline translation
    renderClasses(); // re-render classes translation
    renderAuthors();
    renderCommunities();
    
    // update drawer contents if open
    if (state.selectedNodeId) {
      openDrawer(state.selectedNodeId);
    }
  });

  // Sidebar Login Button
  document.getElementById('sidebar-login-btn').addEventListener('click', () => {
    openAuthModal(false);
  });

  // Modal Close
  document.getElementById('modal-close-btn').addEventListener('click', closeAuthModal);
  document.getElementById('auth-modal-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'auth-modal-backdrop') closeAuthModal();
  });

  // Auth toggle links (Register <-> Login)
  document.getElementById('auth-toggle-link').addEventListener('click', () => {
    const isRegister = document.getElementById('auth-submit-btn').getAttribute('data-action') === 'register';
    openAuthModal(!isRegister);
  });

  // Auth Form Submission
  document.getElementById('auth-form').addEventListener('submit', handleAuthSubmit);

  // Logout Button
  document.getElementById('logout-btn').addEventListener('click', handleLogout);

  // Close Drawer
  document.getElementById('drawer-close-btn').addEventListener('click', closeDrawer);
  document.getElementById('drawer-backdrop').addEventListener('click', closeDrawer);

  // Drawer status selection buttons
  document.querySelectorAll('.status-opt-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const status = e.currentTarget.getAttribute('data-status');
      if (state.selectedNodeId) {
        await saveNodeProgress(state.selectedNodeId, status);
      }
    });
  });

  // Manual sync button
  document.getElementById('trigger-sync-btn').addEventListener('click', triggerManualSync);
}

// ==================== 8. CORE FUNCTIONS ====================

// Switch SPA View
function switchView(viewName) {
  // Update nav UI
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  let navId = 'nav-roadmap';
  if (viewName === 'timeline') navId = 'nav-timeline';
  else if (viewName === 'classes') navId = 'nav-classes';
  else if (viewName === 'authors') navId = 'nav-authors';
  else if (viewName === 'journals') navId = 'nav-journals';
  else if (viewName === 'sync') navId = 'nav-sync';
  
  document.getElementById(navId).classList.add('active');

  // Update View Elements
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });

  let secId = 'roadmap-view';
  if (viewName === 'timeline') secId = 'timeline-view';
  else if (viewName === 'classes') secId = 'classes-view';
  else if (viewName === 'authors') secId = 'authors-view';
  else if (viewName === 'journals') secId = 'journals-view';
  else if (viewName === 'sync') secId = 'sync-view';

  document.getElementById(secId).classList.add('active');
  state.currentView = viewName;
}

// Translations logic
function translatePage() {
  const lang = state.currentLanguage;
  
  // Update standard data-key DOM elements
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.textContent = TRANSLATIONS[lang][key];
    }
  });

  // Update static placeholder inputs
  const emailInput = document.getElementById('auth-email');
  if (emailInput) {
    emailInput.placeholder = lang === 'pt' ? 'seu.email@exemplo.com' : 'your.email@example.com';
  }

  // Update dynamic page headers
  document.getElementById('main-title').textContent = TRANSLATIONS[lang].title_roadmap;
  document.getElementById('main-subtitle').textContent = TRANSLATIONS[lang].subtitle_roadmap;
}

function updateThemeIcon() {
  const icon = document.getElementById('theme-icon');
  if (state.currentTheme === 'dark') {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

function updateLangLabel() {
  document.getElementById('lang-label').textContent = state.currentLanguage === 'pt' ? 'EN' : 'PT';
}

// Toast Alert Notification
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark';
  toast.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${message}</span>`;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// ==================== 9. ROADMAP RENDERING ====================
function renderRoadmap() {
  const flowContainer = document.getElementById('roadmap-flow-container');
  flowContainer.innerHTML = '';

  const levels = [1, 2, 3];
  levels.forEach(levelNum => {
    const levelGroup = document.createElement('div');
    levelGroup.className = 'roadmap-level-group';

    // Header info
    const header = document.createElement('div');
    header.className = 'level-header';

    const levelTitle = document.createElement('div');
    levelTitle.className = 'level-title';
    
    const badge = document.createElement('span');
    badge.className = 'level-badge';
    badge.textContent = `L${levelNum}`;
    
    const h3 = document.createElement('h3');
    h3.textContent = TRANSLATIONS[state.currentLanguage][`level_${levelNum}`];

    levelTitle.appendChild(badge);
    levelTitle.appendChild(h3);

    const progressTracker = document.createElement('span');
    progressTracker.className = 'level-progress-tracker';
    progressTracker.id = `level-${levelNum}-progress-lbl`;
    
    header.appendChild(levelTitle);
    header.appendChild(progressTracker);
    levelGroup.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'roadmap-grid';

    // Filter nodes for this level
    const nodes = ROADMAP_NODES.filter(n => n.level === levelNum);

    // Level 2 special grouping logic to separate utility methods and outranking methods visually
    if (levelNum === 2) {
      // 1. Core General Paradigm Node
      const generalNode = nodes.find(n => n.id === 'pref-vs-data-driven');
      if (generalNode) {
        grid.appendChild(createNodeCard(generalNode));
      }

      // 2. Complete Info Sub-Group
      const utilityGroup = document.createElement('div');
      utilityGroup.className = 'methods-subgroup';
      utilityGroup.innerHTML = `<h4 class="subgroup-title">${state.currentLanguage === 'pt' ? 'Métodos de Informação Completa (Elicitação por Utilidade/Razão/Best-Worst/Distância)' : 'Complete Information Methods (Utility/Ratio/Best-Worst/Distance Elicitation)'}</h4>`;
      
      const utilityGrid = document.createElement('div');
      utilityGrid.className = 'roadmap-grid';
      
      nodes.filter(n => n.category === 'Complete Info Methods').forEach(node => {
        utilityGrid.appendChild(createNodeCard(node));
      });
      utilityGroup.appendChild(utilityGrid);
      grid.appendChild(utilityGroup);

      // 3. Outranking Sub-Group
      const outrankingGroup = document.createElement('div');
      outrankingGroup.className = 'methods-subgroup';
      outrankingGroup.innerHTML = `<h4 class="subgroup-title">${state.currentLanguage === 'pt' ? 'Métodos de Sobreclassificação (Escola Europeia)' : 'Outranking Methods (European School)'}</h4>`;
      
      const outrankingGrid = document.createElement('div');
      outrankingGrid.className = 'roadmap-grid';
      
      nodes.filter(n => n.category === 'Outranking Methods').forEach(node => {
        outrankingGrid.appendChild(createNodeCard(node));
      });
      outrankingGroup.appendChild(outrankingGrid);
      grid.appendChild(outrankingGroup);

      // 4. Data-Driven Methods Sub-Group
      const dataDrivenGroup = document.createElement('div');
      dataDrivenGroup.className = 'methods-subgroup';
      dataDrivenGroup.innerHTML = `<h4 class="subgroup-title">${state.currentLanguage === 'pt' ? 'Métodos e Pesquisa Baseada em Dados (Data-Driven MCDA)' : 'Data-Driven & Objective Weighting Methods (Data-Driven MCDA)'}</h4>`;
      
      const dataDrivenGrid = document.createElement('div');
      dataDrivenGrid.className = 'roadmap-grid';
      
      nodes.filter(n => n.category === 'Data-Driven Methods').forEach(node => {
        dataDrivenGrid.appendChild(createNodeCard(node));
      });
      dataDrivenGroup.appendChild(dataDrivenGrid);
      grid.appendChild(dataDrivenGroup);

    } else {
      // General rendering for level 1 & 3
      nodes.forEach(node => {
        grid.appendChild(createNodeCard(node));
      });
    }

    levelGroup.appendChild(grid);
    flowContainer.appendChild(levelGroup);
  });

  updateProgressVisuals();
}

function createNodeCard(node) {
  const card = document.createElement('div');
  const status = state.userProgress[node.id] || 'not_started';
  card.className = `roadmap-node status-${status}`;
  card.setAttribute('data-node-id', node.id);
  
  const lang = state.currentLanguage;
  
  card.innerHTML = `
    <div class="node-category">${node.category}</div>
    <div class="node-title">${node.title[lang]}</div>
    <div class="node-description">${node.desc[lang]}</div>
    <div class="node-footer">
      <span class="node-badge node-badge-${status === 'completed' ? 'co' : status === 'in_progress' ? 'ip' : 'ns'}">
        ${TRANSLATIONS[lang]['btn_' + (status === 'completed' ? 'co' : status === 'in_progress' ? 'ip' : 'ns')]}
      </span>
      <span class="node-authors-summary">${node.authors}</span>
    </div>
  `;

  card.addEventListener('click', () => {
    openDrawer(node.id);
  });

  return card;
}

// Refresh node statuses and calculate aggregate progress
function updateProgressVisuals() {
  let totalNodes = ROADMAP_NODES.length;
  let completedCount = 0;

  ROADMAP_NODES.forEach(node => {
    const status = state.userProgress[node.id] || 'not_started';
    const card = document.querySelector(`.roadmap-node[data-node-id="${node.id}"]`);
    if (card) {
      card.className = `roadmap-node status-${status}`;
      
      const badge = card.querySelector('.node-badge');
      if (badge) {
        badge.className = `node-badge node-badge-${status === 'completed' ? 'co' : status === 'in_progress' ? 'ip' : 'ns'}`;
        badge.textContent = TRANSLATIONS[state.currentLanguage]['btn_' + (status === 'completed' ? 'co' : status === 'in_progress' ? 'ip' : 'ns')];
      }
    }
    if (status === 'completed') completedCount++;
  });

  // Calculate percentages per Level
  for (let lvl = 1; lvl <= 3; lvl++) {
    const lvlNodes = ROADMAP_NODES.filter(n => n.level === lvl);
    const lvlCompleted = lvlNodes.filter(n => (state.userProgress[n.id] || 'not_started') === 'completed').length;
    const lbl = document.getElementById(`level-${lvl}-progress-lbl`);
    if (lbl) {
      const pct = lvlNodes.length > 0 ? Math.round((lvlCompleted / lvlNodes.length) * 100) : 0;
      lbl.textContent = `${pct}% (${lvlCompleted}/${lvlNodes.length})`;
    }
  }

  // Update profile widget percentage
  const overallPct = totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;
  const progressPercentText = document.getElementById('user-progress-percent');
  if (progressPercentText) {
    progressPercentText.textContent = `${state.currentLanguage === 'pt' ? 'Progresso' : 'Progress'}: ${overallPct}% (${completedCount}/${totalNodes})`;
  }
}

// ==================== 9.5 TIMELINE RENDERING ====================
function renderTimeline() {
  const container = document.getElementById('timeline-flow');
  container.innerHTML = '';

  const lang = state.currentLanguage;

  TIMELINE_DATA.forEach((milestone, idx) => {
    const isLeft = idx % 2 === 0;
    const item = document.createElement('div');
    item.className = `timeline-item ${isLeft ? 'left-item' : 'right-item'}`;
    
    item.innerHTML = `
      <div class="timeline-card">
        <div class="timeline-year">${milestone.year}</div>
        <div class="timeline-milestone">${milestone.title[lang]}</div>
        <div class="timeline-desc">${milestone.desc[lang]}</div>
      </div>
    `;
    container.appendChild(item);
  });
}

// ==================== 9.6 VIDEO CLASSES RENDERING ====================
function renderClasses() {
  const grid = document.getElementById('classes-grid-container');
  grid.innerHTML = '';

  const lang = state.currentLanguage;

  VIDEO_CLASSES.forEach(c => {
    const card = document.createElement('div');
    card.className = 'class-card';
    card.innerHTML = `
      <div class="video-iframe-container">
        <iframe src="${c.video}" allowfullscreen></iframe>
      </div>
      <div class="class-card-title">${c.title[lang]}</div>
      <div class="class-card-meta">
        <span><i class="fa-solid fa-chalkboard-user"></i> ${c.instructor}</span>
        <span><i class="fa-solid fa-clock"></i> ${c.duration}</span>
      </div>
      <div class="class-card-desc">${c.desc[lang]}</div>
    `;
    grid.appendChild(card);
  });
}

// ==================== 10. DRAWER DISPLAY ====================
function openDrawer(nodeId) {
  const node = ROADMAP_NODES.find(n => n.id === nodeId);
  if (!node) return;

  state.selectedNodeId = nodeId;
  const lang = state.currentLanguage;

  document.getElementById('drawer-title').textContent = node.title[lang];
  document.getElementById('drawer-level-badge').textContent = `L${node.level} - ${node.category}`;
  document.getElementById('drawer-branch-badge').textContent = node.level >= 2 ? (node.id.includes('data-driven') ? 'Data-Driven' : 'Preference-Driven') : 'General';
  document.getElementById('drawer-info-badge').textContent = node.category.includes('Complete') ? 'Complete Info' : node.category.includes('Partial') ? 'Partial Info' : 'Core Concept';
  document.getElementById('drawer-description').textContent = node.desc[lang];
  
  // Equation
  if (node.equation) {
    document.getElementById('drawer-formula-section').style.display = 'block';
    document.getElementById('drawer-equation').textContent = node.equation;
  } else {
    document.getElementById('drawer-formula-section').style.display = 'none';
  }

  // Video Lecture inside Drawer
  const videoSection = document.getElementById('drawer-video-section');
  const videoContainer = document.getElementById('drawer-video-container');
  if (node.video) {
    videoSection.style.display = 'block';
    videoContainer.innerHTML = `<iframe src="${node.video}" allowfullscreen></iframe>`;
  } else {
    videoSection.style.display = 'none';
    videoContainer.innerHTML = '';
  }

  // Key authors
  document.getElementById('drawer-authors').textContent = node.authors;

  // Readings
  const readingsList = document.getElementById('drawer-readings-list');
  readingsList.innerHTML = '';
  node.readings.forEach(read => {
    const li = document.createElement('li');
    li.innerHTML = `<a class="reading-link" href="${read.link}" target="_blank"><i class="fa-solid fa-file-pdf"></i> ${read.name}</a>`;
    readingsList.appendChild(li);
  });

  // Load and render node-specific research articles from OpenAlex
  const researchSection = document.getElementById('drawer-research-section');
  const researchList = document.getElementById('drawer-research-list');
  researchSection.style.display = 'none';
  researchList.innerHTML = `<li style="color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> ${lang === 'pt' ? 'Carregando pesquisas...' : 'Loading research...'}</li>`;

  fetch(`${API_BASE}/api/articles?nodeId=${nodeId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success && Array.isArray(data.articles) && data.articles.length > 0) {
        researchSection.style.display = 'block';
        researchList.innerHTML = '';
        data.articles.forEach(art => {
          const li = document.createElement('li');
          
          let authorsStr = Array.isArray(art.authors) ? art.authors.slice(0, 3).join(', ') : 'Unknown';
          if (Array.isArray(art.authors) && art.authors.length > 3) authorsStr += ' et al.';

          li.innerHTML = `
            <a class="reading-link" href="${art.link}" target="_blank" style="display: block; margin-bottom: 0.25rem;">
              <i class="fa-solid fa-graduation-cap"></i> <strong>${art.title}</strong>
            </a>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-left: 1.25rem; margin-bottom: 0.5rem;">
              <span>${authorsStr} (${art.year})</span> &bull; 
              <span style="font-style: italic;">${art.journal}</span> &bull;
              <span><i class="fa-solid fa-quote-left" style="font-size: 0.65rem;"></i> Citações: ${art.citation_count}</span>
            </div>
          `;
          researchList.appendChild(li);
        });
      } else {
        researchSection.style.display = 'none';
        researchList.innerHTML = '';
      }
    })
    .catch(err => {
      console.error('Error loading node research:', err);
      researchSection.style.display = 'none';
      researchList.innerHTML = '';
    });

  // Set active progress button
  const currentStatus = state.userProgress[nodeId] || 'not_started';
  document.querySelectorAll('.status-opt-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-status') === currentStatus) {
      btn.classList.add('active');
    }
  });

  // Open HTML classes
  document.getElementById('drawer').classList.add('active');
  document.getElementById('drawer-backdrop').classList.add('active');
}

function closeDrawer() {
  document.getElementById('drawer').classList.remove('active');
  document.getElementById('drawer-backdrop').classList.remove('active');
  
  // Dismount video player to stop playback
  const videoContainer = document.getElementById('drawer-video-container');
  if (videoContainer) {
    videoContainer.innerHTML = '';
  }
  
  state.selectedNodeId = null;
}

async function saveNodeProgress(nodeId, status) {
  // Update state locally
  state.userProgress[nodeId] = status;
  updateProgressVisuals();

  // Highlight selected button
  document.querySelectorAll('.status-opt-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-status') === status) {
      btn.classList.add('active');
    }
  });

  // API save if logged in
  if (state.currentUser) {
    try {
      const response = await fetch(`${API_BASE}/api/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': state.currentUser.id
        },
        body: JSON.stringify({ nodeId, status })
      });
      const data = await response.json();
      if (!data.success) {
        console.warn('API progress save warning:', data.error);
      }
    } catch (e) {
      console.error('Failed to sync progress to database:', e);
    }
  } else {
    // Save to guest localStorage progress
    localStorage.setItem(`mcdm_progress_guest_${nodeId}`, status);
  }

  showToast(TRANSLATIONS[state.currentLanguage].toast_progress_saved, 'success');
}

function loadProgress() {
  state.userProgress = {};
  
  if (state.currentUser) {
    // Load from backend
    fetch(`${API_BASE}/api/progress`, {
      headers: { 'x-user-id': state.currentUser.id }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.progress)) {
          data.progress.forEach(p => {
            state.userProgress[p.node_id] = p.status;
          });
          updateProgressVisuals();
        }
      })
      .catch(e => {
        console.warn('Failed to load progress from API. Falling back to Guest LocalStorage.', e);
        loadGuestProgress();
      });
  } else {
    loadGuestProgress();
  }
}

function loadGuestProgress() {
  ROADMAP_NODES.forEach(node => {
    const local = localStorage.getItem(`mcdm_progress_guest_${node.id}`);
    if (local) {
      state.userProgress[node.id] = local;
    }
  });
  updateProgressVisuals();
}

// ==================== 11. AUTHENTICATION FLOW ====================
function openAuthModal(isRegister = false) {
  const title = document.getElementById('auth-modal-title');
  const subtitle = document.getElementById('auth-modal-subtitle');
  const submitBtn = document.getElementById('auth-submit-btn');
  const toggleText = document.getElementById('auth-toggle-text');
  const toggleLink = document.getElementById('auth-toggle-link');
  
  const lang = state.currentLanguage;

  if (isRegister) {
    title.textContent = lang === 'pt' ? 'Criar Guia de Estudos' : 'Create Study Guide';
    subtitle.textContent = lang === 'pt' ? 'Cadastre-se para acompanhar sua trilha personalizada.' : 'Sign up to track your customized learning path.';
    submitBtn.innerHTML = `<span>${lang === 'pt' ? 'Cadastrar' : 'Sign Up'}</span>`;
    submitBtn.setAttribute('data-action', 'register');
    toggleText.textContent = lang === 'pt' ? 'Já possui uma conta?' : 'Already have an account?';
    toggleLink.textContent = lang === 'pt' ? 'Entrar' : 'Login';
  } else {
    title.textContent = lang === 'pt' ? 'Acessar Guia de Estudos' : 'Access Study Guide';
    subtitle.textContent = lang === 'pt' ? 'Entre para salvar seu progresso no roadmap.' : 'Login to save your roadmap progress.';
    submitBtn.innerHTML = `<span>${lang === 'pt' ? 'Entrar' : 'Login'}</span>`;
    submitBtn.setAttribute('data-action', 'login');
    toggleText.textContent = lang === 'pt' ? 'Ainda não tem uma conta?' : 'Don\'t have an account?';
    toggleLink.textContent = lang === 'pt' ? 'Cadastre-se' : 'Sign Up';
  }

  document.getElementById('auth-modal-backdrop').classList.add('active');
}

function closeAuthModal() {
  document.getElementById('auth-modal-backdrop').classList.remove('active');
  document.getElementById('auth-form').reset();
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  const action = document.getElementById('auth-submit-btn').getAttribute('data-action');
  
  const endpoint = action === 'register' ? '/api/auth/register' : '/api/auth/login';

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    
    if (data.success) {
      if (action === 'register') {
        const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();
        if (loginData.success) {
          state.currentUser = loginData.user;
          localStorage.setItem('mcdm_roadmap_user', JSON.stringify(loginData.user));
        }
      } else {
        state.currentUser = data.user;
        localStorage.setItem('mcdm_roadmap_user', JSON.stringify(data.user));
      }
      
      showToast(TRANSLATIONS[state.currentLanguage].toast_auth_success, 'success');
      closeAuthModal();
      updateAuthUI();
      loadProgress();
    } else {
      showToast(data.error, 'error');
    }
  } catch (err) {
    showToast(TRANSLATIONS[state.currentLanguage].toast_error, 'error');
    console.error(err);
  }
}

function handleLogout() {
  state.currentUser = null;
  localStorage.removeItem('mcdm_roadmap_user');
  state.userProgress = {};
  updateAuthUI();
  loadProgress();
  showToast(TRANSLATIONS[state.currentLanguage].toast_logout, 'success');
  closeDrawer();
}

function updateAuthUI() {
  const loggedOut = document.getElementById('logged-out-section');
  const loggedIn = document.getElementById('logged-in-section');
  const emailDisplay = document.getElementById('user-email-display');

  if (state.currentUser) {
    loggedOut.style.display = 'none';
    loggedIn.style.display = 'block';
    emailDisplay.textContent = state.currentUser.email;
  } else {
    loggedOut.style.display = 'block';
    loggedIn.style.display = 'none';
    emailDisplay.textContent = '';
  }
}

// ==================== 12. STATIC LIST RENDERERS ====================
function renderAuthors() {
  const lang = state.currentLanguage;
  
  // Pioneers
  const pioneersGrid = document.getElementById('pioneers-grid');
  pioneersGrid.innerHTML = '';
  PIONEER_AUTHORS.forEach(auth => {
    const card = document.createElement('div');
    card.className = 'author-card';
    
    const orcidBadge = auth.orcid && auth.orcid.startsWith('0000') 
      ? `<a href="https://orcid.org/${auth.orcid}" target="_blank" style="text-decoration:none; color:#a6e22e; font-size:0.8rem; display:inline-flex; align-items:center; gap:0.25rem;"><i class="fa-brands fa-orcid" style="color:#a6e22e;"></i> ${auth.orcid}</a>`
      : `<span style="font-size:0.75rem; color:var(--text-muted);">${auth.orcid}</span>`;

    const socBadges = auth.societies.map(s => `<span class="drawer-meta-badge" style="font-size:0.7rem; padding:0.15rem 0.45rem; margin-right:0.25rem; margin-bottom:0.25rem; display:inline-block;"><i class="fa-solid fa-users" style="font-size:0.65rem;"></i> ${s}</span>`).join('');

    card.innerHTML = `
      <div class="author-header">
        <div class="author-name">${auth.name}</div>
        <span class="author-label pioneer">${auth.label}</span>
      </div>
      <div class="author-affiliation" style="margin-bottom:0.35rem;">${auth.affiliation}</div>
      <div class="author-orcid" style="margin-bottom:0.75rem;">${orcidBadge}</div>
      <div class="author-bio">${auth.bio[lang]}</div>
      <div style="margin-bottom:0.75rem;">
        <strong style="font-size:0.75rem; color:var(--text-secondary); display:block; margin-bottom:0.25rem;">${lang === 'pt' ? 'Sociedades Científicas' : 'Scientific Societies'}:</strong>
        <div style="display:flex; flex-wrap:wrap;">${socBadges}</div>
      </div>
      <div style="margin-bottom:0.75rem; font-size:0.8rem; color:var(--text-secondary);">
        <strong>${lang === 'pt' ? 'Onde Publica' : 'Where Publishes'}:</strong> <span style="color:var(--accent-cyan);">${auth.journals.join(', ')}</span>
      </div>
      <div class="author-connections">
        <strong>${lang === 'pt' ? 'Foco de Publicação' : 'Publication Scope'}:</strong> ${auth.publications}
      </div>
    `;
    pioneersGrid.appendChild(card);
  });

  // Young Promising
  const youngGrid = document.getElementById('young-grid');
  youngGrid.innerHTML = '';
  YOUNG_AUTHORS.forEach(auth => {
    const card = document.createElement('div');
    card.className = 'author-card';
    
    const orcidBadge = auth.orcid && auth.orcid.startsWith('0000') 
      ? `<a href="https://orcid.org/${auth.orcid}" target="_blank" style="text-decoration:none; color:#a6e22e; font-size:0.8rem; display:inline-flex; align-items:center; gap:0.25rem;"><i class="fa-brands fa-orcid" style="color:#a6e22e;"></i> ${auth.orcid}</a>`
      : `<span style="font-size:0.75rem; color:var(--text-muted);">${auth.orcid}</span>`;

    const socBadges = auth.societies.map(s => `<span class="drawer-meta-badge" style="font-size:0.7rem; padding:0.15rem 0.45rem; margin-right:0.25rem; margin-bottom:0.25rem; display:inline-block;"><i class="fa-solid fa-users" style="font-size:0.65rem;"></i> ${s}</span>`).join('');

    card.innerHTML = `
      <div class="author-header">
        <div class="author-name">${auth.name}</div>
        <span class="author-label">${auth.label}</span>
      </div>
      <div class="author-affiliation" style="margin-bottom:0.35rem;">${auth.affiliation}</div>
      <div class="author-orcid" style="margin-bottom:0.75rem;">${orcidBadge}</div>
      <div class="author-bio">${auth.bio[lang]}</div>
      <div style="margin-bottom:0.75rem;">
        <strong style="font-size:0.75rem; color:var(--text-secondary); display:block; margin-bottom:0.25rem;">${lang === 'pt' ? 'Sociedades Científicas' : 'Scientific Societies'}:</strong>
        <div style="display:flex; flex-wrap:wrap;">${socBadges}</div>
      </div>
      <div style="margin-bottom:0.75rem; font-size:0.8rem; color:var(--text-secondary);">
        <strong>${lang === 'pt' ? 'Onde Publica' : 'Where Publishes'}:</strong> <span style="color:var(--accent-cyan);">${auth.journals.join(', ')}</span>
      </div>
      <div class="author-connections">
        <strong>${lang === 'pt' ? 'Foco de Publicação' : 'Publication Scope'}:</strong> ${auth.publications}
      </div>
    `;
    youngGrid.appendChild(card);
  });
}

function renderJournals() {
  const tbody = document.getElementById('journals-table-body');
  tbody.innerHTML = '';
  
  JOURNALS_DATA.forEach(j => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 600; color: var(--text-primary);">${j.name}</td>
      <td>${j.publisher}</td>
      <td><i class="fa-solid fa-star" style="color: var(--accent-cyan); margin-right: 0.35rem;"></i>${j.if}</td>
      <td><span class="quartile-badge ${j.sjr.includes('Q1') ? 'q1' : j.sjr.includes('Q2') ? 'q2' : ''}">${j.sjr}</span></td>
      <td>${j.hindex}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderCommunities() {
  const lang = state.currentLanguage;
  const grid = document.getElementById('communities-grid');
  grid.innerHTML = '';

  COMMUNITIES_DATA.forEach(comm => {
    const card = document.createElement('div');
    card.className = 'community-card';
    card.innerHTML = `
      <div class="community-name">${comm.name}</div>
      <div class="community-desc">${comm.desc[lang]}</div>
      <a class="community-link" href="${comm.link}" target="_blank">
        ${lang === 'pt' ? 'Visitar Website' : 'Visit Website'} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.8rem;"></i>
      </a>
    `;
    grid.appendChild(card);
  });
}

// ==================== 13. LITERATURE FEED & API SYNC ====================

// Fetch sync status and load articles
async function fetchArticles() {
  try {
    const res = await fetch(`${API_BASE}/api/articles`);
    const data = await res.json();
    
    const statsRes = await fetch(`${API_BASE}/api/stats`);
    const statsData = await statsRes.json();
    
    if (data.success && Array.isArray(data.articles)) {
      renderArticlesList(data.articles);
    }
    
    if (statsData.success && statsData.stats) {
      document.getElementById('stats-total-articles').textContent = statsData.stats.totalArticles || '0';
    }
    
    // Set last update time
    if (data.articles && data.articles.length > 0) {
      const dates = data.articles.map(a => new Date(a.synced_at || Date.now()));
      const maxDate = new Date(Math.max.apply(null, dates));
      document.getElementById('last-sync-time').textContent = `${state.currentLanguage === 'pt' ? 'Última atualização' : 'Last update'}: ${maxDate.toLocaleDateString()} ${maxDate.toLocaleTimeString()}`;
    }
  } catch (err) {
    console.error('Failed to load publications from server:', err);
    renderArticlesFallback();
  }
}

function renderArticlesList(articles) {
  const feedList = document.getElementById('articles-feed-list');
  feedList.innerHTML = '';

  if (articles.length === 0) {
    feedList.innerHTML = `<div style="text-align: center; padding: 3rem; color: var(--text-muted);">${state.currentLanguage === 'pt' ? 'Nenhuma publicação carregada. Clique em Sincronizar.' : 'No articles cached. Click Sync.'}</div>`;
    return;
  }

  articles.slice(0, 100).forEach(art => {
    const item = document.createElement('div');
    item.className = 'article-feed-item';
    
    let authorsStr = art.authors.slice(0, 3).join(', ');
    if (art.authors.length > 3) authorsStr += ' et al.';

    item.innerHTML = `
      <div class="article-title">${art.title}</div>
      <div class="article-authors">${authorsStr}</div>
      <div class="article-journal-details">
        <span><i class="fa-solid fa-journal-whills"></i> ${art.journal}</span>
        <span><i class="fa-solid fa-calendar"></i> ${art.year}</span>
        <span><i class="fa-solid fa-quote-right"></i> ${state.currentLanguage === 'pt' ? 'Citações' : 'Citations'}: ${art.citation_count}</span>
        <a class="article-feed-link" href="${art.link}" target="_blank" style="margin-left: auto;">
          DOI / URL <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem;"></i>
        </a>
      </div>
    `;
    feedList.appendChild(item);
  });
}

// Trigger manual data syncing
async function triggerManualSync() {
  const btn = document.getElementById('trigger-sync-btn');
  const originalText = btn.innerHTML;
  
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Sincronizando...`;

  try {
    const res = await fetch(`${API_BASE}/api/sync`, { method: 'POST' });
    const data = await res.json();
    
    if (data.success) {
      showToast(TRANSLATIONS[state.currentLanguage].toast_sync_success, 'success');
      await fetchArticles();
    } else {
      showToast(TRANSLATIONS[state.currentLanguage].toast_sync_fail, 'error');
    }
  } catch (err) {
    showToast(TRANSLATIONS[state.currentLanguage].toast_sync_fail, 'error');
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// Fallback publications mock in case backend is offline
function renderArticlesFallback() {
  const fallback = [
    { title: "Neuroscience tools applied to the evaluation of cognitive effort in FITradeoff elicitation", authors: ["Lucia R. P. Roselli", "Adiel T. de Almeida"], journal: "European Journal of Operational Research", year: 2024, citation_count: 5, link: "#" },
    { title: "Flexible and Interactive Tradeoff (FITradeoff) sorting method under group decision contexts", authors: ["Eduarda A. Frej", "Lucia R. P. Roselli", "Adiel T. de Almeida"], journal: "Group Decision and Negotiation", year: 2024, citation_count: 8, link: "#" },
    { title: "A Best-Worst Tradeoff method to tackle cognitive anchoring bias in multicriteria weights elicitation", authors: ["Jafar Rezaei", "M. Brunelli", "F. Liang"], journal: "European Journal of Operational Research", year: 2024, citation_count: 12, link: "#" }
  ];
  renderArticlesList(fallback);
  document.getElementById('stats-total-articles').textContent = '3 (Offline Fallback)';
}
