import { propertyRange } from '@/configs/propertyRange';
import { anyone } from '@/payload/access/anyone';
import { authenticated } from '@/payload/access/authenticated';
import { RangeField } from '@/payload/fields/range';
import { responsiveMediaField } from '@/payload/fields/responsiveMedia';
import { slugField } from '@/payload/fields/slug';
import type { CollectionConfig } from 'payload';

const { glossyness, roughness } = propertyRange;

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated
  },
  admin: {
    useAsTitle: 'label'
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          name: 'details',
          fields: [
            {
              type: 'relationship',
              name: 'category',
              relationTo: 'productCategories',
              required: true
            },
            {
              type: 'relationship',
              name: 'collection',
              relationTo: 'collections',
              required: true
            },
            {
              type: 'relationship',
              name: 'series',
              relationTo: 'series',
              required: true
            },
            {
              type: 'text',
              name: 'dimension',
              admin: {
                description:
                  'Only for display purpose. Has no effect on actual render'
              }
            },
            {
              type: 'text',
              name: 'finish',
              admin: {
                description:
                  'Only for display purpose. Has no effect on actual render'
              }
            },
            {
              type: 'text',
              name: 'thickness',
              admin: {
                description:
                  'Only for display purpose. Has no effect on actual render'
              }
            },

            {
              type: 'array',
              name: 'specifications',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      type: 'text',
                      name: 'key',
                      required: true
                    },
                    {
                      type: 'text',
                      name: 'value',
                      required: true
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          label: 'Render Settings',
          name: 'properties',
          fields: [
            {
              type: 'number',
              name: 'width',
              required: true,
              admin: {
                description: 'Real world width in CM.'
              }
            },
            {
              type: 'number',
              name: 'height',
              required: true,
              admin: {
                description: 'Real world height in CM.'
              }
            },
            {
              type: 'relationship',
              name: 'applicationAreas',
              relationTo: 'applicationAreas',
              hasMany: true,
              required: true,
              admin: {
                description:
                  'Select all the areas where this product should be allowed to be applied on.'
              }
            },
            RangeField(
              {
                min: glossyness.min,
                max: glossyness.max,
                step: 0.01
              },
              {
                name: 'glossyness',
                required: true,
                admin: {
                  description: `Define product's glossyness in range from ${glossyness.min} to ${glossyness.max}`
                }
              }
            ),
            RangeField(
              {
                min: roughness.min,
                max: roughness.max,
                step: 0.1
              },
              {
                name: 'roughness',
                label: 'Roughness  (Optional)',
                admin: {
                  description: `Define product's roughness in range from ${roughness.min} to ${roughness.max}`
                }
              }
            ),
            {
              type: 'group',
              name: 'groove',
              fields: [
                {
                  type: 'number',
                  name: 'thickness',
                  label: 'Thickness in CM',
                  defaultValue: 0
                },
                {
                  type: 'row',
                  fields: [
                    {
                      type: 'number',
                      name: 'r',
                      min: 0,
                      max: 255,
                      admin: {
                        description: 'Red channel value ranging from 0 to 255'
                      }
                    },
                    {
                      type: 'number',
                      name: 'g',
                      min: 0,
                      max: 255,
                      admin: {
                        description: 'Green channel value ranging from 0 to 255'
                      }
                    },
                    {
                      type: 'number',
                      name: 'b',
                      min: 0,
                      max: 255,
                      admin: {
                        description: 'Blue channel value ranging from 0 to 255'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          label: 'Images',
          name: 'media',
          fields: [
            responsiveMediaField({
              name: 'images',
              required: true,
              hasMany: true,
              admin: {
                description:
                  'Make sure the aspect ratio and orientation of the images matches with the product dimensions in Render Settings tab.'
              }
            })
          ]
        }
        //     {
        //       label: 'Images',
        //       fields: [
        //         {
        //           type: 'upload',
        //           name: 'images',
        //           required: true,
        //           hasMany: true,
        //           relationTo: 'productImages'
        //         }

        //         // {
        //         //   type: 'array',
        //         //   name: 'images',
        //         //   fields: [
        //         //     {
        //         //       type: 'upload',
        //         //       name: 'base',
        //         //       required: true,
        //         //       relationTo: 'productImages'
        //         //     },
        //         //     {
        //         //       type: 'upload',
        //         //       name: 'alpha',
        //         //       relationTo: 'productImages'
        //         //     }
        //         //   ]
        //         // }
        //       ]
        //     }
      ]
    },
    {
      type: 'text',
      name: 'label',
      required: true,
      admin: {
        position: 'sidebar'
      }
    },
    ...slugField('label', { admin: { position: 'sidebar' } })
  ]
};
