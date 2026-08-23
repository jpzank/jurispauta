import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, Sparkles, Loader2 } from 'lucide-react';
import { useContents } from '@/hooks/useContents';
import { 
  LawArea, 
  FunnelStage, 
  ContentFormat, 
  lawAreaLabels, 
  lawAreaByValue,
  lawAreaGroups,
  lawAreaOptions,
  funnelStageLabels, 
  funnelStageDescriptions,
  formatLabels 
} from '@/types/content';
import { ContentPreview } from './ContentPreview';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const normalizeSearchText = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const generateMockContent = (area: LawArea, stage: FunnelStage, format: ContentFormat) => {
  const templates: Record<FunnelStage, Record<ContentFormat, string>> = {
    topo: {
      reels: `🎬 VOCÊ SABIA?\n\nMuitos empresários desconhecem seus direitos na área ${lawAreaLabels[area].toLowerCase()}!\n\n✨ Neste vídeo, vou te mostrar 3 pontos essenciais que podem transformar a forma como você lida com questões jurídicas.\n\n💡 Fique até o final para a dica bônus!\n\n#Advocacia #${lawAreaLabels[area]} #DicasJuridicas`,
      carrossel: `📚 GUIA COMPLETO: ${lawAreaLabels[area].toUpperCase()}\n\nSlide 1: Introdução ao tema\nSlide 2: O que você precisa saber\nSlide 3: Principais conceitos\nSlide 4: Erros comuns\nSlide 5: Como se proteger\nSlide 6: Quando buscar ajuda profissional\nSlide 7: CTA - Salve para consultar depois!\n\n#${lawAreaLabels[area]} #DireitoParaTodos`,
      stories: `📱 ENQUETE DO DIA\n\nVocê conhece seus direitos em ${lawAreaLabels[area].toLowerCase()}?\n\n[ ] Sim, totalmente\n[ ] Mais ou menos\n[ ] Preciso aprender mais\n\n⬆️ Responda e veja o resultado!`,
    },
    meio: {
      reels: `⚖️ CASO REAL\n\nUm cliente chegou até mim com um problema comum em ${lawAreaLabels[area].toLowerCase()}...\n\n📋 Situação: [descreva brevemente]\n✅ Solução: [abordagem utilizada]\n🎯 Resultado: [benefício obtido]\n\nVocê já passou por algo parecido?\n\n#AdvocaciaEspecializada #${lawAreaLabels[area]}`,
      carrossel: `🔍 ANÁLISE DE CASO\n\nSlide 1: O problema enfrentado\nSlide 2: Diagnóstico jurídico\nSlide 3: Estratégias possíveis\nSlide 4: A solução escolhida\nSlide 5: Resultados alcançados\nSlide 6: Lições aprendidas\nSlide 7: Entre em contato para uma análise do seu caso\n\n#CasoReal #${lawAreaLabels[area]}`,
      stories: `💬 PERGUNTA FREQUENTE\n\n"Como funciona [aspecto específico de ${lawAreaLabels[area].toLowerCase()}]?"\n\nA resposta pode te surpreender...\n\n➡️ Arraste para ver a explicação completa`,
    },
    fundo: {
      reels: `🤝 COMO POSSO AJUDAR?\n\nAtuação profissional em ${lawAreaLabels[area].toLowerCase()}, com atendimento personalizado e linguagem clara.\n\n✅ Explique aqui sua forma de trabalho\n✅ Informe suas áreas de atuação\n✅ Revise o texto antes de publicar\n\n📌 Convite informativo: saiba mais sobre o serviço no canal oficial.\n\n#Advocacia #${lawAreaLabels[area]} #InformacaoJuridica`,
      carrossel: `📚 CONHEÇA MEU TRABALHO\n\nSlide 1: Como atuo em ${lawAreaLabels[area]}\nSlide 2: Temas que estudo e acompanho\nSlide 3: Como funciona o primeiro contato\nSlide 4: Informações e documentos normalmente avaliados\nSlide 5: O que pode ser explicado em uma orientação inicial\nSlide 6: Limites deste conteúdo informativo\nSlide 7: Consulte um profissional habilitado para o seu caso\n\n#Advocacia #${lawAreaLabels[area]}`,
      stories: `💬 DÚVIDA JURÍDICA?\n\nVocê quer entender melhor um tema de ${lawAreaLabels[area].toLowerCase()}?\n\n✅ Responda à enquete com uma dúvida geral\n✅ Evite compartilhar dados pessoais\n✅ Procure orientação profissional para uma análise individual\n\n📌 Este material é informativo e deve ser revisado antes da publicação.`,
    },
  };

  return {
    title: `${formatLabels[format]} - ${lawAreaLabels[area]} - ${funnelStageLabels[stage]}`,
    content: templates[stage][format],
  };
};

