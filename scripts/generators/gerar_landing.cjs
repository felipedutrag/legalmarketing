require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const LEADS_PATH = path.join(__dirname, '../../data/advogados_leads.json');
const OUTPUT_DIR = path.join(__dirname, '../../data/propostas/templates');
const TEMPLATE_PATH = path.join(__dirname, '../../modelo/landing-generator.html');

const ADMIN_WHATSAPP = '5513988658518';

// Template de referência (modelo/landing-generator.html): data-driven via window.LP_CONFIG,
// layout de slides desktop, wizard de triagem por cards com IA, footer, exit-intent modal etc.
// A IA gera o conteúdo e o gerador substitui o bloco LP_CONFIG + textos estáticos.
let TEMPLATE_HTML = '';
try {
  TEMPLATE_HTML = fs.readFileSync(TEMPLATE_PATH, 'utf8');
} catch {
  console.warn('⚠️  Template modelo/landing-generator.html não encontrado. Gerando sem referência de layout.');
}

function gerarSlug(nome) {
  return nome
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function extractColors(page) {
  return page.evaluate(() => {
    const styles = getComputedStyle(document.body);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    const links = document.querySelectorAll('link[rel="icon"]');
    return {
      bg: styles.backgroundColor,
      text: styles.color,
      themeColor: metaTheme?.getAttribute('content'),
      icon: links.length ? links[0].href : '',
      title: document.title || '',
      h1: document.querySelector('h1')?.innerText || ''
    };
  });
}

async function analyzeWebsite(url) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
    const colors = await extractColors(page);
    const pageData = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="description"]');
      return {
        description: meta?.getAttribute('content') || '',
        bodyText: document.body ? document.body.innerText.replace(/\s+/g, ' ').trim() : ''
      };
    });

    const rawText = pageData.bodyText.slice(0, 8000);
    const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = rawText.match(/\(?\d{2}\)?\s?9?\d{4}[-.\s]?\d{4}/);
    const addressMatch = rawText.match(/(Av\.|Avenida|Rua|R\.|Alameda)\s[^\n,]{5,60},?\s?\d{0,6}[^\n]{0,60}/i);

    // Extrai áreas de atuação mencionadas no site (headings, menus, listas)
    const areasFromSite = await page.evaluate(() => {
      const areas = new Set();
      const keywords = ['direito', 'advocacia', 'área', 'especialidade', 'atuamos', 'atuação', 'serviços'];
      const selectors = 'h1, h2, h3, h4, nav a, .menu a, li, .service, .area, [class*="area"], [class*="servic"]';
      document.querySelectorAll(selectors).forEach(el => {
        const text = (el.innerText || '').trim();
        if (text.length > 4 && text.length < 80 && keywords.some(k => text.toLowerCase().includes(k))) {
          areas.add(text);
        }
      });
      return [...areas].slice(0, 12);
    });

    return {
      colors,
      description: pageData.description,
      rawText,
      email: emailMatch ? emailMatch[0] : null,
      phoneFound: phoneMatch ? phoneMatch[0] : null,
      addressFound: addressMatch ? addressMatch[0].trim() : null,
      areasFromSite
    };
  } finally {
    await browser.close();
  }
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function replaceAllLiteral(html, search, replace) {
  if (!search) return html;
  return html.split(search).join(replace);
}

function replaceBetween(html, startMarker, endMarker, newInner) {
  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) {
    console.warn(`   -> Marcador não encontrado no template: ${startMarker}`);
    return html;
  }
  const endIdx = html.indexOf(endMarker, startIdx + startMarker.length);
  if (endIdx === -1) {
    console.warn(`   -> Marcador não encontrado no template: ${endMarker}`);
    return html;
  }
  const before = html.slice(0, startIdx + startMarker.length);
  const after = html.slice(endIdx);
  return `${before}\n${newInner}\n      ${after}`;
}

function widthClassForCount(total) {
  if (total <= 1) return 'w-full max-w-lg mx-auto';
  if (total === 2) return 'w-full sm:w-[calc(50%-1.5rem)]';
  if (total === 4) return 'w-full sm:w-[calc(50%-1.5rem)]';
  if (total >= 7) return 'w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)]';
  return 'w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)]'; // 3, 5, 6
}

function normalizeIconSlug(icon) {
  return String(icon || 'scale-balanced').trim().replace(/^fa-solid\s+/i, '').replace(/^fa-/i, '');
}

function formatPhoneBR(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 11) {
    return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 13 && digits.startsWith('55')) {
    const ddd = digits.slice(2, 4);
    const num = digits.slice(4);
    if (num.length === 9) return `+55 (${ddd}) ${num.slice(0, 5)}-${num.slice(5)}`;
    if (num.length === 8) return `+55 (${ddd}) ${num.slice(0, 4)}-${num.slice(4)}`;
  }
  return phone;
}

// Monta o grid de "Áreas de Atuação" de forma 100% determinística em código
// (não depende da IA acertar classes de layout). Usa flexbox + justify-center
// para que a última linha incompleta seja sempre centralizada, garantindo
// simetria visual para qualquer quantidade N de áreas.
function buildAreasHtml(areas) {
  const list = Array.isArray(areas) && areas.length ? areas : [
    { icon: 'scale-balanced', titulo: 'Direito Cível', descricao: 'Atuação técnica em demandas cíveis, com foco em clareza e segurança jurídica.' },
    { icon: 'users', titulo: 'Direito de Família', descricao: 'Condução de questões familiares com sensibilidade e respaldo legal.' },
    { icon: 'building-columns', titulo: 'Direito Empresarial', descricao: 'Suporte jurídico estratégico para decisões e operações corporativas.' },
    { icon: 'file-contract', titulo: 'Contratos e Negociações', descricao: 'Elaboração e revisão de instrumentos jurídicos com foco em proteção.' }
  ];

  const widthClass = widthClassForCount(list.length);
  const containerExtra = list.length <= 2 ? ' max-w-3xl mx-auto' : '';

  const cards = list.map(area => {
    const icon = normalizeIconSlug(area.icon);
    return `          <article class="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-xl dark:border-slate-800 dark:bg-darkcard ${widthClass}">
            <span class="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-xl text-gold transition group-hover:bg-gold group-hover:text-primary"><i class="fa-solid fa-${icon}"></i></span>
            <h3 class="mt-5 text-lg font-semibold">${escapeHtml(area.titulo)}</h3>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${escapeHtml(area.descricao)}</p>
          </article>`;
  }).join('\n');

  return `        <div class="flex flex-wrap justify-center gap-6${containerExtra}">\n${cards}\n        </div>`;
}

