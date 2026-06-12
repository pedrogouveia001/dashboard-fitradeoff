# MCDM/MCDA Learning Roadmap & Prescriptive Guide

An interactive, high-fidelity learning platform inspired by [roadmap.sh](https://roadmap.sh/) focusing on the science of **Multicriteria Decision Making / Aiding (MCDM/MCDA)**. 

This platform maps the decision science field from basic foundations to advanced research frontiers, provides a detailed Prescriptive/Mathematical guide for 18+ methods (like FITradeoff, AHP, BWM, ELECTRE, PROMETHEE, etc.), profiles historical pioneers and contemporary researchers, and connects directly to the **OpenAlex API** to display live publications and statistical trends of the area.

---

## 🌟 Features

### 1. Interactive Study Roadmap
Structured into 3 progressive learning levels:
- **Level 1: Foundations (Básico)**: Introduction to MCDM/MCDA, problem formulation using the four primary problematics (Choice $\alpha$, Ranking $\beta$, Sorting $\gamma$, Portfolio $\delta$), the elicitation process (cognitive load, consistency, biases), MAUT & UTA, and Value-Focused Thinking (VFT).
- **Level 2: Core Methods (Intermediário)**:
  - **Complete Information Methods**: Classical Tradeoff (Keeney-Raiffa), Swing Weighting, Ratio, AHP (Saaty), BWM (Rezaei), BWT (Rezaei, Liang, Brunelli 2022), MACBETH (Bana e Costa), SMARTS, SMARTER, TOPSIS, VIKOR, COPRAS.
  - **Outranking Methods (French/European School)**: ELECTRE Family (Roy), PROMETHEE Family (Brans), ORESTE.
  - **Data-Driven & Objective Weighting Methods**: Entropy method, CRITIC (Diakoulaki et al.), Data Envelopment Analysis (DEA).
- **Level 3: Advanced & Frontiers (Avançado)**:
  - **Partial Information Methods**: FITradeoff (Almeida et al.), SMAA (Lahdelma & Salminen), Fuzzy MCDM, Dominance-based Rough Set Approach (DRSA).
  - **Decision Contexts**: Individual decision aiding, Group Decision Making, Negotiation & Consensus.
  - **Research Frontiers**: Behavioral MCDA & Neuroscience (eye-tracking and fMRI cognitive workload analysis), AI & Machine Learning Integration, Preference Learning, and Explainable AI (XAI in MCDA).

### 2. Detailed Data-Driven Decision Making Study Fields
Integrated deeply into the roadmap (Node 2.1) are the main study branches of **Data-Driven MCDA**:
1. **Objective Weighting**: Extracting criteria weights directly from statistical variations and correlation matrices (Entropy, CRITIC, MEREC, LOPCOW) without active decision-maker interviews.
2. **Frontier Efficiency Analysis**: Linear programming approaches (Data Envelopment Analysis - DEA) to evaluate relative performance of units using multiple inputs and outputs.
3. **Preference Learning**: Applying machine learning algorithms (such as SVM-Rank, neural networks, and ordinal regression) to learn preference models from historical decision logs.
4. **Explainable AI (XAI) in Decision Support**: Utilizing local explanation frameworks (SHAP, LIME) and rule-induction (DRSA) to ensure algorithmic transparency and auditability.
5. **Hybrid Fuzzy Intelligent Systems**: Scaling decision algorithms to handle large-scale datasets under high uncertainty.

### 3. Exhaustive Global Researchers Network
Profiles are categorized into **Historical Pioneers** and **Promising & Contemporary Researchers**, featuring:
- Clickable green **ORCID badges** linking directly to official researcher registries.
- Academic affiliations, typical publishing journals, and scientific societies (MCDM Society, EWG-MCDA, CDSID, SOBRAPO, IEEE CIS, IRSS, INFORMS).
- Detailed scopes of publication and brief biographies.
- **Pioneers profiled**: Ralph Keeney, Bernard Roy, Thomas Saaty, Valerie Belton, Adiel Teixeira de Almeida, Ward Edwards, Jean-Pierre Brans, Roman Slowinski, Salvatore Greco, Theodor Stewart, Carlos A. Bana e Costa, Luis C. Dias, Ching-Lai Hwang & Kwangsun Yoon, Edmundas Kazimieras Zavadskas, Enrique Herrera-Viedma, Yannis Siskos.
- **Contemporaries profiled**: Eduarda Asfora Frej, Lucia Reis Peixoto Roselli, Jafar Rezaei, Jônatas Araújo de Almeida, Muhammet Deveci, Dragan Pamučar, Matteo Brunelli, Francisco Chiclana, Wojciech Sałabun, Morteza Keshavarz-Ghorabaee, Zeshui Xu, Vladimir Šimić.

### 4. Interactive Historical Timeline (1772 - 2026+)
An alternating flow tree documenting the evolution of decision science:
- *1772*: Benjamin Franklin's Moral Algebra.
- *1785*: Condorcet's Voting Paradox.
- *1896*: Pareto Optimality.
- *1944*: Expected Utility Theory (von Neumann-Morgenstern).
- *1968*: Outranking paradigm and ELECTRE I (Bernard Roy).
- *1978*: Data Envelopment Analysis (DEA).
- *1980*: AHP matrix eigenvectors (Saaty).
- *1981*: TOPSIS method (Hwang & Yoon).
- *1982*: PROMETHEE (Brans) & UTA preference disaggregation.
- *1995*: CRITIC objective weights (Diakoulaki et al.).
- *2015*: Best Worst Method (BWM by Rezaei).
- *2016*: FITradeoff flexible elicitation (Almeida et al.).
- *2021*: MEREC criteria removal effects weighting.
- *2022*: Best-Worst Tradeoff (BWT range-mitigation).
- *2023+*: Cognitive load neuro-MCDA (Roselli et al.) and XAI preference learning.

### 5. OpenAlex Live Research Sync & Analytics
- **Relevance-Filtered Searches**: Queries the OpenAlex database restricted to Multi-Criteria Decision Making topic **`T10050`**, filtering out unrelated disciplines.
- **Rule-Based Clustering**: Reconstructs publication abstracts and automatically groups papers into corresponding learning nodes using regular expressions.
- **Database Caching & Statistics**: Calculates and displays metrics like publications per year, top journals publishing in the area, and top active authors.
- **Interactive Drawers**: Clicking on any node displays a scrollable feed of the latest, highly cited articles specific to that method, detailing titles, authors, journals, year, citations, and DOI links.

### 6. User Progress Tracker
- Register and login to track your learning progress.
- Node statuses are updated dynamically (Not Started, In Progress, Completed).
- Overall progress bars show completion percentages per level.
- Runs in **Local JSON File Fallback Mode** out of the box (requires no DB configuration), with seamless integration to PostgreSQL (e.g., Supabase).

---

## 🛠️ Technical Stack & Architecture

- **Frontend**: Single Page Application (SPA) built with vanilla HTML5, CSS3, and JavaScript. Featuring a futuristic glassmorphic design, Dark/Light modes, and bilingual support (PT-BR / EN).
- **Backend**: Node.js and Express.js server.
- **Database**: PostgreSQL (configured for easy deployment on Supabase) with an **automatic local JSON file fallback** if DB credentials are not present.
- **Data Sync**: Automated synchronization module (`sync.js`) that queries the OpenAlex API for recent publications and calculates metrics. It runs via a daily cron schedule (`node-cron`) and can be triggered manually in the dashboard.

```
mcdm-roadmap/
├── public/                 # Frontend SPA static assets
│   ├── index.html          # Main HTML structure with custom layouts
│   ├── index.css           # Premium glassmorphic design and responsive grids
│   └── app.js              # State management, translations, rendering logic
├── data_fallback/          # Local JSON database (Fallback Mode)
│   ├── users.json
│   ├── progress.json
│   └── articles.json
├── db.js                   # Database layer (PostgreSQL / JSON file wrapper)
├── sync.js                 # OpenAlex queries, regex classifier, and sync manager
├── server.js               # Express application, routes, and cron schedule
├── schema.sql              # Database initialization commands
└── package.json            # Node dependencies
```

---

## 🚀 Setup & Running Locally

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed on your system.

### 2. Installation
Open your terminal in this directory (`mcdm-roadmap/`) and run:
```powershell
# For Windows environments with PowerShell script execution restrictions:
npm.cmd install

# For standard environments:
npm install
```

### 3. Running the Server
Start the Express server with:
```bash
npm start
```
The application will boot and output:
`MCDM/MCDA Roadmap server is running at http://localhost:4000`

Open your web browser and navigate to `http://localhost:4000` to interact with the platform.

---

## 💾 Database Configuration

By default, the server runs in **Local JSON File Fallback Mode**, saving all data under the `./data_fallback/` folder.

### Connecting to Supabase / PostgreSQL
To run the server using a real PostgreSQL instance, set the `DATABASE_URL` environment variable before booting the app:

**On Windows (PowerShell):**
```powershell
$env:DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_ID].supabase.co:5432/postgres"
npm start
```

**On Linux/macOS (Bash):**
```bash
export DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_ID].supabase.co:5432/postgres"
npm start
```

#### SQL Schema Import
Before connecting, run the SQL commands in `schema.sql` inside your database editor (e.g. Supabase SQL Editor) to create the required tables and indexes.

---

## 📈 Running OpenAlex Live Sync manually
If you want to force a fresh import of OpenAlex works from the command line:
```bash
node sync.js --test-sync
```
This will run the multi-query stream, classify the works, save them to the database, and display the updated statistics.
