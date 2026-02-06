'use client';

import { Button, Flex, type ButtonProps } from '@radix-ui/themes';
import classNames from 'classnames';
import Link from 'next/link';
import { clientConfigs } from '@/configs/clientConfigs';
import styles from './mainHeader.module.scss';
import type { FunctionComponent } from 'react';

const { homePageUrl, contactPageUrl } = clientConfigs;

const sharedButtonProps: Partial<ButtonProps> = {
  className: 'transition',
  size: { initial: '2', sm: '3' }
};

const MainHeader: FunctionComponent = () => {
  return (
    <header className={classNames(styles.header, styles.sticky)}>
      <Flex
        direction='row'
        justify='between'
        align='center'
        className='limit_width wide'
        height='100%'
      >
        <Link href={homePageUrl || ''} className={styles.link} target='_blank'>
          <img
            src='/media/logo-black.png'
            alt={`${clientConfigs.name} company logo`}
            className={styles.logo}
          />
        </Link>
        {contactPageUrl && (
          <Button {...sharedButtonProps} asChild variant='solid'>
            <Link href={contactPageUrl} target='_blank'>
              Contact Us
            </Link>
          </Button>
        )}
      </Flex>
    </header>
  );
};

export default MainHeader;
