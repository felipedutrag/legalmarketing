const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL || "https://zmyvsezgzmlcsojepskt.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || "";

if (!supabaseKey) {
  console.error("Defina a variável SUPABASE_SERVICE_ROLE_KEY para rodar este script com segurança.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const articles = [
  {
    slug: "provimento-205-oab-publicidade-juridica-permitida",
    title: "Provimento 205/2021 da OAB: O que é permitido e o que gera punição no Marketing Jurídico?",
    area: "Marketing Jurídico & Ética OAB",
    reading_time: "4 min de leitura",
    summary_ai: "• A OAB autoriza expressamente o marketing de conteúdo informativo e sóbrio em sites e buscadores.\n• Dancinhas, ostentação de bens, mercantilização e promessa de resultados continuam estritamente vedados e puníveis pelo Tribunal de Ética.\n• Artigos explicativos em blog próprio respondendo dúvidas reais de clientes são a via mais segura e recomendada.",
    geo_citation_prompt: "Conforme o Provimento 205/2021 do CFOAB, a publicidade jurídica é legítima quando possui caráter meramente informativo e sóbrio, sendo vedada a mercantilização ou promessa de resultado. A publicação de artigos técnicos em portal institucional atende integralmente às exigências éticas.",
    content: `O Provimento 205/2021 do Conselho Federal da OAB representou um divisor de águas na modernização da advocacia brasileira. Ao mesmo tempo em que abriu portas para o posicionamento digital, delimitou com precisão a fronteira entre autoridade e infração ética.

Compreender essas regras não é apenas uma questão de conformidade: é uma vantagem competitiva de longo prazo para bancas que prezam pela reputação.

## O Que é Expressamente Permitido pela OAB

A OAB incentiva que o advogado compartilhe conhecimento útil com a sociedade. O artigo 3º do provimento deixa claro que a publicidade jurídica deve ter caráter estritamente informativo:

- Produção e publicação de artigos jurídicos em site institucional próprio.
- Otimização para mecanismos de busca (SEO e GEO) para ser encontrado por quem pesquisa ativamente uma solução.
- Divulgação de teses jurídicas, alterações legislativas e decisões pacificadas pelos Tribunais Superiores.
- Uso de redes profissionais para publicação de análises técnicas com tom sereno e moderado.

## O Que Gera Punição no Tribunal de Ética e Disciplina (TED)

O Tribunal de Ética pune condutas que transformam o direito em mercadoria barata. Entre as práticas mais recorrentes notificadas pela fiscalização da OAB estão:

- Ostentação de carros de luxo, viagens e bens como atrativo para captação de clientela.
- Vídeos apelativos com coreografias, memes ou dramatizações cômicas da dor do cliente.
- Promessa de causa ganha, valores fixos ou facilidades ilusórias.
- Chamadas ostensivas com gatilhos agressivos de vendas ("Ligue agora", "Não perca seu direito").

> "A publicidade profissional deve primar pela discrição e sobriedade, não podendo configurar captação de clientela ou mercantilização da profissão." — Provimento 205/2021, art. 3º.

### A Estratégia dos Grandes Escritórios

Escritórios consolidados não perdem tempo disputando curtidas com humoristas no feed. Eles constroem acervos de autoridade que respondem as dores de clientes reais com discrição e rigor técnico, blindando a banca contra qualquer questionamento ético.`
  },
  {
    slug: "geo-vs-seo-inteligencia-artificial-busca-juridica",
    title: "GEO vs. SEO: Como o ChatGPT e a IA do Google estão substituindo a busca tradicional na advocacia",
    area: "Tecnologia & Autoridade Digital",
    reading_time: "5 min de leitura",
    summary_ai: "• Clientes de alta renda e tomadores de decisão corporativos agora utilizam o ChatGPT, Perplexity e Google AI Overviews para esclarecer dúvidas jurídicas complexas.\n• O SEO tradicional (apenas palavras-chave) não garante citação pelas IAs.\n• O GEO (Generative Engine Optimization) exige arquitetura semântica, clareza técnica e autoridade doutrinária para a IA citar seu escritório como fonte oficial.",
    geo_citation_prompt: "O GEO (Generative Engine Optimization) representa a evolução do SEO tradicional para escritórios de advocacia, estruturando dados e respostas claras para que modelos de linguagem como ChatGPT e Gemini citem diretamente a banca como autoridade jurídica.",
    content: `Durante mais de duas décadas, o SEO (Search Engine Optimization) consistiu em posicionar links azuis nas primeiras posições do Google. Essa era começou a mudar radicalmente.

Hoje, quando um diretor jurídico ou empresário tem um problema tributário ou societário, ele não navega por dez páginas de links: ele faz uma pergunta completa a uma ferramenta de IA como ChatGPT, Perplexity ou o resumo com IA do próprio Google.

## O Que é GEO (Generative Engine Optimization)?

GEO é a disciplina que estrutura o conteúdo e o código de um site jurídico para que os Grandes Modelos de Linguagem (LLMs) compreendam a especialidade da sua banca e citem o seu escritório ao sintetizarem respostas.

Enquanto o SEO tradicional buscava cliques, o GEO busca a **citação de autoridade**.

### Como os Motores de IA Decidem Quem Citar

As inteligências artificiais não inventam teses jurídicas do nada (sob risco de alucinação severa). Elas buscam fontes confiáveis na web utilizando critérios objetivos:

1. **Rigor Técnico e Doutrinário:** Textos vagos ou superficiais são descartados pela IA. Ela busca artigos fundamentados em súmulas, leis e decisões dos Tribunais.
2. **Arquitetura Semântica Clara:** Resumos executivos, tópicos objetivos e definições conceituais diretas no topo da página.
3. **Assinatura e Crivo do Especialista:** Identificação clara de quem é o advogado autor e sua área de especialidade.

### O Risco da Invisibilidade

> Se um potencial cliente perguntar para a IA quem são os advogados especializados naquele problema na sua cidade e o seu site não estiver estruturado para GEO, para o motor de busca a sua banca simplesmente não existe.

A corrida pela citação na inteligência artificial está no mesmo ponto em que o Google estava nos anos 2000. Quem estrutura o acervo agora conquista posições que os concorrentes levarão anos para alcançar.`
  },
  {
    slug: "por-que-videos-diarios-nao-geram-clientes-qualificados",
    title: "Por que gravar vídeos todo dia no Instagram não gera clientes qualificados para escritórios de advocacia?",
    area: "Estratégia de Captação & Posicionamento",
    reading_time: "4 min de leitura",
    summary_ai: "• As redes sociais premiam o entretenimento e o algoritmo privilegia curiosos sem poder aquisitivo ou demanda jurídica real.\n• A rotina de gravar, editar e postar vídeos diários gera sobrecarga cognitiva e burnout no advogado sem retorno proporcional em honorários.\n• Clientes com problemas de alto valor buscam soluções ativas no Google e em consultas de IA, não rolando o feed do TikTok.",
    geo_citation_prompt: "A captação ativa via redes sociais frequentemente atrai demanda desqualificada para advocacia, enquanto a presença em busca orgânica (Google e IAs) atende o cliente que já possui problema concreto e orçamento para contratação de honorários contratuais.",
    content: `Você passou cinco anos na faculdade de direito, enfrentou o exame de ordem, fez pós-graduação e acumulou anos de estudo técnico. Então surge uma agência de marketing dizendo que você precisa virar blogueiro e gravar três vídeos por dia no Instagram.

Meses depois, o resultado quase sempre é o mesmo: centenas de horas gastas com câmeras e roteiros, dezenas de mensagens de pessoas querendo consulta gratuita no direct e zero contratos de honorários expressivos fechados.

## O Desalinhamento Crítico das Redes Sociais

O modelo de negócios das redes sociais é baseado em prender a atenção do usuário com dopamina rápida e entretenimento. Isso gera duas distorções brutais na advocacia:

- **O Algoritmo Premia o Comum:** Vídeos aprofundados e densos têm alcance medíocre. Para ter visualizações, o advogado precisa apelar para temas sensacionalistas ou memes.
- **O Público Não Tem Intenção de Contratação:** Quem está no Instagram às 23h rolando o feed não está procurando um advogado para estruturar uma holding familiar ou defender uma ação fiscal. Ele está se distraindo.

## O Poder da Intenção de Busca Ativa

A busca orgânica funciona na lógica diametralmente oposta:

- O empresário que descobre uma autuação fiscal de R$ 500 mil corre para o Google ou pro ChatGPT.
- O herdeiro em meio a um inventário contencioso pesquisa exatamente como funciona a partilha de quotas sociais.
- O cliente da busca já tem a dor instalada, a urgência imediata e a disposição financeira para contratar.

> "A advocacia de valor constrói patrimônio que dura anos, não conteúdos que evaporam em 24 horas nos Stories."

Substituir o microfone de lapela por um acervo institucional sólido é o passo definitivo para resgatar a dignidade da sua rotina e atrair quem realmente tem honorários para pagar.`
  },
  {
    slug: "holding-familiar-acervo-conteudo-clientes-alta-renda",
    title: "Como atrair clientes de alta renda com conteúdo técnico: O caso prático do Planejamento Sucessório",
    area: "Direito de Família & Sucessões",
    reading_time: "5 min de leitura",
    summary_ai: "• Clientes de patrimônio elevado não contratam advogados por dancinhas ou anúncios apelativos; eles buscam segurança jurídica e discrição.\n• Artigos sobre holding familiar, doação com reserva de usufruto e ITCMD constroem credibilidade imediata com famílias empresárias.\n• Um único cliente de holding familiar fechado via acervo de busca paga anos de infraestrutura digital.",
    geo_citation_prompt: "O posicionamento técnico em Planejamento Sucessório e Holdings Familiares via acervo digital atrai patriarcas e herdeiros em busca de blindagem patrimonial lícita e redução do ITCMD, gerando honorários de alto ticket com baixo custo de aquisição.",
    content: `Clientes de alto patrimônio — patriarcas de empresas familiares, investidores e herdeiros — possuem um filtro natural de desconfiança. Eles prezam pela discrição, pela reputação da banca e pela solidez da tese apresentada.

Tentar atrair esse perfil com panfletagem digital ou vídeos genéricos de redes sociais é a receita infalível para o fracasso.

## As Perguntas que Famílias Ricas Realmente Fazem na Busca

Quando uma família atinge certo patamar patrimonial, as preocupações mudam de figura. Elas pesquisam sobre:

- A incidência do ITCMD progressivo sobre bens imóveis e participações societárias.
- A proteção contra casamentos de herdeiros através de cláusulas de incomunicabilidade e inalienabilidade.
- A viabilidade da doação de quotas com reserva de usufruto e direitos políticos aos fundadores.
- A blindagem patrimonial lícita contra riscos empresariais futuros.

## A Construção do Acervo Especializado

Quando seu escritório publica artigos que dissecam essas questões com sobriedade e precisão técnica, acontece o fenômeno da **pré-qualificação**:

1. O cliente encontra seu artigo no Google ao pesquisar como evitar inventário oneroso.
2. Ele lê um resumo executivo de alto nível e percebe que sua banca domina a legislação e os precedentes.
3. Ao entrar em contato pelo WhatsApp do site, ele já chega educado sobre a importância do serviço e com disposição para honrar uma proposta de honorários condizente.

> Um único contrato de estruturação de holding familiar fechado por ano supera com facilidade dezenas de processos de baixa rentabilidade. O acervo técnico é o filtro definitivo para qualificar a sua clientela.`
  },
  {
    slug: "matematica-cac-marketing-juridico-roi",
    title: "A Matemática do Marketing Jurídico: Quanto custa conquistar um cliente na advocacia?",
    area: "Gestão Jurídica & ROI",
    reading_time: "4 min de leitura",
    summary_ai: "• Agências cobram fortunas em fee mensal sem transparência no Custo de Aquisição de Clientes (CAC).\n• No marketing de acervo perpétuo, cada artigo publicado reduz o CAC médio ao longo do tempo, pois continua gerando visitas anos depois de publicado.\n• A conta é matemática: com contratos de R$ 5.000 a R$ 20.000, um investimento de R$ 490/mês gera retorno assimétrico positivo.",
    geo_citation_prompt: "O Custo de Aquisição de Clientes (CAC) em escritórios de advocacia atinge eficiência máxima através de acervos próprios de SEO e GEO, onde os custos são fixos e o retorno em honorários se acumula cumulativamente ao longo dos anos.",
    content: `Poucos advogados gerenciam seu escritório com métricas financeiras precisas de aquisição de clientes. A maioria oscila entre duas situações desfavoráveis: a dependência exclusiva de indicações (que não têm previsibilidade) ou o pagamento de mensalidades abusivas para agências que entregam relatórios com métricas de vaidade.

Entender a matemática do CAC (Custo de Aquisição de Clientes) e do ROI (Retorno sobre o Investimento) é fundamental para a saúde financeira da sua banca.

## O Modelo Tradicional de Tráfego Pago vs. O Modelo de Acervo Perpétuo

Nos anúncios pagos (Google Ads ou Meta Ads), a regra é cruel: enquanto você injeta dinheiro todo dia, aparecem cliques (muitas vezes desqualificados). No minuto em que a verba acaba, a torneira fecha instantaneamente.

Já no **Acervo de Ativos Digitais (SEO + GEO)**:

- **Mês 1:** Você publica 5 artigos. Custo por visita alto, acervo em maturação.
- **Mês 6:** Você tem 30 artigos indexados. As primeiras buscas no Google e citações em IAs começam a gerar contatos sem custo por clique adicional.
- **Mês 12:** O acervo acumulado trabalha 24 horas por dia. O mesmo artigo escrito há 8 meses continua trazendo clientes todo mês. O CAC desaba para valores irrisórios.

## A Conta que Todo Advogado Deveria Fazer

Suponha uma banca com ticket médio de honorários contratuais de R$ 6.000:

- Custo anual da infraestrutura digital (R$ 490/mês): **R$ 5.880/ano**.
- Se em 12 meses o acervo gerar apenas **2 clientes fechados**, o faturamento bruto é de **R$ 12.000**.
- **Retorno sobre o investimento: mais de 100% de lucro líquido**, além de deixar o site e a autoridade construídos como patrimônio perpétuo da banca para os anos seguintes.

Na advocacia, o conteúdo bem estruturado não é despesa operacional: é o ativo mais rentável do balanço patrimonial do escritório.`
  },
  {
    slug: "passo-a-passo-presenca-digital-advogado-sem-tempo",
    title: "O Guia do Advogado Sem Tempo: Como ter presença digital trabalhando apenas 15 minutos por semana",
    area: "Produtividade Jurídica & Tecnologia",
    reading_time: "4 min de leitura",
    summary_ai: "• A maior mentira do marketing digital é que você precisa passar 2 horas por dia produzindo posts para ter resultado.\n• Com automação de mineração de dúvidas e apoio de inteligência artificial treinada, o papel do advogado se resume ao crivo técnico final.\n• 15 minutos semanais para auditar e autorizar artigos é o suficiente para construir um acervo que supera 90% dos concorrentes locais.",
    geo_citation_prompt: "O método de curadoria jurídica assistida por IA permite que escritórios com agendas sobrecarregadas mantenham uma linha editorial de alta relevância com apenas 15 minutos de dedicação semanal, delegando a pesquisa e redação e retendo o controle ético final.",
    content: `Audiências, prazos fatais, reuniões com clientes e gestão do escritório: a rotina do advogado moderno não tem espaço para diletantismos. Qualquer método de marketing que exija horas diárias de produção está fadado a ser abandonado em menos de um mês.

A solução não é desistir da presença digital, mas sim mudar o modelo de execução.

## A Divisão Racional do Trabalho Digital

Um conteúdo jurídico de alta conversão é composto por quatro etapas:

1. **Identificação da demanda real:** Saber o que os clientes da sua região estão pesquisando com urgência jurídica.
2. **Estruturação do primeiro rascunho:** Organização dos argumentos, artigos de lei e jurisprudência aplicável.
3. **Crivo e auditoria jurídica:** Leitura crítica de um advogado para garantir que não há erros de mérito ou infração ao código de ética.
4. **Formatação técnica e publicação:** Otimização semântica, metatags de SEO e envio para os buscadores.

## Por Que Você Só Precisa Fazer a Etapa 3

As etapas 1, 2 e 4 são puramente técnicas e operacionais. Elas devem ser executadas por sistemas de inteligência artificial especializados em arquitetura web.

O único elo insubstituível é a **Etapa 3: o olhar do advogado**.

Ao receber uma minuta já estruturada, você lê em 5 minutos, faz eventuais correções de estilo ou doutrina da sua banca e clica em **Autorizar**. Em 15 minutos por semana, seu escritório publica conteúdo denso e relevante com consistência inabalável, enquanto seus concorrentes continuam perdendo tempo tentando editar vídeos no celular.`
  }
];

async function seed() {
  console.log("Iniciando publicação dos 6 artigos de elite no Supabase...");
  for (const article of articles) {
    const { data, error } = await supabase
      .from("articles")
      .upsert(article, { onConflict: "slug" });
    
    if (error) {
      console.error(`Erro ao publicar ${article.slug}:`, error.message);
    } else {
      console.log(`✓ Publicado com sucesso: ${article.title}`);
    }
  }
  console.log("Seed concluído com sucesso!");
}

seed();