export function ContentCreator() {
  const [lawArea, setLawArea] = useState<LawArea | ''>('');
  const [lawAreaOpen, setLawAreaOpen] = useState(false);
  const [funnelStage, setFunnelStage] = useState<FunnelStage | ''>('');
  const [format, setFormat] = useState<ContentFormat | ''>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{ title: string; content: string } | null>(null);
  
  const { addContent } = useContents();
  const { toast } = useToast();

  const canGenerate = lawArea && funnelStage && format;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    
    setIsGenerating(true);
    setGeneratedContent(null);
    
    // Keep the preview interaction asynchronous until a server-side model is
    // introduced behind a validated API boundary.
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const content = generateMockContent(lawArea as LawArea, funnelStage as FunnelStage, format as ContentFormat);
    setGeneratedContent(content);
    setIsGenerating(false);
  };

  const handleApprove = async (scheduledDate: Date) => {
    if (!generatedContent || !lawArea || !funnelStage || !format) return;

    const result = await addContent({
      title: generatedContent.title,
      content: generatedContent.content,
      lawArea: lawArea as LawArea,
      funnelStage: funnelStage as FunnelStage,
      format: format as ContentFormat,
      status: 'aprovado',
      scheduledDate,
    });

    if (result) {
      toast({
        title: 'Conteúdo aprovado!',
        description: 'O conteúdo foi salvo e adicionado ao Planejador de Conteúdo.',
      });

      // Reset state
      setGeneratedContent(null);
      setLawArea('');
      setFunnelStage('');
      setFormat('');
    } else {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o conteúdo. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Criar Conteúdo</h1>
        <p className="text-muted-foreground">Crie um rascunho editorial com modelos locais e revise antes de publicar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Configurações do Conteúdo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="law-area" className="text-sm font-medium text-foreground">Área de Atuação</label>
              <Popover open={lawAreaOpen} onOpenChange={setLawAreaOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="law-area"
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={lawAreaOpen}
                    className="w-full justify-between bg-muted border-border font-normal"
                  >
                    <span className={cn('truncate', !lawArea && 'text-muted-foreground')}>
                      {lawArea ? lawAreaLabels[lawArea] : 'Digite ou selecione a área'}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-[--radix-popover-trigger-width] p-0 bg-popover border-border"
                >
                  <Command
                    filter={(value, search) => {
                      const option = lawAreaByValue.get(value as typeof lawAreaOptions[number]['value']);
                      if (!option) return 0;

                      const searchableText = normalizeSearchText(
                        `${option.label} ${option.group} ${option.value}`,
                      );
                      return searchableText.includes(normalizeSearchText(search)) ? 1 : 0;
                    }}
                  >
                    <CommandInput placeholder="Digite para buscar uma área..." />
                    <CommandList>
                      <CommandEmpty>Nenhuma área encontrada.</CommandEmpty>
                      {lawAreaGroups.map((group) => (
                        <CommandGroup key={group} heading={group}>
                          {lawAreaOptions
                            .filter((option) => option.group === group)
                            .map((option) => (
                              <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={() => {
                                  setLawArea(option.value);
                                  setLawAreaOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    lawArea === option.value ? 'opacity-100' : 'opacity-0',
                                  )}
                                />
                                {option.label}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Digite parte do nome, como “LGPD”, “contratos” ou “ambiental”, para filtrar.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="funnel-stage" className="text-sm font-medium text-foreground">Objetivo do conteúdo</label>
              <Select value={funnelStage} onValueChange={(v) => setFunnelStage(v as FunnelStage)}>
                <SelectTrigger id="funnel-stage" className="bg-muted border-border">
                  <SelectValue placeholder="Escolha o objetivo" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {Object.entries(funnelStageLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {funnelStage
                  ? funnelStageDescriptions[funnelStage]
                  : 'Escolha se o conteúdo deve atrair, aprofundar a confiança ou apresentar sua atuação.'}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="content-format" className="text-sm font-medium text-foreground">Formato</label>
              <Select value={format} onValueChange={(v) => setFormat(v as ContentFormat)}>
                <SelectTrigger id="content-format" className="bg-muted border-border">
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {Object.entries(formatLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={!canGenerate || isGenerating}
              className="w-full"
              variant="glow"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar rascunho
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <ContentPreview 
          content={generatedContent}
          format={format as ContentFormat}
          isGenerating={isGenerating}
          onApprove={handleApprove}
          onRegenerate={handleGenerate}
        />
      </div>
    </div>
  );
}
