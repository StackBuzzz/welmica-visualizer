import merge from 'lodash/merge';
import type { RangeConfigs } from './types';
import type { NumberField } from 'payload';

export const RangeField = (
  configs: RangeConfigs,
  overrides: Partial<NumberField> = {}
): NumberField =>
  merge(
    {
      type: 'number',
      name: 'range',
      min: configs.min,
      max: configs.max,
      admin: {
        components: {
          Field: {
            clientProps: { configs },
            path: '@/payload/fields/range/Component.tsx'
          }
        }
      }
    } as NumberField,
    overrides
  ) as NumberField;