// Normaliza o AI_TREE gerado pela IA para o formato esperado pelo JS do
// template (icon com prefixo "fa-", estrutura options/next preservada).
function normalizeAiTree(rawTree, areas) {
  const fallbackAreas = areas && areas.length ? areas : [{ titulo: 'Consultoria Jurídica', icon: 'scale-balanced' }];
  const tree = rawTree && typeof rawTree === 'object' ? rawTree : {};

  function normalizeNode(node) {
    if (!node || typeof node !== 'object') return null;
    const out = { question: String(node.question || 'Como podemos ajudar nesse caso?') };
    if (node.icon) out.icon = node.icon.startsWith('fa-') ? node.icon : `fa-${normalizeIconSlug(node.icon)}`;
    out.options = Array.isArray(node.options) && node.options.length
      ? node.options.map(o => ({ label: String(o.label || 'Continuar'), value: String(o.value || 'opcao') }))
      : [{ label: 'Sim', value: 'sim' }, { label: 'Não', value: 'nao' }];
    if (node.next && typeof node.next === 'object') {
      const next = {};
      for (const key of Object.keys(node.next)) {
        const child = normalizeNode(node.next[key]);
        if (child) next[key] = child;
      }
      if (Object.keys(next).length) out.next = next;
    }
    return out;
  }

  function ensureDepth(node, currentDepth = 1) {
    if (!node) return node;
    if (currentDepth < 3) {
      if (!node.next || Object.keys(node.next).length === 0) {
        node.next = {};
        node.options.forEach(opt => {
          node.next[opt.value] = {
            question: `Qual o próximo passo relevante sobre "${opt.label.toLowerCase()}"?`,
            options: [
              { label: 'Tenho documentos e quero prosseguir', value: 'docs_sim' },
              { label: 'Preciso de orientação antes de reunir documentos', value: 'docs_nao' },
              { label: 'Tenho urgência / prazo próximo', value: 'urgente' }
            ],
            next: {
              docs_sim: { question: 'Já possui procuração ou termo de compromisso assinado?', options: [{ label: 'Sim', value: 'sim' }, { label: 'Não', value: 'nao' }] },
              docs_nao: { question: 'Gostaria que enviássemos uma lista de documentos necessários?', options: [{ label: 'Sim, por WhatsApp', value: 'sim' }, { label: 'Não, vou reunir por conta', value: 'nao' }] },
              urgente: { question: 'Qual o prazo ou data limite?', options: [{ label: 'Até 48h', value: '48h' }, { label: 'Até 5 dias', value: '5d' }, { label: 'Até 15 dias', value: '15d' }] }
            }
          };
        });
      } else {
        for (const key of Object.keys(node.next)) {
          ensureDepth(node.next[key], currentDepth + 1);
        }
      }
    } else if (node.next) {
      for (const key of Object.keys(node.next)) {
        ensureDepth(node.next[key], currentDepth + 1);
      }
    }
    return node;
  }

  const result = {};
  fallbackAreas.forEach(area => {
    const key = area.titulo;
    let node = normalizeNode(tree[key]) || {
      icon: `fa-${normalizeIconSlug(area.icon)}`,
      question: `Qual é o principal ponto sobre ${area.titulo.toLowerCase()}?`,
      options: [
        { label: 'Quero orientação inicial', value: 'orientacao' },
        { label: 'Já existe um processo/prazo em curso', value: 'processo' },
        { label: 'Preciso de análise de contrato/documento', value: 'contrato' },
        { label: 'Busco planejamento/prevenção', value: 'prevencao' }
      ],
      next: {}
    };
    if (!node.icon) node.icon = `fa-${normalizeIconSlug(area.icon)}`;
    node = ensureDepth(node);
    result[key] = node;
  });
  return result;
}

// Tenta extrair e parsear JSON da resposta crua do Gemini de forma robusta:
// - remove blocos markdown (```json ... ```)
// - tenta o parse completo
// - localiza o objeto balanceado mais externo (ignorando strings/chaves dentro de strings)
// - retorna null se não conseguir, em vez de lançar erro
function parseJsonRobusto(raw) {
  if (!raw) return null;
  let text = String(raw)
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch { /* fallback abaixo */ }

  const start = text.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') { inString = true; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(text.slice(start, i + 1));
        } catch { return null; }
      }
    }
  }
  return null;
}

// Valida se o JSON retornado tem o mínimo necessário para gerar uma página
// (evita aceitar resposta incompleta/vazia e gerar página genérica).
function buildLeadContext(lead, siteInfo) {
  const mapsData = [
    lead.endereco ? `- Endereço (Google Maps): ${lead.endereco}` : '',
    lead.categoria ? `- Categoria no Google Maps: ${lead.categoria}` : '',
    lead.avaliacao ? `- Avaliação Google: ${lead.avaliacao} estrelas${lead.total_avaliacoes ? ` (${lead.total_avaliacoes} avaliações)` : ''}` : '',
    lead.horario ? `- Horário de funcionamento: ${lead.horario}` : '',
    lead.descricao ? `- Descrição do perfil Google Maps: ${lead.descricao}` : '',
    lead.areas_atuacao?.length ? `- Áreas de atuação identificadas no Google Maps: ${lead.areas_atuacao.join(', ')}` : '',
    lead.servicos?.length ? `- Serviços listados no Maps: ${lead.servicos.join(', ')}` : '',
    lead.resenhas?.length ? `- Trechos de resenhas de clientes: ${lead.resenhas.map(r => `"${r.slice(0, 120)}"`).join(' | ')}` : ''
  ].filter(Boolean).join('\n');

  const siteData = [
    siteInfo?.description ? `- Meta description do site: ${siteInfo.description}` : '',
    siteInfo?.areasFromSite?.length ? `- Áreas/serviços encontrados no site: ${siteInfo.areasFromSite.join(', ')}` : '',
    siteInfo?.addressFound ? `- Endereço identificado no site: ${siteInfo.addressFound}` : '',
    siteInfo?.phoneFound ? `- Telefone identificado no site: ${siteInfo.phoneFound}` : '',
    siteInfo?.email ? `- E-mail identificado no site: ${siteInfo.email}` : ''
  ].filter(Boolean).join('\n');

  return { mapsData, siteData };
}

