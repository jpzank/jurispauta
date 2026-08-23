import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="min-h-screen pt-16 md:ml-64 md:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
      
      {/* Background glow effect */}
      <div 
        className="pointer-events-none fixed right-0 top-0 hidden h-[600px] w-[600px] opacity-30 md:block"
        style={{ background: 'var(--gradient-glow)' }}
      />
    </div>
  );
}
