export interface Configs {
  SITE_NAME: string;
  LOGO_URL: string;
  ADMIN_URL: string;
  API_URL: string;
  RESPONSIVE_IMAGE_SIZES: number[];
  FROM_EMAIL: string;
  TO_EMAIL: string;
  R2_STORATE_ENABLED: boolean;
}

const isProd = process.env.NODE_ENV === 'production';
const isR2EndpointDefined = typeof process.env.R2_ENDPOINT === 'string';

export const globalConfigs: Configs = {
  SITE_NAME: 'Website',
  LOGO_URL: '/media/logo-white.png',
  ADMIN_URL: '/admin', // MUST MATCH WITH next-sitemap.config.cjs
  API_URL: '/api',
  RESPONSIVE_IMAGE_SIZES: [384, 768, 1024, 1640, 2048, 3072, 4096],

  // EMAILS
  FROM_EMAIL: 'noreply@stackbuzzz.com',
  TO_EMAIL: 'team.stackbuzzz@gmail.com',

  R2_STORATE_ENABLED: isProd && isR2EndpointDefined
};