function buildFallbackPlaceholders(areas) {
  const list = Array.isArray(areas) && areas.length ? areas : [{ titulo: 'Consultoria Jurídica' }];
  const templates = {
    'família': 'Ex.: Estou em processo de divórcio e preciso definir guarda dos filhos.',
    'sucess': 'Ex.: Meu pai faleceu e preciso orientação sobre inventário e partilha de bens.',
    'trabalh': 'Ex.: Fui demitido sem justa causa e não recebi as verbas rescisórias.',
    'cível': 'Ex.: Recebi uma notificação de cobrança que considero indevida.',
    'empresarial': 'Ex.: Preciso revisar um contrato de sociedade antes de assinar.',
    'criminal': 'Ex.: Recebi intimação da polícia e preciso de orientação sobre meus direitos.',
    'tribut': 'Ex.: Recebi auto de infração fiscal e quero entender minhas opções.',
    'imobili': 'Ex.: Tenho um contrato de locação comercial e recebi notificação de rescisão.',
    'previd': 'Ex.: Meu benefício do INSS foi negado e preciso recorrer.',
    'consumidor': 'Ex.: Comprei um produto com defeito e a loja se recusa a trocar.',
    'contrato': 'Ex.: Preciso revisar cláusulas de um contrato antes de assinar.',
    'default': 'Ex.: Preciso de orientação jurídica sobre uma situação que estou enfrentando.'
  };

  const examples = [];
  for (const area of list) {
    const lower = (area.titulo || area).toLowerCase();
    let matched = false;
    for (const [key, tpl] of Object.entries(templates)) {
      if (key !== 'default' && lower.includes(key)) {
        examples.push(tpl);
        matched = true;
        break;
      }
    }
    if (!matched) examples.push(`Ex.: Preciso de orientação sobre ${(area.titulo || area).toLowerCase()}.`);
    if (examples.length >= 5) break;
  }

  while (examples.length < 5) {
    examples.push(templates.default);
  }
  return examples.slice(0, 5);
}

function conteudoValido(content) {
  if (!content || typeof content !== 'object') return false;
  if (content.nome || content.hero || (Array.isArray(content.areas) && content.areas.length)) return true;
  return false;
}

