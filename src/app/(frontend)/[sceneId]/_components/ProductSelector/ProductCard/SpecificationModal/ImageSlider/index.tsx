'use client';

import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { Box, Flex, IconButton } from '@radix-ui/themes';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { RiFullscreenFill } from 'react-icons/ri';
import ResponsiveImage from '@/frontend/components/Media/ResponsiveImage';
import { getMediaUrl } from '@/frontend/components/Media/helper';
import TooltipIconButton from '@/frontend/components/TooltipIconButton';
import useFavorites from '@/frontend/hooks/useFavorites';
import { isExpandedDoc } from '@/utils/isExpandedDoc';
import styles from './imageSlider.module.scss';
import type { ProductDoc } from '../../../types';
import type { ResponsiveMedia } from '@/payload-types';
import type { FunctionComponent } from 'react';

interface ImageSliderProps {
  product: ProductDoc;
  onFancyboxStateChange?: (isOpen: boolean) => void;
}

const ImageSlider: FunctionComponent<ImageSliderProps> = ({
  product,
  onFancyboxStateChange
}) => {
  const hasMultipleImages = product.media.images.length > 1;
  const { isFavorite, toggleFavorite } = useFavorites(String(product.id));

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    watchDrag: hasMultipleImages
  });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const handleFullscreen = useCallback(() => {
    const currentIndex = emblaApi?.selectedScrollSnap() ?? 0;
    const galleryItems = product.media.images.flatMap((image) => {
      if (isExpandedDoc<ResponsiveMedia>(image)) {
        return {
          src: getMediaUrl(image.filename, 'responsive_media', image.updatedAt),
          type: 'image' as const
        };
      }
      return [];
    });

    Fancybox.show(galleryItems, {
      startIndex: currentIndex,
      Carousel: {
        Fullscreen: { autoStart: true }
      },
      on: {
        init: () => {
          onFancyboxStateChange?.(true);
        },
        ready: (fancybox) => {
          const container = fancybox.getContainer();
          container.style.pointerEvents = 'auto';
        },
        destroy: () => {
          onFancyboxStateChange?.(false);
        }
      }
    });
  }, [emblaApi, product, onFancyboxStateChange]);

  if (product.media.images.length === 0) {
    return null;
  }

  return (
    <Box className={styles.slider}>
      <Box height='100%' width='100%' ref={emblaRef}>
        <Flex height='100%'>
          {product.media.images.map((image, index) => (
            <Flex
              align='center'
              justify='center'
              minWidth='0'
              className={styles.slide}
              key={index}
            >
              <ResponsiveImage
                data={image}
                sizes='768px'
                className={styles.image}
                alt={`Product image ${index + 1}`}
              />
            </Flex>
          ))}
        </Flex>
      </Box>

      <Flex justify='end' gap='2' m='4' className={styles.buttons}>
        <TooltipIconButton
          tooltip={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          size='2'
          radius='large'
          variant='outline'
          onClick={toggleFavorite}
        >
          {isFavorite ? <BiSolidHeart color='var(--red-9)' /> : <BiHeart />}
        </TooltipIconButton>
        <TooltipIconButton
          tooltip='View in full screen'
          size='2'
          radius='large'
          variant='outline'
          onClick={handleFullscreen}
        >
          <RiFullscreenFill />
        </TooltipIconButton>
      </Flex>

      {hasMultipleImages && (
        <>
          <IconButton
            variant='outline'
            color='gray'
            size='2'
            radius='full'
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={scrollPrev}
            aria-label='Previous image'
          >
            <IoChevronBack size={24} />
          </IconButton>
          <IconButton
            variant='outline'
            color='gray'
            size='2'
            radius='full'
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={scrollNext}
            aria-label='Next image'
          >
            <IoChevronForward size={24} />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default ImageSlider;
