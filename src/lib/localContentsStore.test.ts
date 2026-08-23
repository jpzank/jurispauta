import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MAX_CONTENTS } from '@/lib/contentValidation';
import type { ContentItem } from '@/types/content';
import {
  LOCAL_CONTENTS_STORAGE_KEY,
  loadLocalContents,
  mutateLocalContents,
  saveLocalContents,
  subscribeToLocalContents,
} from './localContentsStore';

const makeContent = (id: string, overrides: Partial<ContentItem> = {}): ContentItem => ({
  id,
  title: `Pauta ${id}`,
  content: 'Conteúdo fictício para teste.',
  lawArea: 'direito-digital-tecnologia',
  funnelStage: 'topo',
  format: 'carrossel',
  status: 'rascunho',
  createdAt: new Date('2026-08-23T12:00:00.000Z'),
  updatedAt: new Date('2026-08-23T12:00:00.000Z'),
  ...overrides,
});

beforeEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  window.dispatchEvent(new StorageEvent('storage', { key: null }));
});

describe('localContentsStore', () => {
  it('rejects an item beyond the limit without dropping stored content', () => {
    const original = makeContent('original');
    expect(saveLocalContents([original])).toBe(true);

    const overLimit = Array.from({ length: MAX_CONTENTS + 1 }, (_, index) => makeContent(String(index)));
    expect(saveLocalContents(overLimit)).toBe(false);

    expect(loadLocalContents().map((content) => content.id)).toEqual(['original']);
    expect(JSON.parse(window.localStorage.getItem(LOCAL_CONTENTS_STORAGE_KEY) ?? '[]')).toHaveLength(1);
  });

  it('keeps the last durable snapshot when localStorage rejects a write', () => {
    expect(saveLocalContents([makeContent('durable')])).toBe(true);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    });

    expect(saveLocalContents([makeContent('not-saved')])).toBe(false);
    expect(loadLocalContents().map((content) => content.id)).toEqual(['durable']);
  });

  it('invalidates the cache when another tab clears localStorage', () => {
    expect(saveLocalContents([makeContent('cached')])).toBe(true);
    const listener = vi.fn();
    const unsubscribe = subscribeToLocalContents(listener);

    window.localStorage.clear();
    window.dispatchEvent(new StorageEvent('storage', { key: null }));

    expect(listener).toHaveBeenCalledOnce();
    expect(loadLocalContents()).toEqual([]);
    unsubscribe();
  });

  it('serializes same-tab mutations and rereads the latest durable snapshot', async () => {
    expect(saveLocalContents([makeContent('initial')])).toBe(true);

    const externallyWritten = [makeContent('other-tab')].map((content) => ({
      ...content,
      createdAt: content.createdAt.toISOString(),
      updatedAt: content.updatedAt.toISOString(),
    }));
    window.localStorage.setItem(LOCAL_CONTENTS_STORAGE_KEY, JSON.stringify(externallyWritten));

    await Promise.all([
      mutateLocalContents((contents) => [makeContent('first'), ...contents]),
      mutateLocalContents((contents) => [makeContent('second'), ...contents]),
    ]);

    expect(loadLocalContents().map((content) => content.id)).toEqual([
      'second',
      'first',
      'other-tab',
    ]);
  });

  it('returns a storage failure when the browser lock cannot be acquired', async () => {
    expect(saveLocalContents([makeContent('durable')])).toBe(true);
    const originalLocks = (navigator as Navigator & { locks?: unknown }).locks;
    Object.defineProperty(navigator, 'locks', {
      configurable: true,
      value: { request: () => Promise.reject(new DOMException('Denied', 'SecurityError')) },
    });

    try {
      const result = await mutateLocalContents((contents) => [makeContent('not-saved'), ...contents]);
      expect(result).toMatchObject({ ok: false, reason: 'storage-error' });
      expect(loadLocalContents().map((content) => content.id)).toEqual(['durable']);
    } finally {
      Object.defineProperty(navigator, 'locks', { configurable: true, value: originalLocks });
    }
  });
});
