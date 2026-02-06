'use client';

import { useTheme } from '@payloadcms/ui';
import type { FunctionComponent } from 'react';

const logoWhiteUrl: string = '/media/logo-white.png';
const logoDarkUrl: string = '/media/logo-black.png';

const Logo: FunctionComponent = () => {
  const { theme } = useTheme();

  return (
    <img
      src={theme === 'dark' ? logoWhiteUrl : logoDarkUrl}
      width={230}
      alt='logo'
    />
  );
};

export default Logo;
