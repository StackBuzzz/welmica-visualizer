import { payloadTotp } from 'payload-totp';
import type { Plugin } from 'payload';

const isProd = process.env.NODE_ENV === 'production';

export const totpPlugin: Plugin = payloadTotp({
  collection: 'users',
  forceSetup: isProd,
  disableAccessWrapper: true,
  disabled: !isProd
});
