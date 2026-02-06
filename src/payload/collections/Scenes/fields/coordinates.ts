import type { GroupField } from 'payload';

type GroupFieldWithoutName = Omit<GroupField, 'name'>;

export const coordinateField: GroupFieldWithoutName = {
  type: 'group',
  admin: {
    hideGutter: true
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          type: 'number',
          name: 'x',
          required: true
        },
        {
          type: 'number',
          name: 'y',
          required: true
        }
      ]
    }
  ]
};
