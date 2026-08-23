import { useCallback, useEffect, useState } from 'react';
import { loadLocalContents, mutateLocalContents, subscribeToLocalContents } from '@/lib/localContentsStore';
import { MAX_CONTENT_LENGTH, MAX_TITLE_LENGTH, isValidText } from '@/lib/contentValidation';
import { ContentItem, ContentStatus } from '@/types/content';

const createContentId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export function useContents() {
  const [contents, setContents] = useState<ContentItem[]>(() => loadLocalContents());

  useEffect(() => {
    return subscribeToLocalContents(() => setContents(loadLocalContents()));
  }, []);

  const addContent = useCallback(async (content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!isValidText(content.title, MAX_TITLE_LENGTH) || !isValidText(content.content, MAX_CONTENT_LENGTH)) {
      return null;
    }

    const now = new Date();
    const newContent: ContentItem = {
      ...content,
      id: createContentId(),
      createdAt: now,
      updatedAt: now,
    };
    const result = await mutateLocalContents((currentContents) => [newContent, ...currentContents]);
    return result.ok ? newContent : null;
  }, []);

  const updateContent = useCallback(async (id: string, updates: Partial<ContentItem>) => {
    if (updates.title !== undefined && !isValidText(updates.title, MAX_TITLE_LENGTH)) return false;
    if (updates.content !== undefined && !isValidText(updates.content, MAX_CONTENT_LENGTH)) return false;

    const result = await mutateLocalContents((currentContents) => {
      if (!currentContents.some((content) => content.id === id)) return null;

      return currentContents.map((content) =>
        content.id === id ? { ...content, ...updates, updatedAt: new Date() } : content,
      );
    });
    return result.ok;
  }, []);

  const updateStatus = useCallback(async (id: string, status: ContentStatus, scheduledDate?: Date) => {
    return updateContent(id, scheduledDate === undefined ? { status } : { status, scheduledDate });
  }, [updateContent]);

  const deleteContent = useCallback(async (id: string) => {
    const result = await mutateLocalContents((currentContents) => {
      if (!currentContents.some((content) => content.id === id)) return null;
      return currentContents.filter((content) => content.id !== id);
    });
    return result.ok;
  }, []);

  return {
    contents,
    addContent,
    updateStatus,
    deleteContent,
  };
}
