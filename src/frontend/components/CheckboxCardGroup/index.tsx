import { Button, Flex, Text } from '@radix-ui/themes';
import classNames from 'classnames';
import styles from './checkboxCardGroup.module.scss';
import type { FunctionComponent } from 'react';

export type CheckboxCardOption = {
  id: number;
  label: string;
};

interface CheckboxCardGroupProps {
  label: string;
  options: CheckboxCardOption[];
  selectedOptions: Set<number>;
  onChange: (id: number) => void;
}

const CheckboxCardGroup: FunctionComponent<CheckboxCardGroupProps> = ({
  label,
  options,
  selectedOptions,
  onChange
}) => {
  return (
    <Flex direction='column' gap='1' align='start'>
      <Text size='3' weight='regular'>
        {label}
      </Text>
      <Flex direction='row' wrap='wrap' justify='start' align='center' gap='2'>
        {options.map((option) => (
          <Button
            className={classNames('transition', styles.button)}
            size='3'
            onClick={() => onChange(option.id)}
            variant='surface'
            color={selectedOptions.has(option.id) ? undefined : 'gray'}
            key={option.id}
          >
            {option.label}
          </Button>
        ))}
      </Flex>
    </Flex>
  );
};

export default CheckboxCardGroup;
