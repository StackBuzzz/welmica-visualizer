const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const ADMIN_URL = '/admin'; // must same as globalConfigs.ADMIN_URL

/** @type {import('next-sitemap').IConfig} */
const sitemapconfigs = {
  siteUrl: BASE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: ['/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: `${ADMIN_URL}/*`
      }
    ],
    additionalSitemaps: ['/pages-sitemap.xml', '/products-sitemap.xml'].map(
      (path) => BASE_URL + path
    )
  }
};

module.exports = sitemapconfigs;
