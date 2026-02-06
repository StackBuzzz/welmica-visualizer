import * as migration_20260206_101659 from './20260206_101659';
import * as migration_20260206_113201 from './20260206_113201';

export const migrations = [
  {
    up: migration_20260206_101659.up,
    down: migration_20260206_101659.down,
    name: '20260206_101659',
  },
  {
    up: migration_20260206_113201.up,
    down: migration_20260206_113201.down,
    name: '20260206_113201'
  },
];
