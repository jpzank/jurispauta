import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, RefreshCw, CalendarIcon, Film, Images, Smartphone } from 'lucide-react';
import { ContentFormat } from '@/types/content';
import { format as formatDate, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ContentPreviewProps {
  content: { title: string; content: string } | null;
  format: ContentFormat;
  isGenerating: boolean;
  onApprove: (date: Date) => void;
  onRegenerate: () => void;
}

const formatIcons: Record<ContentFormat, React.ElementType> = {
  reels: Film,
  carrossel: Images,
  stories: Smartphone,
};

export function ContentPreview({ content, format, isGenerating, onApprove, onRegenerate }: ContentPreviewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const FormatIcon = format ? formatIcons[format] : Film;

  const handleApprove = () => {
    if (selectedDate) {
      onApprove(selectedDate);
      setSelectedDate(undefined);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {format && <FormatIcon className="w-5 h-5 text-primary" />}
          Preview do Conteúdo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            <p className="text-muted-foreground">Gerando conteúdo incrível...</p>
          </div>
        ) : content ? (
          <div className="space-y-6 animate-scale-in">
            <div className="bg-muted/50 rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-3">{content.title}</h3>
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">
                {content.content}
              </pre>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="publication-date" className="text-sm font-medium text-foreground">Data de Publicação</label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="publication-date"
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        formatDate(selectedDate, "PPP", { locale: ptBR })
                      ) : (
                        'Selecione uma data'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setIsCalendarOpen(false);
                      }}
                      disabled={(date) => date < startOfDay(new Date())}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={onRegenerate}
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerar
                </Button>
                <Button 
                  onClick={handleApprove}
                  disabled={!selectedDate}
                  className="flex-1"
                  variant="default"
                >
                  <Check className="w-4 h-4" />
                  Aprovar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <FormatIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground">Configure as opções ao lado</p>
              <p className="text-muted-foreground text-sm">e clique em "Gerar Conteúdo"</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
