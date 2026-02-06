'use client';

import { Flex } from '@radix-ui/themes';
import {
  EmailShareButton,
  TelegramShareButton,
  FacebookShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  LinkedinIcon,
  XIcon,
  TelegramIcon,
  EmailIcon
} from 'react-share';
import styles from './socialShare.module.scss';
import type { FunctionComponent } from 'react';

interface SocialShareProps {
  /** Title to be shared */
  title?: string;
  /** Description for platforms that support it */
  description?: string;
}

const SocialShare: FunctionComponent<SocialShareProps> = ({
  title = 'Check out this design!',
  description = ''
}) => {
  // Construct full URL using window.location.origin on client side
  const getShareUrl = (): string => {
    if (typeof window !== 'undefined') {
      return `${window.location.href}`;
    }
    return '';
  };

  const shareUrl = getShareUrl();
  const iconSize = 46;

  return (
    <Flex
      justify={{ initial: 'center', sm: 'between' }}
      align='center'
      wrap='wrap'
      width='100%'
      gap='2'
    >
      <FacebookShareButton
        url={shareUrl}
        className={styles.shareButton}
        aria-label='Share on Facebook'
      >
        <FacebookIcon size={iconSize} className={styles.icon} />
      </FacebookShareButton>

      {/* WhatsApp */}
      <WhatsappShareButton
        url={shareUrl}
        title={title}
        className={styles.shareButton}
        aria-label='Share on WhatsApp'
      >
        <WhatsappIcon size={iconSize} className={styles.icon} />
      </WhatsappShareButton>

      {/* LinkedIn */}
      <LinkedinShareButton
        url={shareUrl}
        title={title}
        summary={description}
        className={styles.shareButton}
        aria-label='Share on LinkedIn'
      >
        <LinkedinIcon size={iconSize} className={styles.icon} />
      </LinkedinShareButton>

      {/* X (Twitter) */}
      <TwitterShareButton
        url={shareUrl}
        title={title}
        className={styles.shareButton}
        aria-label='Share on X'
      >
        <XIcon size={iconSize} className={styles.icon} />
      </TwitterShareButton>

      {/* Telegram */}
      <TelegramShareButton
        url={shareUrl}
        title={title}
        className={styles.shareButton}
        aria-label='Share on Telegram'
      >
        <TelegramIcon size={iconSize} className={styles.icon} />
      </TelegramShareButton>

      {/* Email */}
      <EmailShareButton
        url={shareUrl}
        subject={title}
        body={description}
        className={styles.shareButton}
        aria-label='Share via Email'
      >
        <EmailIcon size={iconSize} className={styles.icon} />
      </EmailShareButton>
    </Flex>
  );
};

export default SocialShare;
