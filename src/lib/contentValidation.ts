export const MAX_CONTENTS = 1000;
export const MAX_ID_LENGTH = 200;
export const MAX_TITLE_LENGTH = 200;
export const MAX_CONTENT_LENGTH = 20_000;

export const MAX_STORAGE_CHARS = 2_000_000;

export const isValidText = (value: unknown, maxLength: number): value is string =>
  typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
