import { PayloadSDK } from '@payloadcms/sdk';
import { globalConfigs } from '@/configs';
import type { Config } from '@/payload-types';

// BASE URL
const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;

// Initialize SDK
export const payloadSDK = new PayloadSDK<Config>({
  baseURL: new URL(globalConfigs.API_URL, baseURL).toString()
});
