'use client';

import { Flex, Text } from '@radix-ui/themes';
import classNames from 'classnames';
import { m } from 'motion/react';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';
import IconGroup from '@/frontend/components/IconGroup';
import ResponsiveImage from '@/frontend/components/Media/ResponsiveImage';
import TooltipIconButton from '@/frontend/components/TooltipIconButton';
import useFavorites from '@/frontend/hooks/useFavorites';
import SpecificationModal from './SpecificationModal';
import styles from './productCard.module.scss';
import type { ProductDoc, ProductView } from '../types';
import type { FunctionComponent } from 'react';

interface ProductCardProps {
  product: ProductDoc;
  view: ProductView;
  isSelected: boolean;
  onSelect: (productId: string) => void;
}

const MotionImage = m.create(ResponsiveImage);

const ProductCard: FunctionComponent<ProductCardProps> = ({
  product,
  view,
  isSelected,
  onSelect
}) => {
  const { label, details, media } = product;
  const thumb = media.images[0];
  const { isFavorite, toggleFavorite } = useFavorites(String(product.id));

  const handleClick = () => {
    onSelect(String(product.slug));
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite();
  };

  // Build collection/series text
  const collectionText =
    details.collection && typeof details.collection === 'object'
      ? details.collection.name
      : null;
  const seriesText =
    details.series && typeof details.series === 'object'
      ? details.series.name
      : null;

  return (
    <Flex direction='row' justify='start' align='start' gap='1' asChild>
      <m.li
        className={classNames(
          styles.container,
          isSelected && styles.selected,
          'transition'
        )}
        layout
        role='button'
        onClick={handleClick}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <MotionImage
          className={classNames(
            styles.image,
            view === 'grid' && styles.gridView
          )}
          sizes='200px'
          data={thumb}
          alt={`${label} product image`}
          layout
        />
        {view === 'list' && (
          <Flex direction='column' flexGrow='1' gap='1' flexShrink='1' p='2'>
            <Flex direction='row' align='center' justify='between' gap='3'>
              <Text size='3' as='div' weight='medium'>
                {label}
              </Text>
              <IconGroup gap='2'>
                <TooltipIconButton
                  variant='surface'
                  size='2'
                  tooltip={
                    isFavorite ? 'Remove from Favorites' : 'Add to Favorites'
                  }
                  onClick={handleFavoriteClick}
                >
                  {isFavorite ? (
                    <BiSolidHeart color='var(--red-9)' />
                  ) : (
                    <BiHeart />
                  )}
                </TooltipIconButton>
                <div onClick={(e) => e.stopPropagation()}>
                  <SpecificationModal product={product} />
                </div>
              </IconGroup>
            </Flex>
            {(collectionText || seriesText) && (
              <Text size='2' color='gray'>
                {collectionText}
                {collectionText && seriesText && ' • '}
                {seriesText}
              </Text>
            )}
          </Flex>
        )}
      </m.li>
    </Flex>
  );
};

export default ProductCard;
