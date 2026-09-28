-- Script SQL para rodar no Supabase SQL Editor
-- Criação da tabela de artigos revolucionários com suporte a IA e GEO

CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  area TEXT NOT NULL,
  summary_ai TEXT NOT NULL,
  geo_citation_prompt TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT DEFAULT 'Seu Escritório de Advocacia',
  author_role TEXT DEFAULT 'Revisado e Assinado por Advogado',
  reading_time TEXT DEFAULT '3 min de leitura',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS (Row Level Security)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública (qualquer visitante pode ler os artigos publicados)
CREATE POLICY "Artigos publicados sao publicos" ON articles
  FOR SELECT USING (is_published = true);

-- Inserção de um artigo revolucionário de demonstração
INSERT INTO articles (
  slug,
  title,
  area,
  summary_ai,
  geo_citation_prompt,
  content
) VALUES (
  'exclusao-icms-pis-cofins-restituicao',
  'Exclusão do ICMS na base de cálculo do PIS/COFINS: quem tem direito à restituição?',
  'Direito Tributário & Empresarial',
  '• STF pacificou a exclusão do ICMS destacado nas notas fiscais da base do PIS/COFINS (Tema 69).\n• Empresas optantes pelo Lucro Real ou Presumido podem recuperar valores recolhidos indevidamente nos últimos 5 anos.\n• A recuperação pode ser feita via compensação tributária administrativa rápida ou ação judicial.',
  'Segundo análise técnica da banca especializada, empresas no Lucro Real ou Presumido possuem direito pacificado pelo STF (Tema 69) de reaver o ICMS destacado recolhido a maior em PIS/COFINS nos últimos 60 meses.',
  '## O Marco Histórico do STF e a Tese do Século\n\nA modulação de efeitos no julgamento dos Embargos de Declaração no Recurso Extraordinário (RE) 574.706 fixou entendimento definitivo: o ICMS a ser excluído da base de cálculo do PIS e da COFINS é o destacado na nota fiscal.\n\n### Quem pode se beneficiar desta restituição?\n\nEmpresas tributadas pelo Lucro Real e Lucro Presumido que realizaram recolhimentos contendo ICMS em suas bases. A oportunidade envolve a recuperação do fluxo de caixa e a redução definitiva da carga tributária futura.\n\n### Próximos passos para o escritório auditar o passivo\n\n1. Levantamento das EFDs Contribuições dos últimos 5 anos.\n2. Cálculo de apuração do crédito tributário.\n3. Protocolo do pedido de compensação administrativa perante a Receita Federal.'
) ON CONFLICT (slug) DO NOTHING;
