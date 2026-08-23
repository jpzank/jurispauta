import { lawAreaOptions, legacyLawAreas } from '@/types/content';
import {
  MAX_CONTENTS,
  MAX_CONTENT_LENGTH,
  MAX_ID_LENGTH,
  MAX_STORAGE_CHARS,
  MAX_TITLE_LENGTH,
  isValidText,
} from '@/lib/contentValidation';
import type {
  ContentFormat,
  ContentItem,
  ContentStatus,
  FunnelStage,
  LawArea,
} from '@/types/content';

export const LOCAL_CONTENTS_STORAGE_KEY = 'lexcontent:contents:v1';

const lawAreas = new Set<LawArea>([
  ...lawAreaOptions.map((option) => option.value),
  ...legacyLawAreas,
]);
const funnelStages = new Set<FunnelStage>(['topo', 'meio', 'fundo']);
const contentFormats = new Set<ContentFormat>(['reels', 'carrossel', 'stories']);
const contentStatuses = new Set<ContentStatus>([
  'rascunho',
  'revisao',
  'aprovado',
  'publicado',
]);

type StoredContent = Omit<ContentItem, 'scheduledDate' | 'createdAt' | 'updatedAt'> & {
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
};

let cachedContents: ContentItem[] | undefined;
const listeners = new Set<() => void>();
let storageListenerAttached = false;
let localMutationQueue: Promise<void> = Promise.resolve();

const STORAGE_LOCK_NAME = `${LOCAL_CONTENTS_STORAGE_KEY}:write`;

export type LocalContentsFailureReason =
  | 'unavailable'
  | 'too-many-contents'
  | 'too-large'
  | 'storage-error'
  | 'no-change';

export type LocalContentsMutationResult =
  | { ok: true; contents: ContentItem[] }
  | { ok: false; contents: ContentItem[]; reason: LocalContentsFailureReason };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseDate = (value: unknown): Date | undefined => {
  if (typeof value !== 'string') return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const deserializeContent = (value: unknown): ContentItem | null => {
  if (!isRecord(value)) return null;

  const createdAt = parseDate(value.createdAt);
  const updatedAt = parseDate(value.updatedAt);
  const scheduledDate = value.scheduledDate == null ? undefined : parseDate(value.scheduledDate);

  if (
    !isValidText(value.id, MAX_ID_LENGTH) ||
    !isValidText(value.title, MAX_TITLE_LENGTH) ||
    !isValidText(value.content, MAX_CONTENT_LENGTH) ||
    !lawAreas.has(value.lawArea as LawArea) ||
    !funnelStages.has(value.funnelStage as FunnelStage) ||
    !contentFormats.has(value.format as ContentFormat) ||
    !contentStatuses.has(value.status as ContentStatus) ||
    !createdAt ||
    !updatedAt ||
    (value.scheduledDate != null && !scheduledDate)
  ) {
    return null;
  }

  return {
    id: value.id,
    title: value.title,
    content: value.content,
    lawArea: value.lawArea as LawArea,
    funnelStage: value.funnelStage as FunnelStage,
    format: value.format as ContentFormat,
    status: value.status as ContentStatus,
    scheduledDate,
    createdAt,
    updatedAt,
  };
};

const serializeContent = (content: ContentItem): StoredContent => ({
  id: content.id,
  title: content.title,
  content: content.content,
  lawArea: content.lawArea,
  funnelStage: content.funnelStage,
  format: content.format,
  status: content.status,
  ...(content.scheduledDate ? { scheduledDate: content.scheduledDate.toISOString() } : {}),
  createdAt: content.createdAt.toISOString(),
  updatedAt: content.updatedAt.toISOString(),
});

const notifyListeners = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // A subscriber must not turn a durable write into an apparent failure.
    }
  });
};

export function loadLocalContents(): ContentItem[] {
  if (cachedContents !== undefined) return cachedContents;
  if (typeof window === 'undefined') return [];

  try {
    const rawContents = window.localStorage.getItem(LOCAL_CONTENTS_STORAGE_KEY);
    if (rawContents && rawContents.length > MAX_STORAGE_CHARS) {
      cachedContents = [];
      return cachedContents;
    }

    const parsedContents: unknown = rawContents ? JSON.parse(rawContents) : [];
    cachedContents = Array.isArray(parsedContents)
      ? parsedContents
          .slice(0, MAX_CONTENTS)
          .map(deserializeContent)
          .filter((content): content is ContentItem => content !== null)
      : [];
  } catch {
    cachedContents = [];
  }

  return cachedContents;
}

function writeLocalContents(contents: ContentItem[]): LocalContentsMutationResult {
  if (typeof window === 'undefined') {
    return { ok: false, contents: [], reason: 'unavailable' };
  }

  if (contents.length > MAX_CONTENTS) {
    return { ok: false, contents: loadLocalContents(), reason: 'too-many-contents' };
  }

  try {
    const serializedContents = JSON.stringify(contents.map(serializeContent));
    if (serializedContents.length > MAX_STORAGE_CHARS) {
      return { ok: false, contents: loadLocalContents(), reason: 'too-large' };
    }

    window.localStorage.setItem(LOCAL_CONTENTS_STORAGE_KEY, serializedContents);
    cachedContents = contents;
  } catch {
    return { ok: false, contents: loadLocalContents(), reason: 'storage-error' };
  }

  notifyListeners();
  return { ok: true, contents };
}

export function saveLocalContents(contents: ContentItem[]): boolean {
  return writeLocalContents(contents).ok;
}

type LockCapableNavigator = Navigator & {
  locks?: {
    request<T>(name: string, callback: () => T | Promise<T>): Promise<T>;
  };
};

async function runWithStorageLock<T>(task: () => T | Promise<T>): Promise<T> {
  if (typeof navigator === 'undefined') return task();

  const locks = (navigator as LockCapableNavigator).locks;
  return locks ? locks.request(STORAGE_LOCK_NAME, task) : task();
}

function enqueueLocalMutation<T>(task: () => Promise<T>): Promise<T> {
  const result = localMutationQueue.then(task, task);
  localMutationQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

export function mutateLocalContents(
  mutate: (contents: ContentItem[]) => ContentItem[] | null,
): Promise<LocalContentsMutationResult> {
  return enqueueLocalMutation<LocalContentsMutationResult>(() =>
    runWithStorageLock<LocalContentsMutationResult>(() => {
      // Another tab may have written while this tab still held a cached snapshot.
      cachedContents = undefined;
      const currentContents = loadLocalContents();
      const nextContents = mutate(currentContents);

      if (nextContents === null) {
        return { ok: false, contents: currentContents, reason: 'no-change' };
      }

      return writeLocalContents(nextContents);
    }),
  ).catch((): LocalContentsMutationResult => ({
      ok: false,
      contents: loadLocalContents(),
      reason: 'storage-error',
  }));
}

const handleStorageChange = (event: StorageEvent) => {
  if (event.key !== null && event.key !== LOCAL_CONTENTS_STORAGE_KEY) return;
  cachedContents = undefined;
  notifyListeners();
};

export function subscribeToLocalContents(listener: () => void) {
  listeners.add(listener);

  if (typeof window === 'undefined') {
    return () => listeners.delete(listener);
  }

  if (!storageListenerAttached) {
    window.addEventListener('storage', handleStorageChange);
    storageListenerAttached = true;
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && storageListenerAttached) {
      window.removeEventListener('storage', handleStorageChange);
      storageListenerAttached = false;
    }
  };
}
