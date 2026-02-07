'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Flex, IconButton, Text } from '@radix-ui/themes';
import { useCallback, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { TiInfoLarge } from 'react-icons/ti';
import TooltipIconButton from '@/frontend/components/TooltipIconButton';
import Details from './Details';
import ImageSlider from './ImageSlider';
import styles from './specificationModal.module.scss';
import type { ProductDoc } from '../../types';
import type { Collection, Series } from '@/payload-types';
import type { IconButtonProps } from '@radix-ui/themes';
import type { FunctionComponent } from 'react';

interface SpecificationModalProps {
  product: ProductDoc;
  size?: IconButtonProps['size'];
  radius?: IconButtonProps['radius'];
}

const SpecificationModal: FunctionComponent<SpecificationModalProps> = ({
  product,
  size,
  radius
}) => {
  const { label, details } = product;
  const [open, setOpen] = useState<boolean>(false);
  const [isFancyboxOpen, setIsFancyboxOpen] = useState<boolean>(false);

  const handleFancyboxStateChange = useCallback((isOpen: boolean) => {
    setIsFancyboxOpen(isOpen);
  }, []);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen && isFancyboxOpen) return;
      setOpen(newOpen);
    },
    [isFancyboxOpen]
  );

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <TooltipIconButton
          tooltip='More Details'
          color='gray'
          variant='surface'
          size={size || '2'}
          radius={radius || 'medium'}
        >
          <TiInfoLarge />
        </TooltipIconButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title hidden>Product Details</Dialog.Title>
          <Dialog.Description hidden />
          <Flex
            align='center'
            justify='between'
            py='3'
            px='4'
            className={styles.header}
          >
            <Text size='5' as='div' weight='bold'>
              Product Details
            </Text>
            <Dialog.Close asChild>
              <IconButton variant='ghost' size='2' radius='large' color='gray'>
                <IoCloseOutline size={20} />
              </IconButton>
            </Dialog.Close>
          </Flex>

          <Flex
            direction='column'
            gap={{ initial: '4', sm: '6' }}
            p={{ initial: '4', sm: '6' }}
          >
            <ImageSlider
              product={product}
              onFancyboxStateChange={handleFancyboxStateChange}
            />
            <Details
              label={label}
              dimension={details.dimension || ''}
              series={details.series as Series}
              collection={details.collection as Collection}
              specifications={details.specifications}
            />
          </Flex>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SpecificationModal;
