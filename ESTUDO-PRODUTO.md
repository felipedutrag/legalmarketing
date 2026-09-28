# Estudo do produto — Lexora

## Resumo da proposta

**Lexora** é um microsaas de presença orgânica para advogados: entrega um site com blog e um fluxo assistido por IA que transforma dúvidas reais do público em rascunhos de artigos. O advogado define o escopo, revisa e aprova; se desejar, pode ativar publicação automática para temas e formatos previamente autorizados.

**Oferta de entrada:** R$ 490 por mês, sem fidelidade e sem multa de cancelamento. Inclui site, blog, hospedagem durante a assinatura e produção assistida por IA. O cliente mantém a titularidade do conteúdo e recebe uma exportação do site e dos artigos ao encerrar. O serviço hospedado deixa de operar quando a assinatura termina, salvo contratação separada de migração/hospedagem.

## Posicionamento recomendado

Evitar a promessa “SEO substitui Instagram”. Os canais servem a momentos diferentes:

- Instagram distribui conteúdo em um feed e é bom para relacionamento, lembrança e conversas. A publicação tende a perder visibilidade no fluxo do feed.
- Busca atende pessoas que já expressam uma dúvida ou necessidade. Um artigo útil pode continuar descoberto por buscas ao longo do tempo, mas isso não é garantido.
- Site e blog são ativos próprios e organizados; redes sociais continuam úteis para distribuir os artigos, ouvir perguntas e manter relacionamento.

O argumento forte é **consistência e propriedade do acervo**, não “tráfego passivo garantido”. SEO leva tempo, depende do tema, concorrência, autoridade, qualidade e indexação. Google diz explicitamente que elegibilidade técnica não garante rastreamento, indexação ou exibição. Em busca com IA, o conteúdo também precisa estar acessível e ser realmente útil, original e confiável; não existe formato mágico nem garantia de citação.

## Mecanismo do produto

1. **Configuração do perfil editorial:** áreas de atuação, região, público, serviços informativos, biografia, credenciais, estilo, assuntos proibidos, fontes preferenciais e chamadas permitidas.
2. **Entrada de sinais:** advogado adiciona perguntas que recebeu ou usa perguntas/comentários enviados voluntariamente em canais conectados. Sempre que possível, coletar apenas a pergunta e remover dados pessoais, nomes, números de processo, documentos e detalhes identificadores.
3. **Triagem e agrupamento:** IA identifica assunto, intenção, região, urgência, duplicação, risco de sensibilidade e potencial de conteúdo. Um comentário nunca deve ser publicado como está nem tratado como autorização automática para divulgar o caso.
4. **Pauta com motivo claro:** mostrar pergunta de origem, público, intenção, ângulo proposto, sobreposição com artigos existentes e fontes a consultar. Advogado pode aceitar, editar, descartar ou agendar.
5. **Rascunho com lastro:** modelo elabora artigo em linguagem clara a partir de pauta aprovada, briefing e fontes verificáveis. Referências e afirmações jurídicas devem ser apresentadas para checagem; não inventar jurisprudência, números ou garantias. Conteúdo jurídico pode ficar desatualizado, então registrar data de revisão e sinalizar tema temporal.
6. **Aprovação e publicação:** estado explícito (rascunho, revisão, aprovado, publicado, atualização necessária). Padrão recomendado: aprovação humana obrigatória no início e para temas de alto risco; publicação automática é opt-in, delimitada por categorias, com auditoria, pausa global e revisão amostral.
7. **Distribuição e aprendizado:** publicação em URL própria, link interno para conteúdos relacionados, opção de compartilhar nas redes. Métricas mostram impressões, cliques, consultas e leads agregados quando integrações estiverem conectadas; esses dados sugerem novas pautas sem transformar volume de publicação em objetivo.

O ciclo de crescimento é editorial: pergunta real → pauta útil → revisão profissional → artigo público → nova descoberta/conversa → novas perguntas. Não é um loop automático de geração em massa.

## Escopo de implementação recomendado

### MVP vendável

- Um site por escritório, domínio próprio ou subdomínio, com perfil, páginas institucionais e blog.
- CMS simples com rascunho, comentário de revisão, aprovação, publicação programada e histórico/versionamento.
- Formulário para inserir dúvidas e uma caixa de entrada de sugestões; começar sem leitura automática de DMs ou scraping de comentários.
- Geração de pauta e primeiro rascunho a partir do contexto do advogado; revisão humana por padrão.
- SEO técnico: HTML renderizado no servidor, URLs permanentes e legíveis, títulos e descrições editáveis, canonical, sitemap, robots, links internos, imagem social, mobile, desempenho e Search Console.
- Exportação dos artigos em Markdown/HTML e dos dados básicos do site ao cancelar.
- Limite de uso explícito por plano (artigos, revisões e armazenamento) antes de vender. O número precisa ser validado por custo de IA, suporte e margem; não prometer “conteúdo ilimitado”.

