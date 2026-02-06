import { r2Storage } from './r2Storage';
import { totpPlugin } from './totp';
import type { Plugin } from 'payload';

const plugins: Plugin[] = [ totpPlugin, r2Storage];

export default plugins;
