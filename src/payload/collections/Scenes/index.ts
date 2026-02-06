import sharp from 'sharp';
import { authenticatedOrPublished } from '@/payload/access/authenticatedOrPublished';
import { isSuperAdmin } from '@/payload/access/isSuperAdmin';
import { responsiveMediaField } from '@/payload/fields/responsiveMedia';
import { coordinateField } from './fields/coordinates';
import type { CollectionConfig } from 'payload';

export const Scenes: CollectionConfig = {
  slug: 'scenes',
  admin: {
    useAsTitle: 'id'
  },
  access: {
    read: authenticatedOrPublished,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin
  },
  orderable: true,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          name: 'general',
          fields: [
            {
              type: 'relationship',
              relationTo: 'ambiences',
              hasMany: false,
              required: true,
              name: 'ambience'
            },
            responsiveMediaField({
              name: 'thumbnail',
              required: true,
              admin: {
                description:
                  'Thumbnail image for the view. No actual impact on rendering.'
              }
            })
          ]
        },
        {
          label: 'Render Passes',
          name: 'passes',
          access: {
            read: isSuperAdmin
          },
          fields: [
            {
              type: 'upload',
              relationTo: 'passes',
              name: 'static',
              required: true,
              label: 'Base'
            },
            {
              type: 'upload',
              relationTo: 'passes',
              name: 'shadow',
              required: true,
              label: 'Lights / Shadows',
              admin: {
                description:
                  'Shadow pass for dynamic segments. Cut shadow by flat wirecolor before uploading.'
              }
            },
            {
              type: 'upload',
              relationTo: 'passes',
              name: 'reflection',
              required: true,
              label: 'Reflection',
              admin: {
                description:
                  'Reflection pass for dynamic segments. Cut reflection by flat wirecolor before uploading.'
              }
            }
          ]
        },
        {
          label: 'Dynamic Segments',
          fields: [
            {
              type: 'array',
              name: 'segments',
              access: {
                read: isSuperAdmin
              },
              interfaceName: 'SceneSegments',
              minRows: 1,
              required: true,
              admin: {
                description:
                  'Sort the segment from farthest to nearest as they appear in the scene.'
              },
              fields: [
                {
                  type: 'select',
                  required: true,
                  hasMany: false,
                  name: 'gravity',
                  label: 'Apply From',
                  options: Object.keys(sharp.gravity),
                  defaultValue: 'centre',
                  admin: {
                    description:
                      'Describe from which direction product placement should be done.'
                  }
                },
                {
                  type: 'relationship',
                  name: 'applicationArea',
                  relationTo: 'applicationAreas',
                  required: true
                },
                {
                  type: 'upload',
                  relationTo: 'passes',
                  name: 'mask',
                  required: true,
                  label: 'Area Mask',
                  admin: {
                    description:
                      'Mask image for the segment. Keep the product placement area white and rest completely transparent.'
                  }
                },
                {
                  type: 'group',
                  name: 'dimension',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          type: 'number',
                          name: 'width',
                          label: 'Area Width (CM)',
                          required: true,
                          min: 0,
                          admin: {
                            description:
                              'Enter real world width of segment in CM.'
                          }
                        },
                        {
                          type: 'number',
                          name: 'height',
                          label: 'Area Height (CM)',
                          required: true,
                          min: 0,
                          admin: {
                            description:
                              'Enter real world height of segment in CM.'
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: 'group',
                  name: 'marker',
                  admin: {
                    description:
                      'Define relative marker position in percentage. (from 0% to 100%)'
                  },
                  fields: [
                    {
                      type: 'text',
                      name: 'label',
                      required: true
                    },
                    {
                      ...coordinateField,
                      required: false,
                      name: 'position'
                    }
                  ]
                },
                {
                  type: 'collapsible',
                  label: 'Perspective Coordinates',
                  admin: {
                    description:
                      'Enter X & Y pixel location for 4 corners of projected segment.'
                  },
                  fields: [
                    {
                      type: 'group',
                      name: 'coordinates',
                      label: 'Perspective Co-ordinates',
                      admin: { hideGutter: true },
                      fields: [
                        {
                          ...coordinateField,
                          name: 'topLeft'
                        },
                        {
                          ...coordinateField,
                          name: 'topRight'
                        },
                        {
                          ...coordinateField,
                          name: 'bottomLeft'
                        },
                        {
                          ...coordinateField,
                          name: 'bottomRight'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  versions: {
    drafts: true
  }
};
