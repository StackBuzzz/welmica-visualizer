import merge from 'lodash/merge';
import { isExpandedDoc } from '@/utils/isExpandedDoc';
import { getMediaUrl, getObjectPositionStyles } from './helper';
import type { ResponsiveMedia } from '@/payload-types';
import type { FunctionComponent, ImgHTMLAttributes, Ref } from 'react';

const getSrcSet = (data?: ResponsiveMedia) => {
  if (!data || !data.sizes) return '';

  const { filename, width, sizes, updatedAt } = data;

  return Object.entries(merge(sizes, { [String(width)]: { filename } }))
    .filter(([_, { filename }]) => !!filename)
    .map(
      ([size, { filename }]) =>
        `${getMediaUrl(filename, 'responsive_media', updatedAt)} ${size}w`
    )
    .join(', ');
};

type ResponsiveImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  data?: number | ResponsiveMedia;
  ref?: Ref<HTMLImageElement>;
};

const ResponsiveImage: FunctionComponent<ResponsiveImageProps> = ({
  alt,
  data,
  sizes = '100vw',
  style,
  ...props
}) => {
  if (!data) return null;

  if (!isExpandedDoc<ResponsiveMedia>(data)) {
    console.log('Responsive image doc not populated correctly.');
    return null;
  }

  return (
    <img
      style={{
        ...getObjectPositionStyles(data.focalX, data.focalY),
        ...style
      }}
      srcSet={getSrcSet(data)}
      alt={alt || ''}
      sizes={sizes}
      fetchPriority='auto'
      {...props}
    />
  );
};

export default ResponsiveImage;
