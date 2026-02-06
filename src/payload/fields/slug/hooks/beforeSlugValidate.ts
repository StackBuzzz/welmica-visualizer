import kebabCase from 'lodash/kebabCase';
import type { FieldHook } from 'payload';

export const beforeSlugValidate =
  (fallback: string): FieldHook =>
  ({ data, operation, value }) => {
    if (typeof value === 'string') {
      return kebabCase(value);
    }

    if (operation === 'create' || !data?.slug) {
      const fallbackData = data?.[fallback] || data?.[fallback];

      if (fallbackData && typeof fallbackData === 'string') {
        return kebabCase(fallbackData);
      }
    }

    return value;
  };
