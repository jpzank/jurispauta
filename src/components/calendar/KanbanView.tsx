import { useState } from 'react';
import { Calendar as CalendarIcon, Check, Film, GripVertical, Images, MoreVertical, Smartphone, Trash2 } from 'lucide-react';
import { format, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useContents } from '@/hooks/useContents';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ContentItem, ContentStatus, formatLabels, lawAreaLabels, statusLabels } from '@/types/content';
import { cn } from '@/lib/utils';

const formatIcons = {
  reels: Film,
  carrossel: Images,
  stories: Smartphone,
};

const statusColors: Record<ContentStatus, string> = {
  rascunho: 'border-muted-foreground/25',
  revisao: 'border-yellow-500/40',
  aprovado: 'border-primary/40',
  publicado: 'border-emerald-500/40',
};

const statusHeaderColors: Record<ContentStatus, string> = {
  rascunho: 'text-muted-foreground',
  revisao: 'text-yellow-400',
  aprovado: 'text-primary',
  publicado: 'text-emerald-400',
};

const emptyColumnCopy: Record<ContentStatus, string> = {
  rascunho: 'Novos rascunhos aparecerão aqui',
  revisao: 'Conteúdos aguardando sua revisão',
  aprovado: 'Conteúdos prontos para organizar',
  publicado: 'Conteúdos já publicados',
};

const columns: ContentStatus[] = ['rascunho', 'revisao', 'aprovado', 'publicado'];

