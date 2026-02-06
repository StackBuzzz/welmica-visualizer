'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Button, Flex, IconButton, Text } from '@radix-ui/themes';
import { useCallback, useState } from 'react';
import { IoCloseOutline, IoCheckmarkDoneSharp } from 'react-icons/io5';
import { LuCopy } from 'react-icons/lu';
import SocialShare from '@/frontend/components/SocialShare';
import styles from './shareDesignModal.module.scss';
import type { FunctionComponent } from 'react';

interface ShareDesignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareDesignModal: FunctionComponent<ShareDesignModalProps> = ({
  open,
  onOpenChange
}) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = (): string => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const handleCopyLink = useCallback(async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      console.error('Failed to copy link');
    }
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title hidden>Share Design</Dialog.Title>
          <Dialog.Description hidden />
          <Flex
            align='center'
            justify='between'
            py='3'
            px='4'
            className={styles.header}
          >
            <Text size='4' as='div' weight='bold'>
              Share Design
            </Text>
            <Dialog.Close asChild>
              <IconButton variant='ghost' size='2' radius='large' color='gray'>
                <IoCloseOutline size={20} />
              </IconButton>
            </Dialog.Close>
          </Flex>

          <Flex direction='column' gap='4' align='center' p='5'>
            <SocialShare title='Check out my design!' />

            <div className={styles.divider}>OR</div>

            <Flex asChild width='100%'>
              <Button
                size='3'
                variant='soft'
                onClick={handleCopyLink}
                highContrast
              >
                {copied ? (
                  <IoCheckmarkDoneSharp size={20} />
                ) : (
                  <LuCopy size={20} />
                )}
                {copied ? 'Copied' : 'Copy to Clipboard'}
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ShareDesignModal;
