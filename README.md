# FITradeoff Portal & MCDM/MCDA Learning Roadmap Ecosystem

Este repositório contém dois sistemas integrados voltados à pesquisa e ao ensino de tomadas de decisão multicritério:
1. **FITradeoff Bibliometric Portal (Port 3000)**: Um portal científico interativo para análise bibliométrica e rede de coautoria do método FITradeoff.
2. **MCDM/MCDA Learning Roadmap (Port 4000, pasta `./mcdm-roadmap`)**: Um guia interativo prescritivo e trilha de aprendizado cobrindo mais de 18 métodos clássicos, inteligência artificial (Data-Driven MCDA), e monitoramento científico em tempo real via OpenAlex.

---

## 🖥️ 1. FITradeoff Scientific Literature Portal (Port 3000)

Um portal científico interativo de literatura acadêmica para o método multicritério **FITradeoff**, projetado para pesquisadores, revisores e estudantes analisarem o panorama mundial de publicações de forma confiável e robusta.

O portal opera sob um **Zero-Hallucination Framework**, garantindo que nenhum metadado (autor, ano, periódico ou variante metodológica) seja inferido ou inventado. Qualquer inconsistência ou dado incompleto nas citações é isolado para revisão manual.

### 🌟 Funcionalidades Principais

* **Dual Sync Integrado (Sincronização Dupla)**: Rotina automática em segundo plano que combina o raspador nativo de HTML da página oficial (`fitradeoff.org/publications`) com a API internacional **OpenAlex**, realizando fusão inteligente e desduplicação por DOI/Título.
* **Layout Acadêmico Premium (UX Benchmarking)**: Desenho inspirado nos principais portais de papers (como Connected Papers e Dimensions), com navegação horizontal fixa no cabeçalho superior e suporte completo a **Modo Claro (☀️)** e **Modo Escuro (🌙)**.
* **Grafo de Coautoria D3.js (Rede)**: Visualização interativa e dinâmica das redes de colaboração entre autores. Inclui controles de zoom, arrasto de nós, destaque visual de conexões no hover e clique integrado para perfil.
* **Painel Científico de Autor (Split View)**:
  * Biografia bibliométrica escrita em linguagem natural gerada dinamicamente pelo frontend.
  * Resumos estatísticos detalhados: total de artigos, colaboradores mais frequentes, anos de atuação e periódicos em destaque.
  * Links de badge diretos para busca restrita de Currículo Lattes do autor e identificador ORCID validado.
  * Histórico de artigos clicáveis com direcionamento para os links de publicação (DOI).
* **Clusterização em 13 Setores Econômicos**: Mapeamento rigoroso e determinístico das aplicações práticas do método nas áreas de:
  * Setor de Energia e Recursos Naturais
  * Políticas Públicas
  * Setor Industrial
  * Setor de Construção
  * Saúde
  * Tecnologia
  * Logística
  * Agricultura
  * Recursos Humanos
  * Segurança Pública
  * ESG
  * Turismo
  * Transporte
* **Isolamento de Teoria**: Artigos metodológicos ou comportamentais são catalogados na área especial *"Teoria & Neurociência"*, que é listada no repositório geral mas fica oculta do gráfico de distribuição econômica para evitar distorções nas métricas industriais.

### 🛠️ Tecnologias Utilizadas

* **Frontend**: HTML5 estruturado, Vanilla CSS com variáveis e Javascript (ES6+), D3.js (v7) para o grafo e Chart.js para os gráficos.
* **Backend**: Node.js, Express.js e Node-cron para agendamento.

### 🚀 Como Executar o Projeto Localmente

1. Abra um terminal na pasta raiz do projeto (`DASHBOARD FITRADEOFF/`) e instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor local:
   ```bash
   node server.js
   ```
3. Acesse o dashboard no seu navegador pelo endereço:
   [http://localhost:3000](http://localhost:3000)

---

## 🗺️ 2. MCDM/MCDA Learning Roadmap & Prescriptive Guide (Port 4000)

Localizado na subpasta **`./mcdm-roadmap`**, este subprojeto é uma plataforma interativa de ensino inspirada no [roadmap.sh](https://roadmap.sh/) para mapear toda a ciência de decisão multicritério.

### Principais Recursos:
- **Trilha de Estudo Interativa**: 3 níveis (Fundações, Métodos Principais, Avançado & Fronteiras) cobrindo 18 métodos (FITradeoff, AHP, BWM, ELECTRE, PROMETHEE, TOPSIS, etc.).
- **Decisão Baseada em Dados (Data-Driven MCDA)**: Seção detalhada sobre Ponderação Objetiva (Entropia, CRITIC, MEREC), Eficiência de Fronteira (DEA), Aprendizado de Preferências (Machine Learning) e IA Explicável (XAI em MCDA).
- **Rede Exaustiva de Autores**: Perfis de 16 pioneiros e 12 pesquisadores contemporâneos com identificadores ORCID válidos, sociedades e publicações.
- **Linha do Tempo Interativa (1772 - 2026+)**: Evolução histórica da área.
- **Integração OpenAlex API**: Sincronização automática para buscar e agrupar artigos acadêmicos diretamente nas problemáticas do roadmap com base em regras de regex.

Para instruções completas de instalação, banco de dados e execução do roadmap, consulte o [README.md do subprojeto](./mcdm-roadmap/README.md).

---

## 👨‍💻 Autoria e Desenvolvimento

Desenvolvido e mantido por:
* **Pedro Henrique Gouveia de Souza** (Universidade Federal de Pernambuco - UFPE)
* GitHub: [pedrogouveia001](https://github.com/pedrogouveia001)

Sinta-se à vontade para abrir pull requests ou sugerir melhorias no mapeamento das stop-words!
