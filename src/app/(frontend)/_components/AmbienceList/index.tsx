'use client';

import { Flex, Button, type ButtonProps } from '@radix-ui/themes';
import { useRouter, useSearchParams } from 'next/navigation';
import ScrollContainer from 'react-indiana-drag-scroll';
import styles from './ambienceList.module.scss';
import type { Ambience } from '@/payload-types';
import type { FunctionComponent, MouseEvent } from 'react';

interface AmbienceListProps {
  ambienceList: Ambience[];
}

const ALL_AMBIENCE_LABEL = 'All';

const sharedButtonProps: Partial<ButtonProps> = {
  className: 'transition',
  size: '2',
  highContrast: true,
  radius: 'large'
};

const AmbienceList: FunctionComponent<AmbienceListProps> = ({
  ambienceList
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedAmbience = searchParams.get('ambience') || ALL_AMBIENCE_LABEL;

  const handleAmbienceChange = (e: MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value === ALL_AMBIENCE_LABEL) {
      params.delete('ambience');
    } else {
      params.set('ambience', value);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (ambienceList.length <= 1) {
    return null;
  }

  return (
    <Flex
      direction='row'
      wrap='nowrap'
      gap='3'
      mx='auto'
      asChild
      className={styles.ambienceList}
    >
      <ScrollContainer>
        <Button
          {...sharedButtonProps}
          variant={selectedAmbience === ALL_AMBIENCE_LABEL ? 'solid' : 'soft'}
          value={ALL_AMBIENCE_LABEL}
          onClick={handleAmbienceChange}
        >
          {ALL_AMBIENCE_LABEL}
        </Button>
        {ambienceList.map((ambience) => (
          <Button
            {...sharedButtonProps}
            variant={ambience.slug === selectedAmbience ? 'solid' : 'soft'}
            key={ambience.id}
            value={ambience.slug}
            onClick={handleAmbienceChange}
          >
            {ambience.label}
          </Button>
        ))}
      </ScrollContainer>
    </Flex>
  );
};

export default AmbienceList;
