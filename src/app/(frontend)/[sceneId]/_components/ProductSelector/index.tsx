'use client';

import {
  Badge,
  Flex,
  Grid,
  ScrollArea,
  Text,
  TextField
} from '@radix-ui/themes';
import classNames from 'classnames';
import { m } from 'motion/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';
import { IoSearchOutline } from 'react-icons/io5';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useDebounce, useMap } from 'react-use';
import IconGroup from '@/frontend/components/IconGroup';
import TooltipIconButton from '@/frontend/components/TooltipIconButton';
import useFavoritesList from '@/frontend/hooks/useFavoritesList';
import FilterButton from './FilterButton';
import Loader from './Loader';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCard/Skeleton';
import ViewSelectorIcon from './ViewSelectorIcon';
import { useFavoriteProducts } from './useFavoriteProducts';
import { useProductQuery } from './useProductQuery';
import styles from './productSelector.module.scss';
import type { ProductView, ProductFilters, FilterData } from './types';
import type { FunctionComponent } from 'react';

const iconSize = 25;
const SKELETON_COUNT = 10;

interface ProductSelectorProps {
  selectedProductId: string | null;
  filterData: FilterData;
  onProductSelect: (productId: string) => void;
}

const SEARCH_DEBOUNCE = 300;

const ProductSelector: FunctionComponent<ProductSelectorProps> = ({
  selectedProductId,
  filterData,
  onProductSelect
}) => {
  const [view, setView] = useState<ProductView>('list');
  const [showFavorites, setShowFavorites] = useState(false);
  const { favoriteIds, hasFavorites } = useFavoritesList();

  // Auto-switch to all products when no favorites remain
  useEffect(() => {
    if (!hasFavorites) {
      setShowFavorites(false);
    }
  }, [hasFavorites]);

  const [filters, { set, setAll }] = useMap({
    slug: '',
    debouncedSlug: '',
    collections: [],
    series: []
  } as ProductFilters);

  const { slug, debouncedSlug, collections, series } = filters;

  useDebounce(() => set('debouncedSlug', slug), SEARCH_DEBOUNCE, [slug]);

  // Fetch products with filters
  const {
    data,
    isLoading: isProductsLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isError
  } = useProductQuery({
    collections,
    series,
    search: debouncedSlug
  });

  // Fetch favorite products directly by IDs
  const { data: favoriteProducts, isLoading: isFavoritesLoading } =
    useFavoriteProducts(favoriteIds, showFavorites);

  const [infiniteRef, { rootRef }] = useInfiniteScroll({
    loading: isProductsLoading,
    hasNextPage: showFavorites ? false : (hasNextPage ?? false),
    onLoadMore: fetchNextPage,
    disabled: isError || showFavorites,
    rootMargin: '0px 0px 100px 0px'
  });

  const handleViewChange = useCallback(() => {
    setView((prevView) => (prevView === 'list' ? 'grid' : 'list'));
  }, []);

  const handleToggleFavorites = useCallback(() => {
    setShowFavorites((prev) => !prev);
  }, []);

  const allProducts = useMemo(
    () => data?.pages.flatMap((page) => page.docs) ?? [],
    [data]
  );

  const products = showFavorites ? (favoriteProducts ?? []) : allProducts;
  const isLoading = showFavorites ? isFavoritesLoading : isProductsLoading;
  const showSkeletons = isLoading || (isFetching && allProducts.length === 0);

  return (
    <div className={styles.container}>
      {/* Header with search and filters */}
      <Flex
        width='100%'
        direction='column'
        gap='3'
        pb='3'
        className={styles.stickyHeader}
      >
        {/* Search bar */}
        <Flex width='100%' align='center' justify='between' gap='4'>
          <TextField.Root
            placeholder='Type to search...'
            value={slug}
            onChange={(e) => set('slug', e.target.value)}
            style={{ flexGrow: 1 }}
          >
            <TextField.Slot>
              <IoSearchOutline size={18} />
            </TextField.Slot>
          </TextField.Root>
          <IconGroup>
            <TooltipIconButton
              onClick={handleToggleFavorites}
              tooltip={showFavorites ? 'Show All Products' : 'Show Favorites'}
              style={{ position: 'relative' }}
              disabled={!hasFavorites}
            >
              {showFavorites ? (
                <BiSolidHeart size={iconSize} color='var(--red-9)' />
              ) : (
                <BiHeart size={iconSize} />
              )}
              <Badge
                color='red'
                size='1'
                radius='full'
                variant='solid'
                style={{ position: 'absolute', top: -4, right: -4 }}
              >
                {favoriteIds.length}
              </Badge>
            </TooltipIconButton>
            <FilterButton
              iconSize={iconSize}
              data={filterData}
              currentFilters={filters}
              setFilters={setAll}
            />
            <TooltipIconButton
              onClick={handleViewChange}
              tooltip={
                view === 'list' ? 'Switch to Grid View' : 'Switch to List View'
              }
            >
              <ViewSelectorIcon size={iconSize} view={view} />
            </TooltipIconButton>
          </IconGroup>
        </Flex>
      </Flex>

      {/* Product list */}
      <ScrollArea asChild>
        <m.div
          ref={rootRef}
          layout
          layoutScroll
          className={styles.listContainer}
        >
          <Grid
            gap='2'
            className={classNames(
              styles.grid,
              view === 'grid' && styles.compact
            )}
            asChild
          >
            <ul>
              {/* Loading skeletons */}
              {showSkeletons &&
                Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                  <ProductCardSkeleton key={`skeleton-${index}`} view={view} />
                ))}

              {/* Actual products */}
              {!showSkeletons &&
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    view={view}
                    isSelected={String(product.slug) === selectedProductId}
                    onSelect={onProductSelect}
                  />
                ))}

              {/* Empty state */}
              {!showSkeletons && products.length === 0 && (
                <Flex
                  align='center'
                  justify='center'
                  py='9'
                  direction='column'
                  gap='2'
                  style={{ gridColumn: '1 / -1' }}
                >
                  <Text size='3' color='gray'>
                    No products found
                  </Text>
                  <Text size='2' color='gray'>
                    Try adjusting your filters
                  </Text>
                </Flex>
              )}
            </ul>
          </Grid>
          {hasNextPage && <Loader ref={infiniteRef} />}
        </m.div>
      </ScrollArea>
    </div>
  );
};

export default ProductSelector;
