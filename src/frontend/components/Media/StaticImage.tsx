import { isExpandedDoc } from '@/utils/isExpandedDoc';
import { getMediaUrl, getObjectPositionStyles } from './helper';
import type { StaticMedia } from '@/payload-types';
import type { FunctionComponent, ImgHTMLAttributes, Ref } from 'react';

export type StaticImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src'
> & {
  data?: number | StaticMedia;
  ref?: Ref<HTMLImageElement>;
};

const StaticImage: FunctionComponent<StaticImageProps> = ({
  alt,
  data,
  style,
  ...props
}) => {
  if (!data) return null;

  if (!isExpandedDoc<StaticMedia>(data)) {
    console.log('Static media doc not populated correctly.');
    return null;
  }

  return (
    <img
      src={getMediaUrl(data.filename, 'static_media', data.updatedAt)}
      style={{
        ...getObjectPositionStyles(data.focalX, data.focalY),
        ...style
      }}
      alt={data?.alt || alt || ''}
      fetchPriority='auto'
      {...props}
    />
  );
};

export default StaticImage;
