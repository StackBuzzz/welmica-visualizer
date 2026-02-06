'use client';

import { Flex, Skeleton } from '@radix-ui/themes';
import styles from './productCard.module.scss';
import type { ProductView } from '../types';
import type { FunctionComponent } from 'react';

interface ProductCardSkeletonProps {
  view: ProductView;
}

const ProductCardSkeleton: FunctionComponent<ProductCardSkeletonProps> = ({
  view
}) => {
  if (view === 'grid') {
    return (
      <li className={styles.container}>
        <Skeleton width='100%' height='100px' style={{ aspectRatio: 1 }} />
      </li>
    );
  }

  return (
    <Flex
      direction='row'
      justify='start'
      align='center'
      gap='4'
      asChild
      className={styles.container}
    >
      <li>
        <Skeleton width='90px' height='90px' style={{ borderRadius: '8px' }} />
        <Flex direction='column' flexGrow='1' gap='2'>
          <Skeleton width='70%' height='20px' />
          <Skeleton width='50%' height='16px' />
        </Flex>
      </li>
    </Flex>
  );
};

export default ProductCardSkeleton;
