import { useMemo, useState } from 'react';
import { CalendarDays, Clock3, LayoutGrid, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContents } from '@/hooks/useContents';
import { cn } from '@/lib/utils';
import { CalendarView } from './CalendarView';
import { KanbanView } from './KanbanView';

type ViewMode = 'calendar' | 'kanban';

export function EditorialCalendar() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const { contents } = useContents();

  const summary = useMemo(() => [
    {
      label: 'Publicações agendadas',
      value: contents.filter((content) => content.status === 'aprovado' && content.scheduledDate).length,
      icon: CalendarDays,
      tone: 'text-primary',
    },
    {
      label: 'Aguardando revisão',
      value: contents.filter((content) => content.status === 'revisao').length,
      icon: Clock3,
      tone: 'text-yellow-400',
    },
    {
      label: 'Aprovados',
      value: contents.filter((content) => content.status === 'aprovado').length,
      icon: ListChecks,
      tone: 'text-emerald-400',
    },
  ], [contents]);

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-sm font-medium text-primary">Planejamento editorial</p>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Planejador de Conteúdo
          </h1>
          <p className="text-muted-foreground">
            Organize o que precisa ser revisado, aprovado e publicado em um só lugar.
          </p>
        </div>

        <div
          className="flex w-full max-w-sm items-center gap-1 rounded-xl border border-border bg-muted/70 p-1 xl:w-auto"
          role="group"
          aria-label="Visualização do planejamento"
        >
          <Button
            type="button"
            variant={viewMode === 'calendar' ? 'default' : 'ghost'}
            size="sm"
            aria-pressed={viewMode === 'calendar'}
            onClick={() => setViewMode('calendar')}
            className={cn('flex-1 gap-2 sm:flex-none', viewMode === 'calendar' && 'shadow-lg')}
          >
            <CalendarDays className="h-4 w-4" />
            Calendário
          </Button>
          <Button
            type="button"
            variant={viewMode === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            aria-pressed={viewMode === 'kanban'}
            onClick={() => setViewMode('kanban')}
            className={cn('flex-1 gap-2 sm:flex-none', viewMode === 'kanban' && 'shadow-lg')}
          >
            <LayoutGrid className="h-4 w-4" />
            Status
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {summary.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 px-4 py-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <item.icon className={cn('h-4 w-4', item.tone)} />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-semibold leading-none text-foreground">{item.value}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {viewMode === 'calendar' ? <CalendarView /> : <KanbanView />}
    </div>
  );
}
