'use client';

import { Flex, Heading, Text } from '@radix-ui/themes';
import classNames from 'classnames';
import styles from './loadingOverlay.module.scss';
import type { FunctionComponent } from 'react';

interface LoadingOverlayProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const LoadingOverlay: FunctionComponent<LoadingOverlayProps> = ({
  title = 'Loading',
  subtitle = 'Preparing your experience, please wait…',
  className
}) => {
  return (
    <Flex
      direction='column'
      align='center'
      justify='center'
      width='100%'
      height='100%'
      p='5'
      gap='8'
      className={classNames(styles.container, className)}
    >
      {/* 3D Scene Wrapper */}
      <div className={styles.scene}>
        {/* THE SPINNING CUBE CONTAINER */}
        <div className={styles.cube}>
          {/* Internal Core (The energy source) */}
          <div className={styles.core} />

          {/* CUBE FACES */}
          <div className={classNames(styles.sideWrapper, styles.front)}>
            <div className={styles.face} />
          </div>

          <div className={classNames(styles.sideWrapper, styles.back)}>
            <div className={styles.face} />
          </div>

          <div className={classNames(styles.sideWrapper, styles.right)}>
            <div className={styles.face} />
          </div>

          <div className={classNames(styles.sideWrapper, styles.left)}>
            <div className={styles.face} />
          </div>

          <div className={classNames(styles.sideWrapper, styles.top)}>
            <div className={styles.face} />
          </div>

          <div className={classNames(styles.sideWrapper, styles.bottom)}>
            <div className={styles.face} />
          </div>
        </div>

        {/* Floor Shadow */}
        <div className={styles.shadow} />
      </div>

      {/* Loading Text */}
      <Flex direction='column' align='center' gap='2' mt='0'>
        {title && (
          <Heading as='h3' weight='light' size='6'>
            {title}
          </Heading>
        )}
        {subtitle && (
          <Text as='p' color='gray' size='2'>
            {subtitle}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default LoadingOverlay;
