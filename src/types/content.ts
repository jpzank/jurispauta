export type LawAreaGroup =
  | 'Direito Público'
  | 'Direito Privado'
  | 'Direito Social'
  | 'Áreas interdisciplinares e especializadas';

export const legacyLawAreas = [
  'tributario',
  'sucessorio',
  'ma',
  'trabalhista',
  'societario',
  'civil',
  'penal',
  'ambiental',
  'digital',
] as const;

export type LegacyLawArea = (typeof legacyLawAreas)[number];

export const lawAreaOptions = [
  // Direito Público
  { value: 'direito-constitucional', label: 'Direito Constitucional', group: 'Direito Público' },
  { value: 'direito-administrativo', label: 'Direito Administrativo', group: 'Direito Público' },
  { value: 'direito-tributario', label: 'Direito Tributário', group: 'Direito Público' },
  { value: 'direito-financeiro', label: 'Direito Financeiro', group: 'Direito Público' },
  { value: 'direito-economico', label: 'Direito Econômico', group: 'Direito Público' },
  { value: 'direito-regulatorio', label: 'Direito Regulatório', group: 'Direito Público' },
  { value: 'licitacoes-contratos-publicos', label: 'Licitações e contratos públicos', group: 'Direito Público' },
  { value: 'direito-eleitoral', label: 'Direito Eleitoral', group: 'Direito Público' },
  { value: 'direito-ambiental', label: 'Direito Ambiental', group: 'Direito Público' },
  { value: 'direito-urbanistico', label: 'Direito Urbanístico', group: 'Direito Público' },
  { value: 'direito-agrario', label: 'Direito Agrário', group: 'Direito Público' },
  { value: 'direito-militar', label: 'Direito Militar', group: 'Direito Público' },
  { value: 'direito-penal', label: 'Direito Penal', group: 'Direito Público' },
  { value: 'processo-penal', label: 'Processo Penal', group: 'Direito Público' },
  { value: 'execucao-penal', label: 'Execução Penal', group: 'Direito Público' },
  { value: 'direitos-humanos', label: 'Direitos Humanos', group: 'Direito Público' },
  { value: 'direito-internacional-publico', label: 'Direito Internacional Público', group: 'Direito Público' },
  { value: 'direito-infraestrutura', label: 'Direito da Infraestrutura', group: 'Direito Público' },
  { value: 'direito-energia', label: 'Direito de Energia', group: 'Direito Público' },
  { value: 'direito-minerario', label: 'Direito Minerário', group: 'Direito Público' },

  // Direito Privado
  { value: 'direito-civil', label: 'Direito Civil', group: 'Direito Privado' },
  { value: 'direito-civil-obrigacoes', label: 'Direito Civil — Obrigações', group: 'Direito Privado' },
  { value: 'direito-civil-contratos', label: 'Direito Civil — Contratos', group: 'Direito Privado' },
  { value: 'direito-civil-responsabilidade', label: 'Direito Civil — Responsabilidade civil', group: 'Direito Privado' },
  { value: 'direito-civil-familia', label: 'Direito Civil — Família', group: 'Direito Privado' },
  { value: 'direito-civil-sucessoes', label: 'Direito Civil — Sucessões', group: 'Direito Privado' },
  { value: 'direito-civil-pessoas-bens', label: 'Direito Civil — Pessoas e bens', group: 'Direito Privado' },
  { value: 'processo-civil', label: 'Processo Civil', group: 'Direito Privado' },
  { value: 'direito-empresarial', label: 'Direito Empresarial', group: 'Direito Privado' },
  { value: 'direito-societario', label: 'Direito Societário', group: 'Direito Privado' },
  { value: 'direito-contratual-empresarial', label: 'Direito Contratual Empresarial', group: 'Direito Privado' },
  { value: 'recuperacao-judicial-falencia', label: 'Recuperação Judicial e Falência', group: 'Direito Privado' },
  { value: 'fusoes-aquisicoes-ma', label: 'Fusões e Aquisições (M&A)', group: 'Direito Privado' },
  { value: 'direito-bancario', label: 'Direito Bancário', group: 'Direito Privado' },
  { value: 'direito-financeiro-mercado-capitais', label: 'Direito Financeiro e Mercado de Capitais', group: 'Direito Privado' },
  { value: 'direito-securitario', label: 'Direito Securitário', group: 'Direito Privado' },
  { value: 'direito-imobiliario', label: 'Direito Imobiliário', group: 'Direito Privado' },
  { value: 'direito-condominial', label: 'Direito Condominial', group: 'Direito Privado' },
  { value: 'direito-consumidor', label: 'Direito do Consumidor', group: 'Direito Privado' },
  { value: 'direito-propriedade-intelectual', label: 'Direito da Propriedade Intelectual', group: 'Direito Privado' },
  { value: 'direito-concorrencial', label: 'Direito Concorrencial', group: 'Direito Privado' },
  { value: 'direito-digital-tecnologia', label: 'Direito Digital e Tecnologia', group: 'Direito Privado' },
  { value: 'protecao-dados-lgpd', label: 'Proteção de Dados e LGPD', group: 'Direito Privado' },
  { value: 'direito-internacional-privado', label: 'Direito Internacional Privado', group: 'Direito Privado' },
  { value: 'comercio-exterior', label: 'Comércio Exterior', group: 'Direito Privado' },
  { value: 'direito-maritimo', label: 'Direito Marítimo', group: 'Direito Privado' },
  { value: 'direito-aeronautico', label: 'Direito Aeronáutico', group: 'Direito Privado' },
  { value: 'direito-notarial-registral', label: 'Direito Notarial e Registral', group: 'Direito Privado' },

  // Direito Social
  { value: 'direito-trabalho', label: 'Direito do Trabalho', group: 'Direito Social' },
  { value: 'processo-trabalho', label: 'Processo do Trabalho', group: 'Direito Social' },
  { value: 'direito-sindical', label: 'Direito Sindical', group: 'Direito Social' },
  { value: 'direito-previdenciario', label: 'Direito Previdenciário', group: 'Direito Social' },
  { value: 'direito-seguridade-social', label: 'Direito da Seguridade Social', group: 'Direito Social' },
  { value: 'direito-saude', label: 'Direito da Saúde', group: 'Direito Social' },
  { value: 'direito-crianca-adolescente', label: 'Direito da Criança e do Adolescente', group: 'Direito Social' },
  { value: 'direito-pessoa-deficiencia', label: 'Direito da Pessoa com Deficiência', group: 'Direito Social' },
  { value: 'direito-educacao', label: 'Direito da Educação', group: 'Direito Social' },
  { value: 'direito-assistencial', label: 'Direito Assistencial', group: 'Direito Social' },

  // Áreas interdisciplinares e especializadas
  { value: 'arbitragem', label: 'Arbitragem', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'mediacao-conciliacao', label: 'Mediação e conciliação', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'compliance', label: 'Compliance', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'governanca-corporativa', label: 'Governança corporativa', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'investigacoes-internas', label: 'Investigações internas', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'anticorrupcao', label: 'Anticorrupção', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'esg', label: 'ESG', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'direito-desportivo', label: 'Direito Desportivo', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'direito-autoral', label: 'Direito Autoral', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'direito-cultural-entretenimento', label: 'Direito Cultural e do Entretenimento', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'direito-medico-bioetica', label: 'Direito Médico e Bioética', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'direito-animal', label: 'Direito Animal', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'direito-militar-disciplinar', label: 'Direito Militar disciplinar', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'direito-eleitoral-partidario', label: 'Direito Eleitoral e partidário', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'direito-startups', label: 'Direito de Startups', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'direito-franquias', label: 'Direito de franquias', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'direito-construcao', label: 'Direito de construção', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'direito-transportes-logistica', label: 'Direito de transportes e logística', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'direito-agronegocio', label: 'Direito do agronegócio', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'direito-petroleo-gas', label: 'Direito de petróleo e gás', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'direito-telecomunicacoes', label: 'Direito de telecomunicações', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'direito-saude-suplementar', label: 'Direito de saúde suplementar', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'direito-criminal-empresarial', label: 'Direito criminal empresarial', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'direito-criminal-economico', label: 'Direito criminal econômico', group: 'Áreas interdisciplinares e especializadas' },
  { value: 'direito-familia-empresarial-planejamento-sucessorio', label: 'Direito de família empresarial e planejamento sucessório', group: 'Áreas interdisciplinares e especializadas' },
] as const;

