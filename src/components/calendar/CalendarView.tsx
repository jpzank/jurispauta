import { useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Film,
  Images,
  Smartphone,
} from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContents } from '@/hooks/useContents';
import {
  ContentFormat,
  formatLabels,
  lawAreaLabels,
  statusLabels,
} from '@/types/content';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format as formatDate,
  isSameDay,
  isToday,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const formatIcons: Record<ContentFormat, React.ElementType> = {
  reels: Film,
  carrossel: Images,
  stories: Smartphone,
};

const formatColors: Record<ContentFormat, string> = {
  reels: 'border-primary/30 bg-primary/10 text-primary',
  carrossel: 'border-accent/30 bg-accent/10 text-accent',
  stories: 'border-destructive/30 bg-destructive/10 text-destructive',
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
const publicationLabel = (count: number) => `${count} ${count === 1 ? 'publicação' : 'publicações'}`;

export function CalendarView() {
  const { contents } = useContents();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const approvedContents = useMemo(
    () => contents.filter((content) => content.status === 'aprovado' && content.scheduledDate),
    [contents],
  );

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const getContentsForDay = (day: Date) =>
    approvedContents.filter((content) => content.scheduledDate && isSameDay(content.scheduledDate, day));

  const selectedDateContents = selectedDate ? getContentsForDay(selectedDate) : [];
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const startDay = startOfMonth(currentMonth).getDay();
  const monthLabel = capitalize(formatDate(currentMonth, 'MMMM yyyy', { locale: ptBR }));
  const selectedDateLabel = selectedDate
    ? capitalize(formatDate(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR }))
    : '';

  return (
    <>
      <Card className="border-border/70 bg-card/70 shadow-none">
        <CardHeader className="flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Publicações agendadas</CardTitle>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Clique em uma data marcada para ver o conteúdo completo.
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(new Date())}
            >
              Hoje
            </Button>
            <div className="flex items-center rounded-lg border border-border bg-muted/50 p-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Mês anterior"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[132px] px-2 text-center text-sm font-medium text-foreground">
                {monthLabel}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Próximo mês"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-5">
          {approvedContents.length === 0 && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>Nenhuma publicação aprovada ainda. Os conteúdos agendados aparecerão aqui.</p>
            </div>
          )}

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {weekDays.map((day) => (
              <div key={day} className="py-2 text-center text-xs font-semibold text-muted-foreground sm:text-sm">
                {day}
              </div>
            ))}

            {Array.from({ length: startDay }).map((_, index) => (
              <div key={`empty-${index}`} className="min-h-[78px] sm:min-h-[104px]" aria-hidden="true" />
            ))}

            {days.map((day) => {
              const dayContents = getContentsForDay(day);
              const today = isToday(day);
              const isSelected = selectedDate ? isSameDay(selectedDate, day) : false;

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={dayContents.length === 0}
                  aria-label={`${capitalize(formatDate(day, "d 'de' MMMM", { locale: ptBR }))} — ${publicationLabel(dayContents.length)}`}
                  onClick={() => dayContents.length > 0 && setSelectedDate(day)}
                  className={cn(
                    'group flex min-h-[78px] w-full flex-col rounded-lg border p-1.5 text-left transition-colors sm:min-h-[104px] sm:p-2',
                    dayContents.length > 0
                      ? 'cursor-pointer border-border/70 bg-muted/10 hover:border-primary/50 hover:bg-primary/5'
                      : 'cursor-default border-transparent',
                    today && 'bg-primary/10',
                    isSelected && 'border-primary bg-primary/10 ring-1 ring-primary/30',
                  )}
                >
                  <span
                    className={cn(
                      'mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs sm:text-sm',
                      today ? 'bg-primary font-bold text-primary-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {formatDate(day, 'd')}
                  </span>

                  <span className="space-y-1">
                    {dayContents.slice(0, 2).map((content) => {
                      const Icon = formatIcons[content.format];
                      return (
                        <span
                          key={content.id}
                          className={cn(
                            'flex items-center gap-1 rounded border px-1.5 py-1 text-[11px] leading-tight sm:text-xs',
                            formatColors[content.format],
                          )}
                          title={content.title}
                        >
                          <Icon className="h-3 w-3 shrink-0" />
                          <span className="truncate">{lawAreaLabels[content.lawArea]}</span>
                        </span>
                      );
                    })}
                    {dayContents.length > 2 && (
                      <span className="block px-1 text-[11px] text-muted-foreground sm:text-xs">
                        +{dayContents.length - 2} mais
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={selectedDate !== null} onOpenChange={(open) => !open && setSelectedDate(null)}>
        {selectedDate && (
          <DialogContent className="max-w-2xl overflow-hidden border-border bg-card p-0">
            <DialogHeader className="border-b border-border/70 p-6 pb-5">
              <DialogTitle className="flex items-center gap-2 pr-6 text-xl">
                <CalendarDays className="h-5 w-5 text-primary" />
                {selectedDateLabel}
              </DialogTitle>
              <DialogDescription>
                {publicationLabel(selectedDateContents.length)} agendada{selectedDateContents.length === 1 ? '' : 's'} para esta data.
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[60vh] space-y-3 overflow-y-auto p-6">
              {selectedDateContents.map((content) => {
                const Icon = formatIcons[content.format];
                return (
                  <article key={content.id} className="rounded-xl border border-border bg-muted/20 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-foreground">{content.title}</h3>
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {lawAreaLabels[content.lawArea]}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="shrink-0">{formatLabels[content.format]}</Badge>
                    </div>

                    <div className="mt-4 rounded-lg border border-border/70 bg-background/40 p-3">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                        {content.content}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-primary">
                        {statusLabels[content.status]}
                      </span>
                      <span>Revise antes de publicar</span>
                    </div>
                  </article>
                );
              })}
            </div>

            <DialogFooter className="border-t border-border/70 p-4 sm:p-5">
              <DialogClose asChild>
                <Button type="button" variant="outline">Fechar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
