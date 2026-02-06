'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Button, Flex, IconButton, ScrollArea, Text } from '@radix-ui/themes';
import { IoCloseOutline } from 'react-icons/io5';
import { LiaSlidersHSolid } from 'react-icons/lia';
import { useSet } from 'react-use';
import CheckboxCardGroup from '@/frontend/components/CheckboxCardGroup';
import TooltipIconButton from '@/frontend/components/TooltipIconButton';
import styles from './filterButton.module.scss';
import type { ProductFilters, FilterData } from '../types';
import type { FunctionComponent, MouseEventHandler } from 'react';
import type { StableActions } from 'react-use/esm/useMap';

interface FilterButtonProps {
  iconSize: number;
  data: FilterData;
  currentFilters: ProductFilters;
  setFilters: StableActions<ProductFilters>['setAll'];
}

const FilterButton: FunctionComponent<FilterButtonProps> = ({
  iconSize,
  data,
  currentFilters,
  setFilters
}) => {
  const [
    selectedCollections,
    { toggle: toggleCollection, reset: resetCollections, add: addCollection }
  ] = useSet<number>(new Set([]));

  const [
    selectedSeries,
    { toggle: toggleSeries, reset: resetSeries, add: addSeries }
  ] = useSet<number>(new Set([]));

  // If there's nothing to filter, don't render the button
  if (data.collections.length <= 1 && data.series.length <= 1) {
    return null;
  }

  const handleReset = () => {
    resetCollections();
    resetSeries();
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Initialize with current filters when dialog opens
      currentFilters.collections.forEach((id) => addCollection(id));
      currentFilters.series.forEach((id) => addSeries(id));
    } else {
      // Clear local state when dialog closes without applying
      handleReset();
    }
  };

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = () => {
    setFilters({
      slug: currentFilters.slug,
      debouncedSlug: currentFilters.debouncedSlug,
      collections: Array.from(selectedCollections),
      series: Array.from(selectedSeries)
    });
  };

  const collectionOptions = data.collections.map((c) => ({
    id: c.id,
    label: c.name
  }));

  const seriesOptions = data.series.map((s) => ({
    id: s.id,
    label: s.name
  }));

  const hasActiveFilters =
    currentFilters.collections.length > 0 || currentFilters.series.length > 0;

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <TooltipIconButton
          tooltip='Filter Products'
          className={hasActiveFilters ? styles.activeFilter : undefined}
        >
          <LiaSlidersHSolid size={iconSize} />
        </TooltipIconButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title hidden>Filter Products</Dialog.Title>
          <Dialog.Description hidden />
          <Flex
            align='center'
            justify='between'
            py='3'
            px='4'
            className={styles.header}
          >
            <Text size='4' as='div' weight='bold'>
              Filter Products
            </Text>
            <Dialog.Close asChild>
              <IconButton variant='ghost' size='2' radius='large' color='gray'>
                <IoCloseOutline size={20} />
              </IconButton>
            </Dialog.Close>
          </Flex>
          <Flex direction='column' gap='5'>
            <ScrollArea>
              <Flex
                p='4'
                gap='5'
                direction='column'
                width='100%'
                align='start'
                className={styles.filtersContainer}
              >
                <CheckboxCardGroup
                  label='Collections:'
                  options={collectionOptions}
                  selectedOptions={selectedCollections}
                  onChange={toggleCollection}
                />
                <CheckboxCardGroup
                  label='Series:'
                  options={seriesOptions}
                  selectedOptions={selectedSeries}
                  onChange={toggleSeries}
                />
              </Flex>
            </ScrollArea>
            <Flex
              direction='row'
              gap='2'
              justify='end'
              p='4'
              className={styles.actionRow}
            >
              <Button
                onClick={() => handleReset()}
                size='2'
                variant='outline'
                className='transition'
              >
                Reset Filters
              </Button>
              <Dialog.Close asChild>
                <Button
                  onClick={handleSubmit}
                  size='2'
                  variant='solid'
                  className='transition'
                >
                  Apply Filters
                </Button>
              </Dialog.Close>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default FilterButton;
