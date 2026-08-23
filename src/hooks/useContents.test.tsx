import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveLocalContents } from '@/lib/localContentsStore';
import type { ContentItem } from '@/types/content';
import { useContents } from './useContents';

const makeContent = (overrides: Partial<ContentItem> = {}): ContentItem => ({
  id: 'scheduled',
  title: 'Pauta agendada',
  content: 'Conteúdo fictício para teste.',
  lawArea: 'direito-digital-tecnologia',
  funnelStage: 'topo',
  format: 'carrossel',
  status: 'aprovado',
  scheduledDate: new Date('2026-09-10T12:00:00.000Z'),
  createdAt: new Date('2026-08-23T12:00:00.000Z'),
  updatedAt: new Date('2026-08-23T12:00:00.000Z'),
  ...overrides,
});

beforeEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  window.dispatchEvent(new StorageEvent('storage', { key: null }));
});

describe('useContents', () => {
  it('does not report or render an addition that failed to persist', async () => {
    const { result } = renderHook(() => useContents());
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    });

    let added: Awaited<ReturnType<typeof result.current.addContent>> = null;
    await act(async () => {
      added = await result.current.addContent({
        title: 'Nova pauta',
        content: 'Conteúdo que não será persistido.',
        lawArea: 'direito-digital-tecnologia',
        funnelStage: 'topo',
        format: 'carrossel',
        status: 'rascunho',
      });
    });

    expect(added).toBeNull();
    expect(result.current.contents).toEqual([]);
  });

  it('preserves the schedule on a status move and changes it only when explicit', async () => {
    expect(saveLocalContents([makeContent()])).toBe(true);
    const { result } = renderHook(() => useContents());

    await act(async () => {
      expect(await result.current.updateStatus('scheduled', 'publicado')).toBe(true);
    });

    await waitFor(() => expect(result.current.contents[0]?.status).toBe('publicado'));
    expect(result.current.contents[0]?.scheduledDate?.toISOString()).toBe('2026-09-10T12:00:00.000Z');

    const rescheduledDate = new Date('2026-09-20T12:00:00.000Z');
    await act(async () => {
      expect(await result.current.updateStatus('scheduled', 'aprovado', rescheduledDate)).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.contents[0]?.scheduledDate?.toISOString()).toBe('2026-09-20T12:00:00.000Z');
    });
  });
});
