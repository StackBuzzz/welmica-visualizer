'use client';

import { useTheme } from '@payloadcms/ui';
import { Theme as RadixTheme } from '@radix-ui/themes';
import type { ReactNode } from 'react';

// radix styles
import '@radix-ui/themes/tokens/base.css';
import '@radix-ui/themes/tokens/colors/gray.css'; // replace this with appropriate gray colour
import '@radix-ui/themes/components.css';
import '@radix-ui/themes/utilities.css';

function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <RadixTheme
      grayColor='gray'
      accentColor='red'
      radius='medium'
      panelBackground='translucent'
      appearance={theme}
    >
      {children}
    </RadixTheme>
  );
}

export default ThemeProvider;