async function gerarConteudoIA(lead, siteInfo) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.5-flash-lite',
    generationConfig: {
      responseMimeType: 'application/json',
      maxOutputTokens: 8192
    }
  });

  const { mapsData, siteData } = buildLeadContext(lead, siteInfo);

  const promptCompleto = `Você é um Diretor de Conteúdo + UX Writer especialista em copywriting para escritórios de advocacia no Brasil, seguindo rigorosamente a ética da OAB.
Sua tarefa é retornar APENAS um JSON válido (sem markdown, sem comentários) com o conteúdo textual para preencher um template fixo de landing page. Você NÃO deve gerar HTML, CSS ou JS — apenas os textos e a árvore de perguntas do wizard, conforme o schema abaixo.

=== DADOS REAIS DO CLIENTE (USE SEMPRE QUE DISPONÍVEL; NUNCA INVENTE ENDEREÇO, TELEFONE, PRÊMIOS OU NÚMEROS) ===
- Nome do Escritório: ${lead.nome}
- Website Atual: ${lead.website || 'N/A'}
- Resumo do conteúdo do site real: ${siteInfo?.description || 'Não informado.'}
- Texto bruto extraído do site real (use para identificar áreas de atuação e tom de voz; não copie literalmente, reescreva com qualidade premium): """${(siteInfo?.rawText || '').slice(0, 4000) || 'Site indisponível para análise — use um posicionamento genérico e profissional de escritório full service.'}"""

=== DADOS DO GOOGLE MAPS (PRIORIZE ESTES DADOS REAIS) ===
${mapsData || '- Sem dados adicionais do Google Maps.'}

=== DADOS EXTRAÍDOS DO SITE ===
${siteData || '- Sem dados adicionais do site.'}

=== REGRAS DE COPYWRITING (OAB, OBRIGATÓRIO) ===
- Tom institucional, humano, técnico e respeitoso.
- NÃO prometer resultado, vitória, ganho de causa ou garantia.
- NÃO usar claims agressivos, sensacionalistas ou apelativos.
- NÃO inventar depoimentos, números, prêmios, endereço ou telefone que não existam nos dados reais.
- NÃO mencionar preços/honorários.
- Copywriting persuasivo e eficaz: use gatilhos de autoridade, prova social implícita, clareza, urgência ética e benefício claro. Foque na dor do cliente e na transformação que o escritório proporciona.
- Linguagem acessível mas sofisticada: evite juridiquês excessivo, explique conceitos complexos com simplicidade.
- Headlines magnéticas: prometa clareza, segurança e direcionamento.
- Bullets orientados a benefícios, não apenas features.

=== IDENTIFICAÇÃO DAS ÁREAS DE ATUAÇÃO ===
PRIORIDADE: use as áreas identificadas no Google Maps e no site real. Se houver lista explícita de áreas de atuação nos dados reais, use EXATAMENTE essas áreas como base. Analise o texto real do site, a categoria do Maps, serviços listados e resenhas de clientes para identificar as áreas verdadeiras do escritório. Se houver lista explícita, use exatamente ela. Se não houver, infira entre 3 e 6 áreas coerentes com o conteúdo real. Se não houver nenhum sinal (site indisponível), use um conjunto genérico plausível de 4 áreas (Direito Cível, Direito de Família, Direito Empresarial, Direito Trabalhista). Cada área terá também uma pergunta inicial e um segundo nível de perguntas para um wizard de triagem (perguntas sim/não ou de múltipla escolha relevantes àquela área específica, ex.: "já existe processo em andamento?", "já recebeu notificação/prazo?").

=== PERSONALIZAÇÃO MÁXIMA ===
- O nome do escritório, hero, sobre, FAQ e contato devem refletir a especialidade REAL do advogado (ex.: se é especialista em família, todo o copy deve falar de família, guarda, divórcio, sucessões — NÃO use copy genérico de "full service" se os dados indicam especialização).
- Use o tom de voz inferido do site e das resenhas.
- Se houver avaliação alta no Google, mencione indiretamente a confiança dos clientes (sem citar números inventados).
- O endereço e horário devem vir dos dados reais (Maps > site > fallback genérico).

=== PLACEHOLDERS DO SISTEMA DE TRIAGEM ===
Crie 5 exemplos de placeholder para o campo de texto da triagem por IA. Cada exemplo deve:
- Começar com "Ex.: "
- Descrever uma situação jurídica REALISTA e ESPECÍFICA para as áreas de atuação do escritório
- Usar linguagem do cliente leigo (não juridiquês)
- Ser diferente entre si, cobrindo diferentes áreas/situações do escritório
- Ter entre 60 e 120 caracteres

=== ESTRUTURA DO WIZARD (ÁRVORE DE DECISÃO - IA DE AGENDAMENTO) ===
IMPORTANTE: Para CADA área em "areas", a "aiTree" deve ter uma chave idêntica ao "titulo" da área. Cada nó deve ter MÍNIMO 3 níveis de profundidade (pergunta inicial + 2 níveis de aprofundamento) totalizando NO MÍNIMO 6 perguntas por caminho (branch). Use múltiplas opções (3-5) nas perguntas iniciais e de segundo nível, não apenas Sim/Não. As perguntas devem qualificar bem a lead: urgência, complexidade, estágio do processo, documentos, valores envolvidos, riscos.

Retorne EXATAMENTE este formato JSON (preencha todos os campos, sem deixar nada como "texto aqui" ou vazio, exceto onde explicitamente permitido):
{
  "nome": "nome do escritório para exibição no site",
  "metaDescription": "meta description persuasiva e ética, até 160 caracteres",
  "hero": { "tag": "badge curto (3-5 palavras)", "titulo": "headline forte (1 frase)", "subtitulo": "subheadline (1-2 frases)", "bullets": ["bullet curto 1", "bullet curto 2", "bullet curto 3"] },
  "sobre": { "titulo": "título da seção sobre (1 frase)", "paragrafo1": "parágrafo institucional 1", "paragrafo2": "parágrafo institucional 2" },
  "areasTitulo": "título curto para a seção de áreas de atuação",
  "areas": [ { "icon": "nome-do-icone-fontawesome-sem-prefixo (ex: building-columns, gavel, users, file-contract, briefcase, house, heart, scale-balanced, landmark, hand-holding-dollar)", "titulo": "Nome da área jurídica", "descricao": "descrição objetiva de 1 frase" } ],
  "equipe": { "titulo": "título da seção equipe", "paragrafo1": "parágrafo sobre o corpo jurídico", "paragrafo2": "parágrafo sobre método de atuação" },
  "faq": [ { "pergunta": "pergunta 1", "resposta": "resposta 1" }, { "pergunta": "pergunta 2", "resposta": "resposta 2" }, { "pergunta": "pergunta 3", "resposta": "resposta 3" }, { "pergunta": "pergunta 4", "resposta": "resposta 4" } ],
  "contato": { "titulo": "título da seção contato", "subtitulo": "subtítulo convidando para conversa", "endereco": "endereço real ou string vazia", "telefone": "telefone real formatado ou string vazia", "email": "e-mail real ou plausível baseado no domínio do site", "horario": "horário de atendimento, ex: Segunda a sexta, das 9h às 18h" },
  "footerDescricao": "frase curta institucional para o rodapé",
  "triagePlaceholderExamples": [
    "Ex.: situação jurídica específica da área 1 do escritório (60-120 chars)",
    "Ex.: situação jurídica específica da área 2 do escritório (60-120 chars)",
    "Ex.: situação jurídica específica da área 3 do escritório (60-120 chars)",
    "Ex.: situação jurídica específica da área 4 do escritório (60-120 chars)",
    "Ex.: situação jurídica específica da área 5 do escritório (60-120 chars)"
  ],
  "aiTree": {
    "<use exatamente o mesmo texto de cada 'titulo' do array areas como chave>": {
      "icon": "nome-do-icone-fontawesome-sem-prefixo",
      "question": "pergunta inicial específica da área",
      "options": [ { "label": "opção 1", "value": "valor_1" }, { "label": "opção 2", "value": "valor_2" }, { "label": "opção 3", "value": "valor_3" }, { "label": "opção 4", "value": "valor_4" } ],
      "next": {
        "valor_1": { "question": "pergunta de aprofundamento 1", "options": [ { "label": "opção A", "value": "a" }, { "label": "opção B", "value": "b" }, { "label": "opção C", "value": "c" } ], "next": { "a": { "question": "pergunta final 1", "options": [ { "label": "Sim", "value": "sim" }, { "label": "Não", "value": "nao" } ] }, "b": { "question": "pergunta final 2", "options": [ { "label": "Sim", "value": "sim" }, { "label": "Não", "value": "nao" } ] }, "c": { "question": "pergunta final 3", "options": [ { "label": "Sim", "value": "sim" }, { "label": "Não", "value": "nao" } ] } } },
        "valor_2": { "question": "pergunta de aprofundamento 2", "options": [ { "label": "opção A", "value": "a" }, { "label": "opção B", "value": "b" }, { "label": "opção C", "value": "c" } ], "next": { "a": { "question": "pergunta final 1", "options": [ { "label": "Sim", "value": "sim" }, { "label": "Não", "value": "nao" } ] }, "b": { "question": "pergunta final 2", "options": [ { "label": "Sim", "value": "sim" }, { "label": "Não", "value": "nao" } ] }, "c": { "question": "pergunta final 3", "options": [ { "label": "Sim", "value": "sim" }, { "label": "Não", "value": "nao" } ] } } },
        "valor_3": { "question": "pergunta de aprofundamento 3", "options": [ { "label": "opção A", "value": "a" }, { "label": "opção B", "value": "b" }, { "label": "opção C", "value": "c" } ], "next": { "a": { "question": "pergunta final 1", "options": [ { "label": "Sim", "value": "sim" }, { "label": "Não", "value": "nao" } ] }, "b": { "question": "pergunta final 2", "options": [ { "label": "Sim", "value": "sim" }, { "label": "Não", "value": "nao" } ] }, "c": { "question": "pergunta final 3", "options": [ { "label": "Sim", "value": "sim" }, { "label": "Não", "value": "nao" } ] } } },
        "valor_4": { "question": "pergunta de aprofundamento 4", "options": [ { "label": "opção A", "value": "a" }, { "label": "opção B", "value": "b" }, { "label": "opção C", "value": "c" } ], "next": { "a": { "question": "pergunta final 1", "options": [ { "label": "Sim", "value": "sim" }, { "label": "Não", "value": "nao" } ] }, "b": { "question": "pergunta final 2", "options": [ { "label": "Sim", "value": "sim" }, { "label": "Não", "value": "nao" } ] }, "c": { "question": "pergunta final 3", "options": [ { "label": "Sim", "value": "sim" }, { "label": "Não", "value": "nao" } ] } } }
    }
  }
}
O objeto "aiTree" deve ter uma chave para CADA área presente em "areas", nem mais nem menos.`;

  // Prompt reduzido (usado como 2ª linha de recuperação quando o completo
  // retorna JSON inválido repetidamente). Gera resposta bem menor e mais
  // simples, muito menos propensa a erro de formatação.
  const promptReduzido = `Você é um Diretor de Conteúdo + UX Writer especialista em copywriting para escritórios de advocacia no Brasil, seguindo rigorosamente a ética da OAB.
Retorne APENAS um JSON válido e COMPACTO (sem markdown, sem comentários), SEM HTML/CSS/JS.

=== DADOS REAIS DO CLIENTE ===
- Nome do Escritório: ${lead.nome}
- Website Atual: ${lead.website || 'N/A'}
- Resumo do site: ${siteInfo?.description || 'Não informado.'}
- Texto bruto do site: """${(siteInfo?.rawText || '').slice(0, 3000) || 'Site indisponível — use posicionamento genérico de escritório full service.'}"""
${mapsData ? `\n=== GOOGLE MAPS ===\n${mapsData}` : ''}
${siteData ? `\n=== SITE ===\n${siteData}` : ''}

=== REGRAS (OAB) ===
- Tom institucional e respeitoso. NÃO prometer resultado, vitória ou garantia. NÃO inventar endereço/telefone/prêmios. NÃO mencionar preços.
- Identifique as áreas de atuação reais dos dados acima. Se não houver, use EXATAMENTE 3 áreas: Direito Cível, Direito de Família, Direito Empresarial.
- Personalize TODO o copy para a especialidade real do advogado (não use copy genérico se os dados indicam especialização).
- Crie 5 triagePlaceholderExamples com situações realistas específicas das áreas do escritório (formato "Ex.: ...").
- IMPORTANTE: o JSON deve ser CURTO e VÁLIDO. Textos de 1 frase por campo. Evite caracteres especiais problemáticos (\`\`", \\, {, }\`) dentro dos textos — escreva sem aspas internas. Use apenas aspas duplas como delimitadores de string.

Retorne EXATAMENTE este formato (preencha tudo):
{
  "nome": "nome do escritório para exibição",
  "metaDescription": "meta description persuasiva e ética, até 140 caracteres",
  "hero": { "tag": "badge curto (3-5 palavras)", "titulo": "headline forte (1 frase)", "subtitulo": "subheadline (1-2 frases)", "bullets": ["bullet curto 1", "bullet curto 2", "bullet curto 3"] },
  "sobre": { "titulo": "título da seção sobre (1 frase)", "paragrafo1": "parágrafo institucional 1", "paragrafo2": "parágrafo institucional 2" },
  "areasTitulo": "título curto para a seção de áreas",
  "areas": [ { "icon": "nome-do-icone-fontawesome-sem-prefixo", "titulo": "Nome da área jurídica", "descricao": "descrição objetiva de 1 frase" }, { "icon": "nome-do-icone", "titulo": "Segunda área", "descricao": "descrição" }, { "icon": "nome-do-icone", "titulo": "Terceira área", "descricao": "descrição" } ],
  "equipe": { "titulo": "título da seção equipe (1 frase)", "paragrafo1": "parágrafo sobre o corpo jurídico", "paragrafo2": "parágrafo sobre método de atuação" },
  "faq": [ { "pergunta": "pergunta 1", "resposta": "resposta 1" }, { "pergunta": "pergunta 2", "resposta": "resposta 2" }, { "pergunta": "pergunta 3", "resposta": "resposta 3" }, { "pergunta": "pergunta 4", "resposta": "resposta 4" } ],
  "contato": { "titulo": "título da seção contato", "subtitulo": "subtítulo convidando para conversa", "endereco": "endereço real ou string vazia", "telefone": "telefone real formatado ou string vazia", "email": "e-mail real ou plausível", "horario": "Segunda a sexta, das 9h às 18h" },
  "footerDescricao": "frase curta institucional para o rodapé",
  "triagePlaceholderExamples": ["Ex.: situação específica área 1", "Ex.: situação específica área 2", "Ex.: situação específica área 3", "Ex.: situação específica área 4", "Ex.: situação específica área 5"],
  "aiTree": {
    "<use o mesmo texto do titulo de cada area do array areas como chave>": {
      "icon": "nome-do-icone-fontawesome-sem-prefixo",
      "question": "pergunta inicial específica da área",
      "options": [ { "label": "opção 1", "value": "valor_1" }, { "label": "opção 2", "value": "valor_2" }, { "label": "opção 3", "value": "valor_3" } ]
    }
  }
}
IMPORTANTE: o campo "aiTree" deve ter uma chave para CADA área em "areas". NÃO inclua o campo "next" (árvore de 1 nível só). Revise o JSON mentalmente antes de responder para garantir que está válido e bem formado.`;

  const MAX_TENTATIVAS = 3;
  let content = null;

  // Fase 1: prompt completo (áreas ricas + árvore profunda)
  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    console.log(`   -> Solicitando conteúdo estruturado (JSON) ao Gemini (tentativa ${tentativa}/${MAX_TENTATIVAS})...`);
    try {
      const result = await model.generateContent(promptCompleto);
      const raw = result.response.text();
      content = parseJsonRobusto(raw);
      if (conteudoValido(content)) break;
      console.warn('   -> JSON inválido ou incompleto, tentando novamente...');
      if (tentativa === MAX_TENTATIVAS || !content) {
        try {
          fs.writeFileSync(
            path.join(OUTPUT_DIR, `debug_${gerarSlug(lead.nome)}.json.txt`),
            `TENTATIVA ${tentativa}/${MAX_TENTATIVAS} (prompt completo)\n${raw}`,
            'utf8'
          );
          console.warn(`   -> Resposta crua salva em templates/debug_${gerarSlug(lead.nome)}.json.txt para inspeção.`);
        } catch (e) { /* debug é opcional */ }
      }
      content = null;
    } catch (e) {
      console.warn(`   -> Erro na chamada à IA: ${e.message}. Tentando novamente...`);
      content = null;
    }
  }

  // Fase 2: prompt reduzido (recuperação com resposta mais simples)
  if (!conteudoValido(content)) {
    console.warn('   -> Prompt completo falhou. Tentando prompt reduzido (JSON compacto)...');
    for (let tentativa = 1; tentativa <= 2; tentativa++) {
      console.log(`   -> Solicitando conteúdo reduzido (JSON) ao Gemini (tentativa ${tentativa}/2)...`);
      try {
        const result = await model.generateContent(promptReduzido);
        const raw = result.response.text();
        content = parseJsonRobusto(raw);
        if (conteudoValido(content)) break;
        console.warn('   -> JSON reduzido inválido, tentando novamente...');
        content = null;
      } catch (e) {
        console.warn(`   -> Erro na chamada à IA (reduzido): ${e.message}. Tentando novamente...`);
        content = null;
      }
    }
  }

  if (!conteudoValido(content)) {
    console.warn('   -> Não foi possível obter JSON válido após todas as tentativas. Usando fallback genérico.');
    content = {};
  }

  // Defaults de segurança caso algum campo venha ausente
  content.nome = content.nome || lead.nome;
  content.metaDescription = content.metaDescription || `Assessoria jurídica estratégica de ${lead.nome}, com atuação técnica, ética e atendimento próximo.`;
  content.hero = content.hero || {};
  content.hero.tag = content.hero.tag || 'Advocacia estratégica e ética';
  content.hero.titulo = content.hero.titulo || 'Proteção jurídica com visão técnica, atendimento próximo e decisões seguras.';
  content.hero.subtitulo = content.hero.subtitulo || 'Atuação consultiva e contenciosa para pessoas e empresas que valorizam clareza, prevenção de riscos e condução profissional em cada etapa.';
  content.hero.bullets = Array.isArray(content.hero.bullets) && content.hero.bullets.length >= 3
    ? content.hero.bullets
    : ['Atendimento técnico e personalizado', 'Condução ética e transparente', 'Comunicação clara em cada fase'];
  content.sobre = content.sobre || {};
  content.sobre.titulo = content.sobre.titulo || 'Atuação jurídica com método, proximidade e visão de longo prazo.';
  content.sobre.paragrafo1 = content.sobre.paragrafo1 || `O escritório ${content.nome} atua com estratégia jurídica estruturada, combinando análise técnica, prevenção de riscos e representação qualificada em demandas relevantes.`;
  content.sobre.paragrafo2 = content.sobre.paragrafo2 || 'Cada caso recebe diagnóstico individual, plano de ação e acompanhamento contínuo, preservando segurança jurídica, clareza nas decisões e respeito absoluto aos princípios éticos da advocacia.';
  content.areasTitulo = content.areasTitulo || 'Soluções jurídicas para demandas estratégicas.';
  content.areas = Array.isArray(content.areas) && content.areas.length ? content.areas : null;
  content.equipe = content.equipe || {};
  content.equipe.titulo = content.equipe.titulo || 'Equipe preparada para demandas complexas e decisões sensíveis.';
  content.equipe.paragrafo1 = content.equipe.paragrafo1 || 'Nosso corpo jurídico combina formação técnica sólida, atualização contínua e atuação integrada entre áreas para oferecer respostas consistentes a cada cenário.';
  content.equipe.paragrafo2 = content.equipe.paragrafo2 || 'A condução é pautada por transparência, disponibilidade e compromisso com o melhor encaminhamento jurídico possível dentro dos limites éticos e legais.';
  const faqDefault = [
    { pergunta: 'Como funciona o primeiro atendimento?', resposta: 'Realizamos uma conversa inicial para compreender o contexto, avaliar documentos e indicar os próximos passos jurídicos com clareza.' },
    { pergunta: 'O escritório atende pessoas físicas e empresas?', resposta: 'Sim. Atendemos tanto demandas de pessoas físicas quanto necessidades jurídicas de empresas em diferentes estágios e setores.' },
    { pergunta: 'É possível receber orientação preventiva?', resposta: 'Sim. A atuação preventiva é parte central do nosso trabalho, reduzindo riscos e fortalecendo a segurança jurídica em decisões relevantes.' },
    { pergunta: 'Como posso agendar uma consulta?', resposta: 'Você pode agendar diretamente pelo WhatsApp. O retorno é feito para organizar horário e orientar os documentos iniciais.' },
    { pergunta: 'O que preciso levar para a primeira reunião?', resposta: 'Documentos pessoais (RG, CPF), comprovante de residência e quaisquer contratos, notificações, petições ou documentos relacionados ao seu caso.' },
    { pergunta: 'O atendimento é presencial ou online?', resposta: 'Oferecemos ambas as modalidades. A primeira conversa pode ser realizada por videoconferência ou presencialmente, conforme sua preferência e disponibilidade.' }
  ];
  content.faq = Array.isArray(content.faq) && content.faq.length >= 4 ? content.faq : faqDefault;
  content.contato = content.contato || {};
  content.contato.titulo = content.contato.titulo || 'Fale com nosso time e receba orientação jurídica com clareza.';
  content.contato.subtitulo = content.contato.subtitulo || 'Estamos disponíveis para compreender seu cenário e indicar, com objetividade, os próximos passos juridicamente adequados.';
  content.contato.endereco = content.contato.endereco || lead.endereco || siteInfo?.addressFound || 'Atendimento também via WhatsApp';
  const rawPhone = content.contato.telefone || siteInfo?.phoneFound || lead.whatsapp;
  content.contato.telefone = formatPhoneBR(rawPhone);
  content.contato.email = content.contato.email || siteInfo?.email || `contato@${gerarSlug(lead.nome)}.adv.br`;
  content.contato.horario = content.contato.horario || lead.horario || 'Segunda a sexta, das 9h às 18h';
  content.footerDescricao = content.footerDescricao || `Advocacia estratégica com atuação técnica, ética e atendimento próximo para pessoas e empresas.`;
  content.triagePlaceholderExamples = Array.isArray(content.triagePlaceholderExamples) && content.triagePlaceholderExamples.length >= 3
    ? content.triagePlaceholderExamples.slice(0, 5)
    : buildFallbackPlaceholders(content.areas || lead.areas_atuacao);
  content.aiTree = normalizeAiTree(content.aiTree, content.areas);

  return content;
}

