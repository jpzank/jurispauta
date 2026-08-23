import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Calendar, HardDrive, LayoutGrid, Sparkles } from 'lucide-react';
import { useContents } from '@/hooks/useContents';

const navItems = [
  { to: '/', icon: Sparkles, label: 'Criar Conteúdo' },
  { to: '/calendario', icon: Calendar, label: 'Planejador' },
];

export function Sidebar() {
  const location = useLocation();
  const { contents } = useContents();

  const thisMonthCount = contents.filter((c) => {
    const now = new Date();
    const contentDate = c.createdAt;
    return (
      contentDate.getMonth() === now.getMonth() &&
      contentDate.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <aside className="fixed inset-x-0 top-0 z-40 flex h-16 w-full flex-row border-b border-border bg-card md:bottom-0 md:right-auto md:h-screen md:w-64 md:flex-col md:border-b-0 md:border-r">
      <div className="flex shrink-0 items-center border-border p-3 md:block md:border-b md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <LayoutGrid className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">JurisPauta</h1>
            <p className="text-xs text-muted-foreground">Planejamento editorial</p>
          </div>
        </div>
      </div>
      
      <nav className="min-w-0 flex-1 overflow-hidden p-2 md:p-4">
        <ul className="flex h-full items-center justify-end gap-1 md:block md:space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-label={item.label}
                  title={item.label}
                  className={cn(
                    'flex items-center justify-center rounded-lg px-3 py-2 transition-all duration-200 md:justify-start md:gap-3 md:px-4 md:py-3',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="hidden font-medium sm:inline">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="hidden space-y-4 border-t border-border p-4 md:block">
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-2">Conteúdos este mês</p>
          <p className="text-2xl font-bold text-foreground">{thisMonthCount}</p>
        </div>
        <div className="flex items-start gap-2 px-2 text-xs text-muted-foreground">
          <HardDrive className="w-4 h-4 mt-0.5 text-primary" />
          <p>Modo local. Os dados ficam somente neste navegador.</p>
        </div>
      </div>
    </aside>
  );
}
