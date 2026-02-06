import { Theme } from '@radix-ui/themes';
import { Poppins } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import Providers from '@/frontend/components/Providers';
import QueryProvider from '@/frontend/components/QueryProvider';
import type { Metadata } from 'next';
import type { FunctionComponent } from 'react';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--default-font'
});

// resets
import '@/frontend/styles/reset.css';

// radix styles
import '@radix-ui/themes/styles.css';

import '@/frontend/styles/theme-config.css';
import '@/frontend/styles/media.scss';
import '@/frontend/styles/global.scss';

export const metadata: Metadata = {
  // TODO: set appropriate metadata
  title: 'Welmica Visualizer',
  description: ''
};

const Layout: FunctionComponent<LayoutProps<'/'>> = ({ children }) => {
  return (
    <html lang='en' data-scroll-behavior='smooth'>
      <Theme
        asChild
        appearance='light'
        accentColor='red'
        grayColor='auto'
        radius='medium'
        panelBackground='translucent'
      >
        <body className={poppins.variable}>
          <Providers>
            <NextTopLoader
              showSpinner={false}
              height={3}
              color='var(--accent-9)'
            />
            <QueryProvider>{children}</QueryProvider>
          </Providers>
        </body>
      </Theme>
    </html>
  );
};

export default Layout;
