'use client';

import { LazyMotion, domMax } from 'motion/react';
import type { FunctionComponent, ReactNode } from 'react';

const Providers: FunctionComponent<{ children: ReactNode }> = ({
  children
}) => {
  return (
    <LazyMotion strict features={domMax}>
      {children}
    </LazyMotion>
  );
};

export default Providers;
