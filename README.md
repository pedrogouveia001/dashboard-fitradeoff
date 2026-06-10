# FITradeoff Scientific Literature Portal & Bibliometric Dashboard

Um portal científico interativo de literatura acadêmica para o método multicritério **FITradeoff**, projetado para pesquisadores, revisores e estudantes analisarem o panorama mundial de publicações de forma confiável e robusta.

O portal opera sob um **Zero-Hallucination Framework**, garantindo que nenhum metadado (autor, ano, periódico ou variante metodológica) seja inferido ou inventado. Qualquer inconsistência ou dado incompleto nas citações é isolado para revisão manual.

---

## 🌟 Funcionalidades Principais

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

---

## 🛠️ Tecnologias Utilizadas

### Frontend:
* **HTML5** estruturado e semântico.
* **Vanilla CSS** moderno baseado em CSS Variables para suporte a temas.
* **Vanilla JavaScript** (ES6+).
* **D3.js (v7)**: Para renderização do grafo de coautoria interativo.
* **Chart.js**: Para renderização dos gráficos de distribuição de periódico, contexto de decisão e áreas econômicas.

### Backend:
* **Node.js**: Servidor local de dados e processador de raspagem.
* **Express.js**: Para servir os arquivos estáticos e expor endpoints REST API (`/api/articles`, `/api/sync`).
* **Node-cron**: Para agendamento da sincronização diária.
* **Regex-based HTML Parser**: Analisador determinístico leve para extrair as referências sem necessidade de dependências pesadas de DOM Parser no servidor.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter o **Node.js** (versão 18 ou superior) instalado em sua máquina.

### Passos para Inicialização

1. Clone ou baixe os arquivos deste projeto na sua pasta local.
2. Abra um terminal na pasta do projeto e instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor local:
   ```bash
   node server.js
   ```
4. Acesse o dashboard no seu navegador pelo endereço:
   [http://localhost:3000](http://localhost:3000)

O sistema iniciará automaticamente e tentará realizar um sincronismo rápido em background para atualizar a base local.

---

## 👨‍💻 Autoria e Desenvolvimento

Desenvolvido e mantido por:
* **Pedro Henrique Gouveia de Souza** (Universidade Federal de Pernambuco - UFPE)
* GitHub: [pedrogouveia001](https://github.com/pedrogouveia001)

Sinta-se à vontade para abrir pull requests ou sugerir melhorias no mapeamento das stop-words!
