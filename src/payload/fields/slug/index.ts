import merge from 'lodash/merge';
import { beforeSlugValidate } from './hooks/beforeSlugValidate';
import type { CheckboxField, TextField } from 'payload';

type Slug = (
  fieldToUse: string,
  overrides?: Partial<TextField>
) => [TextField, CheckboxField];

const checkBoxField: CheckboxField = {
  name: 'slugLock',
  type: 'checkbox',
  defaultValue: true,
  admin: {
    hidden: true,
    position: 'sidebar'
  }
};

export const slugField: Slug = (fieldToUse = 'title', overrides = {}) => {
  const slugField: TextField = {
    name: 'slug',
    required: true,
    type: 'text',
    index: true,
    label: 'Slug',
    hooks: {
      beforeValidate: [beforeSlugValidate(fieldToUse)]
    },
    admin: {
      position: 'sidebar',
      components: {
        Field: {
          path: '@/payload/fields/slug/SlugComponent',
          clientProps: {
            fieldToUse,
            checkboxFieldPath: checkBoxField.name
          }
        }
      }
    }
  };

  return [merge(slugField, overrides), checkBoxField];
};