export type CanonicalLawArea = (typeof lawAreaOptions)[number]['value'];
export type LawArea = CanonicalLawArea | LegacyLawArea;

export const lawAreaGroups = [
  'Direito Público',
  'Direito Privado',
  'Direito Social',
  'Áreas interdisciplinares e especializadas',
] as const satisfies readonly LawAreaGroup[];

export const lawAreaByValue = new Map(lawAreaOptions.map((option) => [option.value, option]));

const canonicalLawAreaLabels = Object.fromEntries(
  lawAreaOptions.map((option) => [option.value, option.label]),
) as Record<CanonicalLawArea, string>;

export const lawAreaLabels: Record<LawArea, string> = {
  ...canonicalLawAreaLabels,
  tributario: 'Direito Tributário',
  sucessorio: 'Direito Civil — Sucessões',
  ma: 'Fusões e Aquisições (M&A)',
  trabalhista: 'Direito do Trabalho',
  societario: 'Direito Societário',
  civil: 'Direito Civil',
  penal: 'Direito Penal',
  ambiental: 'Direito Ambiental',
  digital: 'Direito Digital e Tecnologia',
};

export type FunnelStage = 'topo' | 'meio' | 'fundo';

export type ContentFormat = 'reels' | 'carrossel' | 'stories';

export type ContentStatus = 'rascunho' | 'revisao' | 'aprovado' | 'publicado';

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  lawArea: LawArea;
  funnelStage: FunnelStage;
  format: ContentFormat;
  status: ContentStatus;
  scheduledDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const funnelStageLabels: Record<FunnelStage, string> = {
  topo: 'Atrair e educar',
  meio: 'Aprofundar e gerar confiança',
  fundo: 'Apresentar sua atuação',
};

export const funnelStageDescriptions: Record<FunnelStage, string> = {
  topo: 'Ensine algo útil e alcance pessoas que ainda estão conhecendo o tema.',
  meio: 'Explique melhor o problema, mostre caminhos e ajude a pessoa a confiar no seu conhecimento.',
  fundo: 'Mostre como você atua e convide para o próximo passo, sem prometer resultado.',
};

export const formatLabels: Record<ContentFormat, string> = {
  reels: 'Reels',
  carrossel: 'Carrossel',
  stories: 'Stories',
};

export const statusLabels: Record<ContentStatus, string> = {
  rascunho: 'Rascunho',
  revisao: 'Em Revisão',
  aprovado: 'Aprovado',
  publicado: 'Publicado',
};
