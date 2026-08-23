import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { saveLocalContents } from '@/lib/localContentsStore';
import type { ContentItem } from '@/types/content';
import { KanbanView } from './KanbanView';

const scheduledContent: ContentItem = {
  id: 'scheduled-card',
  title: 'Pauta fictícia',
  content: 'Conteúdo fictício para validar o reagendamento.',
  lawArea: 'direito-digital-tecnologia',
  funnelStage: 'topo',
  format: 'carrossel',
  status: 'publicado',
  scheduledDate: new Date(2026, 7, 23),
  createdAt: new Date(2026, 7, 20),
  updatedAt: new Date(2026, 7, 20),
};

beforeEach(() => {
  window.localStorage.clear();
  window.dispatchEvent(new StorageEvent('storage', { key: null }));
});

describe('KanbanView', () => {
  it('opens card actions independently from drag and persists a new schedule', async () => {
    expect(saveLocalContents([scheduledContent])).toBe(true);
    render(<KanbanView />);

    fireEvent.click(screen.getByRole('button', { name: 'Reagendar: 23 de ago' }));
    expect(screen.getByRole('dialog', { name: 'Reagendar publicação' })).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Data de publicação'));
    fireEvent.click(screen.getByRole('gridcell', { name: '24' }));
    fireEvent.click(screen.getByRole('button', { name: 'Salvar data' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Reagendar: 24 de ago' })).toBeInTheDocument();
    });
  });
});