// Monta o objeto window.LP_CONFIG a partir do conteúdo gerado pela IA,
// seguindo a estrutura data-driven do template (modelo/landing-generator.html).
// As listas dinâmicas (hero features, grid de áreas, destaques da equipe e FAQ)
// são renderizadas pelo JS do template a partir deste objeto.
function buildConfigObject(lead, content) {
  const heroIcons = ['fa-scale-balanced', 'fa-shield-halved', 'fa-comments'];
  const features = (content.hero.bullets || []).slice(0, 3).map(function (texto, i) {
    return { icone: heroIcons[i] || 'fa-scale-balanced', texto: String(texto) };
  });

  const areasItens = (content.areas || []).map(function (area) {
    return { icone: 'fa-' + normalizeIconSlug(area.icon), titulo: String(area.titulo || ''), desc: String(area.descricao || '') };
  });

  const faqIcons = ['fa-handshake-angle', 'fa-building', 'fa-shield-halved', 'fa-calendar-check', 'fa-question', 'fa-circle-check'];
  const faqIds = ['faq-one', 'faq-two', 'faq-three', 'faq-four', 'faq-five', 'faq-six'];
  const faqItens = (content.faq || []).slice(0, 6).map(function (item, i) {
    return { id: faqIds[i] || ('faq-' + (i + 1)), icone: faqIcons[i] || 'fa-question', pergunta: String(item.pergunta || ''), resposta: String(item.resposta || '') };
  });

  return {
    nome: content.nome,
    tagline: content.hero.tag || 'Assessoria Jurídica Estratégica',
    metaDescription: content.metaDescription,
    whatsapp: lead.whatsapp,
    email: content.contato.email,
    endereco: content.contato.endereco,
    horario: content.contato.horario,
    telefone: content.contato.telefone,
    instagram: '#',
    linkedin: '#',
    facebook: '#',
    imagens: {
      hero: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=80',
      recepcao: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
      contato: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?auto=format&fit=crop&w=1200&q=80',
      fallbackHero: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=80',
      fallbackRecepcao: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
      fallbackContato: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?auto=format&fit=crop&w=1200&q=80'
    },
    msg: {
      agendar: 'Olá%2C%20gostaria%20de%20agendar%20uma%20consulta%20jur%C3%ADdica.',
      equipe: 'Olá%2C%20gostaria%20de%20falar%20com%20a%20equipe%20jur%C3%ADdica.',
      duvida: 'Olá%2C%20tenho%20uma%20d%C3%BAvida%20antes%20de%20agendar.'
    },
    secoes: { hero: true, agendamento: true, areas: true, equipe: true, faq: true, contato: true },
    sections: {
      hero: {
        badge: content.hero.tag,
        titulo: content.hero.titulo,
        subtitulo: content.hero.subtitulo,
        cmd: 'Agendar conversa estratégica',
        cmdLabel: 'Agendar conversa estratégica',
        features: features
      },
      agendamento: {
        badge: 'Sobre o escritório',
        titulo: content.sobre.titulo,
        paragrafos: [content.sobre.paragrafo1, content.sobre.paragrafo2]
      },
      areas: {
        titulo: content.areasTitulo,
        subtitulo: 'Atuação consultiva e contenciosa organizada por áreas de especialidade, para que cada demanda receba o tratamento técnico adequado à sua complexidade.',
        itens: areasItens
      },
      equipe: {
        badge: 'Corpo jurídico',
        titulo: content.equipe.titulo,
        paragrafos: [content.equipe.paragrafo1, content.equipe.paragrafo2],
        destaques: [
          { icone: 'fa-diagram-project', texto: 'Atuação multidisciplinar' },
          { icone: 'fa-graduation-cap', texto: 'Atualização contínua' },
          { icone: 'fa-handshake', texto: 'Disponibilidade real' },
          { icone: 'fa-scale-balanced', texto: 'Conduta ética' }
        ]
      },
      faq: {
        badge: 'Perguntas frequentes',
        titulo: 'Dúvidas comuns antes da primeira conversa.',
        subtitulo: 'Reunimos as perguntas que mais recebemos de quem está prestes a falar conosco pela primeira vez.',
        itens: faqItens,
        ctaTexto: 'Ainda com dúvidas?',
        ctaWhats: 'Olá, tenho uma dúvida antes de agendar.'
      },
      contato: {
        badge: 'Contato',
        titulo: content.contato.titulo,
        subtitulo: content.contato.subtitulo
      }
    },
    aiTree: content.aiTree || null,
    triagePlaceholderExamples: content.triagePlaceholderExamples || []
  };
}

