'use client';

import {
  Button,
  DropdownMenu,
  Flex,
  IconButton,
  type ButtonProps
} from '@radix-ui/themes';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { GoInfo } from 'react-icons/go';
import { IoMdShare, IoIosSwap } from 'react-icons/io';
import { MdRefresh } from 'react-icons/md';
import { clientConfigs } from '@/configs/clientConfigs';
import ShareDesignModal from './ShareDesignModal';
import styles from './header.module.scss';
import type { FunctionComponent } from 'react';

const { homePageUrl, contactPageUrl } = clientConfigs;

const sharedButtonProps: Partial<ButtonProps> = {
  className: 'transition',
  size: { initial: '2', sm: '3' }
};

const Header: FunctionComponent = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const handleReset = () => {
    router.replace(pathname);
  };

  return (
    <>
      <header className={classNames(styles.header, styles.sticky)}>
        <Flex
          direction='row'
          justify='between'
          align='center'
          className='limit_width wide'
          height='100%'
        >
          <Link
            href={homePageUrl || ''}
            className={styles.link}
            target='_blank'
          >
            <img
              src='/media/logo-black.png'
              alt={`${clientConfigs.name} company logo`}
              className={styles.logo}
            />
          </Link>
          <Flex direction='row' align='center' gap='3'>
            <Button
              {...sharedButtonProps}
              variant='soft'
              asChild
              className={classNames(
                sharedButtonProps.className,
                styles.hideInMobile
              )}
            >
              <Link href={'/'}>
                <IoIosSwap size='24px' />
                Change Environment
              </Link>
            </Button>
            {contactPageUrl && (
              <Button
                {...sharedButtonProps}
                asChild
                variant='solid'
                className={classNames(
                  sharedButtonProps.className,
                  styles.hideInMobile
                )}
              >
                <Link href={contactPageUrl} target='_blank'>
                  Contact Us
                </Link>
              </Button>
            )}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <IconButton size='3' variant='outline' color='gray'>
                  <BsThreeDotsVertical size='16px' />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                className={styles.menu}
                variant='soft'
                size='2'
              >
                <DropdownMenu.Item
                  className={classNames(styles.menuItem, styles.hideInDesktop)}
                  asChild
                >
                  <Link href={'/'}>
                    <IoIosSwap color='var(--gray-9)' size='16px' />
                    Change Environment
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className={styles.menuItem}
                  onClick={handleReset}
                >
                  <MdRefresh color='var(--gray-9)' size='16px' />
                  Reset Scene
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className={styles.menuItem}
                  onClick={() => setShareModalOpen(true)}
                >
                  <IoMdShare color='var(--gray-9)' size='16px' />
                  Share Your Design
                </DropdownMenu.Item>
                <DropdownMenu.Item className={styles.menuItem}>
                  <GoInfo color='var(--gray-9)' size='16px' />
                  Help
                </DropdownMenu.Item>
                {contactPageUrl && (
                  <DropdownMenu.Item
                    className={classNames(
                      styles.menuItem,
                      styles.hideInDesktop
                    )}
                  >
                    <Button
                      variant='solid'
                      asChild
                      className={styles.contactButton}
                    >
                      <Link href={contactPageUrl} target='_blank'>
                        Contact Us
                      </Link>
                    </Button>
                  </DropdownMenu.Item>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </Flex>
      </header>
      <ShareDesignModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
      />
    </>
  );
};

export default Header;