### Evolução após validação

- Integração Google Search Console para impressões, cliques e consultas; sinalização de páginas não indexadas sem prometer correção automática.
- Integração opcional com Analytics respeitando consentimento e política de privacidade.
- Integrações oficiais e autorizadas para importar perguntas, com prévia, minimização de dados e opt-in por origem.
- Sugestões de atualização de artigos com mudanças legislativas/jurisprudenciais, sempre como alerta para validação profissional.
- Temas, usuários e permissões para equipes, agência ou sócios.

### Arquitetura sugerida

- Next.js para sites públicos renderizados e painel autenticado separado por tenant.
- PostgreSQL para escritórios, membros, briefs, fontes, pautas, rascunhos, aprovações, publicações e eventos de auditoria.
- Fila de jobs para geração, revisão técnica, publicação e atualização de sitemap; tarefas idempotentes e com tentativas limitadas.
- Armazenamento separado por tenant para mídia e exportações; segredos e chaves de IA mantidos no servidor.
- Isolamento por tenant validado em cada consulta e em tarefas assíncronas. Não confiar apenas no slug/ID recebido pelo cliente.
- Logs de geração e versão do prompt/modelo, sem registrar conteúdo sensível desnecessário; retenção configurável e exclusão/exportação por cliente.

## Confiança, ética e privacidade

- A publicidade jurídica brasileira deve ser informativa, objetiva e verdadeira, com discrição e sobriedade; o profissional identificado responde pelo que publica. O Provimento 205/2021 está em discussão para atualização segundo materiais recentes da OAB, então a operação deve acompanhar a regra vigente e evitar automatizar promessas, mercantilização, captação indevida, comparação de resultados ou divulgação de casos.
- Incluir aviso de que a ferramenta não presta consultoria jurídica e que o profissional é responsável pela revisão e publicação. Isso não substitui revisão das normas pela OAB nem análise jurídica do modelo de negócio.
- Comentários e formulários podem conter dados pessoais e relatos sensíveis. Definir finalidade e base legal, informar o usuário, reduzir coleta, restringir acesso, estabelecer retenção e descarte, atender direitos do titular e formalizar papéis de controlador/operador conforme a operação real.
- Nunca transformar caso concreto, documento, mensagem privada ou comentário identificável em artigo público sem base e autorização adequadas. Remover identificadores antes de usar dados para geração sempre que possível.
- Diferenciar “preparado para rastreamento” de “indexado”, “aparece no Google” e “citado por IA”. Os dois últimos dependem de terceiros e não podem ser garantidos.

## Recomendações para a oferta de R$ 490

1. Explicar claramente o que é incluído: site, blog, hospedagem ativa e fluxo editorial assistido.
2. Definir um limite mensal de artigos e revisões depois de medir custos. A página não inventa esse limite antes de ele ser decidido.
3. Descrever implantação inicial, domínio, e-mail, alterações de layout e suporte: inclusos, limites ou valores adicionais.
4. Fazer cancelamento simples, sem multa. Informar o que continua ativo até o fim do período pago e como solicitar a exportação.
5. Dizer “seu conteúdo e seus dados exportáveis continuam seus”; não sugerir que hospedagem, atualizações ou suporte continuam gratuitamente após o fim da assinatura.
6. Evitar garantia de ranqueamento, leads, quantidade de clientes, indexação ou aparição em respostas de IA.
7. Considerar um período de configuração/onboarding para capturar a voz e a especialidade do advogado. O valor do produto depende dessa contextualização, não só do texto gerado.

## Métricas para validar o produto

- Ativação: perfil editorial completo, domínio/site no ar e primeiro artigo aprovado.
- Valor recorrente: artigos aprovados/publicados por escritório e proporção que exige pouca edição.
- Qualidade: correções substanciais, retrabalho, temas descartados e erros factuais detectados na revisão.
- Descoberta: páginas indexadas, impressões e cliques orgânicos por coorte e por maturidade do site.
- Negócio: leads atribuídos quando mensurável, retenção após 3/6 meses, cancelamentos e motivo.
- Eficiência: custo de IA, suporte e revisão por cliente versus receita mensal.

## Referências consultadas

- [Provimento 205/2021 — CFOAB](https://www.oab.org.br/util/print?numero=205%2F2021&origem=Provimentos&print=Legislacao)
- [Comitê Regulador do Marketing Jurídico — OAB](https://marketingjuridico.oab.org.br/)
- [Debate da OAB sobre atualização do Provimento 205/2021](https://www.oab.org.br/util/print/63703?print=Noticia)
- [Google: otimização para recursos de IA na Busca](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google: conteúdo gerado por IA](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)
- [Google: conteúdo útil e confiável, orientado a pessoas](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: fundamentos da Pesquisa](https://developers.google.com/search/docs/essentials)