// Localiza o fechamento do bloco `window.LP_CONFIG = { ... };` contando chaves.
function findConfigEnd(html, startIdx) {
  const openIdx = html.indexOf('{', startIdx);
  if (openIdx === -1) return -1;
  let depth = 0;
  for (let i = openIdx; i < html.length; i++) {
    const ch = html[i];
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) return i + 1; }
  }
  return -1;
}

// Aplica o conteúdo gerado pela IA ao template data-driven (modelo/landing-generator.html),
// reconstruindo o bloco window.LP_CONFIG e substituindo os textos estáticos do HTML.
function applyContentToTemplate(template, lead, content) {
  let html = template;

  // 1) Reconstrói o bloco de configuração (JSON é um literal JS válido)
  const cfg = buildConfigObject(lead, content);
  const startIdx = html.indexOf('window.LP_CONFIG =');
  const endIdx = startIdx !== -1 ? findConfigEnd(html, startIdx) : -1;
  if (startIdx !== -1 && endIdx !== -1) {
    html = html.slice(0, startIdx) + 'window.LP_CONFIG = ' + JSON.stringify(cfg, null, 2) + ';' + html.slice(endIdx);
  } else {
    console.warn('   -> Bloco window.LP_CONFIG não encontrado no template.');
  }

  // 2) Substituições estáticas do HTML
  html = replaceAllLiteral(html, 'Almeida & Vasconcelos Advocacia', content.nome);
  html = replaceAllLiteral(html, '5511999999999', lead.whatsapp);

  html = replaceAllLiteral(html, 'Assessoria jurídica estratégica para pessoas e empresas, com atuação técnica, ética e atendimento próximo.', content.metaDescription);
  html = replaceAllLiteral(html, 'Assessoria jurídica estratégica com foco em segurança, clareza e proteção dos seus direitos.', content.metaDescription);

  html = replaceAllLiteral(html, 'Advocacia estratégica e ética', content.hero.tag);
  html = replaceAllLiteral(html, 'Proteção jurídica com visão técnica, atendimento próximo e decisões seguras.', content.hero.titulo);
  html = replaceAllLiteral(html, 'Atuação consultiva e contenciosa para pessoas e empresas que valorizam clareza, prevenção de riscos e condução profissional em cada etapa.', content.hero.subtitulo);

  html = replaceAllLiteral(html, 'O escritório Almeida & Vasconcelos combina análise técnica, prevenção de riscos e representação qualificada em litígios relevantes.', content.sobre.paragrafo1);
  html = replaceAllLiteral(html, 'Atuação jurídica com método, proximidade e visão de longo prazo.', content.sobre.titulo);

  html = replaceAllLiteral(html, 'Soluções jurídicas para demandas estratégicas.', content.areasTitulo);

  html = replaceAllLiteral(html, 'Equipe preparada para demandas complexas e decisões sensíveis.', content.equipe.titulo);
  html = replaceAllLiteral(html, 'Nosso corpo jurídico combina formação técnica sólida, atualização contínua e atuação integrada entre áreas para oferecer respostas consistentes a cada cenário.', content.equipe.paragrafo1);
  html = replaceAllLiteral(html, 'A condução é pautada por transparência, disponibilidade e compromisso com o melhor encaminhamento jurídico possível dentro dos limites éticos e legais.', content.equipe.paragrafo2);

  html = replaceAllLiteral(html, 'Entre em Contato', content.contato.titulo);
  html = replaceAllLiteral(html, 'Estamos disponíveis para compreender seu cenário e indicar, com objetividade, os próximos passos juridicamente adequados.', content.contato.subtitulo);
  html = replaceAllLiteral(html, '(11) 99999-9999', content.contato.telefone);
  html = replaceAllLiteral(html, 'contato@almeidavasconcelos.adv.br', content.contato.email);
  html = replaceAllLiteral(html, 'Av. Paulista, 1000 - São Paulo/SP', content.contato.endereco);
  html = replaceAllLiteral(html, 'Seg. a Sex. das 9h às 18h', content.contato.horario);
  html = replaceAllLiteral(html, 'Advocacia estratégica com atuação técnica, ética e atendimento próximo para pessoas e empresas.', content.footerDescricao);

  return html;
}

