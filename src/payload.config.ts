import path from 'path';
import { fileURLToPath } from 'url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { globalConfigs } from '@/configs';
import { ResponsiveMedia } from '@/payload/collections/ResponsiveMedia';
import { StaticMedia } from '@/payload/collections/StaticMedia';
import { Users } from '@/payload/collections/Users';
import plugins from '@/payload/plugins';
import { Ambiences } from './payload/collections/Ambiences';
import { ApplicationAreas } from './payload/collections/ApplicationAreas';
import { ProductCategories } from './payload/collections/Categories';
import { Collections } from './payload/collections/Collections';
import { Products } from './payload/collections/Products';
import { RenderPasses } from './payload/collections/RenderPasses';
import { Scenes } from './payload/collections/Scenes';
import { Series } from './payload/collections/Series';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const isProd = process.env.NODE_ENV === 'production';

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: `| ${globalConfigs.SITE_NAME}`,
      description: '',
      icons: [
        {
          type: 'image/png',
          rel: 'icon',
          url: '/icon.png'
        }
      ]
    },
    importMap: {
      baseDir: path.resolve(dirname)
    },
    components: {
      providers: ['@/payload/components/ThemeProvider'],
      afterLogin: ['@/payload/components/StackbuzzzBranding.tsx'],
      graphics: {
        Logo: '@/payload/components/Logo.tsx',
        Icon: '@/payload/components/Icon.tsx'
      }
    },
    avatar: 'default'
  },
  routes: {
    admin: globalConfigs.ADMIN_URL,
    api: globalConfigs.API_URL
  },
  collections: [
    Users,
    ResponsiveMedia,
    StaticMedia,
    Collections,
    Series,
    Ambiences,
    ApplicationAreas,
    RenderPasses,
    ProductCategories,
    Products,
    Scenes
  ],
  globals: [],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts')
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || ''
    },
    blocksAsJSON: true,
    migrationDir: 'src/payload/migrations'
  }),
  sharp,
  plugins,
  i18n: { translations: { en: { general: { payloadSettings: 'Settings' } } } }, // change Payload Settings text in account view.

  // EMAIL
  email: isProd
    ? nodemailerAdapter({
        defaultFromAddress: globalConfigs.FROM_EMAIL,
        defaultFromName: 'Team StackBuzzz',
        transportOptions: {
          secure: isProd,
          host: process.env.SMTP_HOST,
          port: isProd ? 465 : 587, // 465 is secured, 587 in not secured
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        }
      })
    : undefined,

  // SECURITY
  graphQL: { disable: true },
  csrf: [],
  // maxDepth: 1,
  upload: {
    abortOnLimit: true,
    limits: {
      fileSize: 1024 * 1024 * 50 // 50 MB
    }
  }
});
