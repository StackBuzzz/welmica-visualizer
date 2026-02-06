'use client';

import { useTheme } from '@payloadcms/ui';
import Link from 'next/link';
import type { FunctionComponent } from 'react';

const logoWhiteUrl: string = '/media/sb-white.png';
const logoDarkUrl: string = '/media/sb-black.png';

const StackbuzzzBranding: FunctionComponent = () => {
  const { theme } = useTheme();

  return (
    <Link
      href='https://stackbuzzz.com'
      aria-label='StackBuzzz Website'
      target='_blank'
      rel='noreferrer'
      style={{
        marginTop: 'calc(var(--base) * 3)',
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}
    >
      <img
        src={theme === 'dark' ? logoWhiteUrl : logoDarkUrl}
        width={200}
        alt='StackBuzzz Logo'
      />
    </Link>
  );
};

export default StackbuzzzBranding;