const MODELO_ASSETS_DIR = path.join(__dirname, '../../modelo/assets');
const PUBLIC_ASSETS_DIR = path.join(__dirname, '../../public/assets');
const OUTPUT_ASSETS_DIR = path.join(OUTPUT_DIR, 'assets');
const RECEPCAO_IMAGE_NAME = 'recepcao-escritorio.png';
const HERO_IMAGE_NAME = 'hero.jpg';

function ensureTemplateAssets() {
  if (!fs.existsSync(OUTPUT_ASSETS_DIR)) {
    fs.mkdirSync(OUTPUT_ASSETS_DIR, { recursive: true });
  }
  if (!fs.existsSync(PUBLIC_ASSETS_DIR)) {
    fs.mkdirSync(PUBLIC_ASSETS_DIR, { recursive: true });
  }
}

async function gerarLandingPage(lead, siteInfo) {
  if (!TEMPLATE_HTML) {
    throw new Error('Template modelo/landing-advocacia-slides.html não encontrado — impossível gerar a página.');
  }

  const content = await gerarConteudoIA(lead, siteInfo);
  console.log(`   -> Conteúdo gerado com ${content.areas ? content.areas.length : 4} área(s) de atuação identificada(s).`);

  ensureTemplateAssets();
  const html = applyContentToTemplate(TEMPLATE_HTML, lead, content);
  return html;
}