function ContentCard({
  content,
  onDelete,
  onUpdateStatus,
}: {
  content: ContentItem;
  onDelete: (id: string) => Promise<boolean>;
  onUpdateStatus: (id: string, status: ContentStatus, scheduledDate?: Date) => Promise<boolean>;
}) {
  const Icon = formatIcons[content.format];
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleCalendarOpen, setScheduleCalendarOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(content.scheduledDate);

  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('contentId', content.id);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleScheduleOpen = () => {
    setScheduleDate(content.scheduledDate);
    setScheduleOpen(true);
  };

  const handleSchedule = async () => {
    if (!scheduleDate || scheduleDate < startOfDay(new Date())) return;

    if (await onUpdateStatus(content.id, 'aprovado', scheduleDate)) {
      setScheduleOpen(false);
    }
  };

  return (
    <article
      aria-label={`Conteúdo ${content.title}`}
      className={cn(
        'rounded-xl border bg-card/80 p-4 transition-colors duration-200 hover:bg-card',
        statusColors[content.status],
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            draggable
            onDragStart={handleDragStart}
            aria-hidden="true"
            title="Arraste para mudar o status"
            className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </span>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <Badge variant="secondary" className="text-xs">{formatLabels[content.format]}</Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label={`Ações para ${content.title}`}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border">
            <DropdownMenuLabel>Mover para</DropdownMenuLabel>
            {columns.map((status) => (
              <DropdownMenuItem
                key={status}
                disabled={status === content.status}
                onSelect={() => void onUpdateStatus(content.id, status)}
              >
                <Check className={cn('mr-2 h-4 w-4', status === content.status ? 'opacity-100' : 'opacity-0')} />
                {statusLabels[status]}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => void onDelete(content.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h4 className="mt-4 line-clamp-2 text-sm font-semibold text-foreground">{content.title}</h4>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{lawAreaLabels[content.lawArea]}</p>

      <p className="mt-3 line-clamp-3 text-sm leading-5 text-muted-foreground">
        {content.content}
      </p>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleScheduleOpen}
        className="mt-3 h-auto w-full justify-start px-0 py-1 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground"
      >
        <CalendarIcon className="h-3.5 w-3.5" />
        {content.scheduledDate
          ? `Reagendar: ${format(content.scheduledDate, "d 'de' MMM", { locale: ptBR })}`
          : 'Agendar publicação'}
      </Button>

      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{content.scheduledDate ? 'Reagendar publicação' : 'Agendar publicação'}</DialogTitle>
            <DialogDescription>
              Ao salvar, o conteúdo será movido para Aprovado e aparecerá no calendário.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <label htmlFor={`schedule-${content.id}`} className="text-sm font-medium text-foreground">
              Data de publicação
            </label>
            <Popover open={scheduleCalendarOpen} onOpenChange={setScheduleCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id={`schedule-${content.id}`}
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !scheduleDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduleDate
                    ? format(scheduleDate, 'PPP', { locale: ptBR })
                    : 'Selecione uma data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto border-border bg-popover p-0" align="start">
                <Calendar
                  mode="single"
                  selected={scheduleDate}
                  onSelect={(date) => {
                    setScheduleDate(date);
                    setScheduleCalendarOpen(false);
                  }}
                  disabled={(date) => date < startOfDay(new Date())}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setScheduleOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" disabled={!scheduleDate} onClick={() => void handleSchedule()}>
              Salvar data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
}

function KanbanColumn({
  status,
  contents,
  onDelete,
  onUpdateStatus,
}: {
  status: ContentStatus;
  contents: ContentItem[];
  onDelete: (id: string) => Promise<boolean>;
  onUpdateStatus: (id: string, status: ContentStatus, scheduledDate?: Date) => Promise<boolean>;
}) {
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const contentId = event.dataTransfer.getData('contentId');
    if (contentId) onUpdateStatus(contentId, status);
  };

  return (
    <section
      className="min-w-0"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      aria-labelledby={`kanban-${status}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn('h-2 w-2 shrink-0 rounded-full bg-current', statusHeaderColors[status])} />
          <h3 id={`kanban-${status}`} className={cn('truncate text-sm font-semibold', statusHeaderColors[status])}>
            {statusLabels[status]}
          </h3>
        </div>
        <Badge variant="secondary" className="shrink-0 text-xs">{contents.length}</Badge>
      </div>

      <div className="min-h-[220px] space-y-3 rounded-xl border border-dashed border-border/70 bg-muted/20 p-3">
        {contents.length === 0 ? (
          <div className="flex min-h-[190px] items-center justify-center p-4 text-center text-sm text-muted-foreground">
            {emptyColumnCopy[status]}
          </div>
        ) : (
          contents.map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              onDelete={onDelete}
              onUpdateStatus={onUpdateStatus}
            />
          ))
        )}
      </div>
    </section>
  );
}

export function KanbanView() {
  const { contents, deleteContent, updateStatus } = useContents();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const content = contents.find((item) => item.id === id);
    if (!content) return false;

    if (window.confirm(`Excluir o conteúdo "${content.title}"?`)) {
      const deleted = await deleteContent(id);
      toast(deleted
        ? { title: 'Conteúdo excluído' }
        : { title: 'Não foi possível excluir', description: 'O armazenamento local não foi alterado.', variant: 'destructive' });
      return deleted;
    }

    return false;
  };

  const handleUpdateStatus = async (id: string, status: ContentStatus, scheduledDate?: Date) => {
    const updated = await updateStatus(id, status, scheduledDate);
    toast(updated
      ? {
          title: scheduledDate ? 'Publicação agendada' : 'Status atualizado',
          description: scheduledDate
            ? `Nova data: ${format(scheduledDate, "d 'de' MMMM", { locale: ptBR })}.`
            : `Movido para ${statusLabels[status]}.`,
        }
      : {
          title: 'Não foi possível salvar',
          description: 'O armazenamento local não foi alterado.',
          variant: 'destructive',
        });
    return updated;
  };

  const groupedContents = columns.reduce((accumulator, status) => {
    accumulator[status] = contents.filter((content) => content.status === status);
    return accumulator;
  }, {} as Record<ContentStatus, ContentItem[]>);

  return (
    <Card className="border-border/70 bg-card/70 shadow-none">
      <CardHeader className="border-b border-border/70 pb-5">
        <CardTitle className="text-xl">Acompanhar por status</CardTitle>
        <p className="text-sm text-muted-foreground">
          Arraste um conteúdo entre as colunas ou use o menu de ações para atualizar o andamento.
        </p>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {columns.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              contents={groupedContents[status]}
              onDelete={handleDelete}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
