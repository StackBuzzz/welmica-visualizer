import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  compilers: {
    css: (text) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
    scss: (text) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n')
  },
  paths: {
    '@/*': ['./src/*']
  },
  ignoreDependencies: [],
  ignore: [
    'package.json',
    'next-sitemap.config.cjs',
    'src/payload/migrations/*',
    'src/frontend/styles/media.scss'
  ],
  rules: {
    types: 'off'
  }
};

export default config;