async function gerarTodas() {
  if (!fs.existsSync(LEADS_PATH)) {
    console.error('Arquivo de leads não encontrado. Execute o scraper primeiro.');
    process.exit(1);
  }

  const leads = JSON.parse(fs.readFileSync(LEADS_PATH, 'utf8'));
  console.log(`🚀 Gerando landing pages otimizadas para ${leads.length} leads...`);

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    const slug = gerarSlug(lead.nome);

    console.log(`\n[${i + 1}/${leads.length}] ${lead.nome}...`);

    try {
      let siteInfo = null;
      if (lead.website && lead.website !== 'N/A') {
        try {
          siteInfo = await analyzeWebsite(lead.website);
          console.log(`   -> Site analisado com sucesso`);
        } catch {
          console.log(`   -> Site indisponível (usando fallback)`);
        }
      }

      const html = await gerarLandingPage(lead, siteInfo);
      console.log(`   -> HTML gerado com sucesso (${html.length} chars)`);

      fs.writeFileSync(path.join(OUTPUT_DIR, `${slug}.html`), html, 'utf8');

      lead.landing_page = `https://legalmarketing.club/propostas/${slug}`;
      console.log(`   -> Proposta salva em: templates/${slug}.html`);
    } catch (e) {
      console.error(`   -> Erro ao gerar para ${lead.nome}: ${e.message}`);
    }
  }

  fs.writeFileSync(LEADS_PATH, JSON.stringify(leads, null, 2), 'utf8');
  console.log('\n✅ --- TODAS AS LANDING PAGES FORAM GERADAS ---');
  console.log(`📁 Templates disponíveis em: ${OUTPUT_DIR}`);
}

if (require.main === module) {
  gerarTodas().catch(err => {
    console.error('❌ ERRO NO PIPELINE:', err);
    process.exit(1);
  });
}

module.exports = { applyContentToTemplate, buildAreasHtml, normalizeAiTree, gerarSlug };