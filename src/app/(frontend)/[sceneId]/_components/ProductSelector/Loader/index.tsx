import { Flex, Spinner, Text } from '@radix-ui/themes';
import styles from './loader.module.scss';
import type { FunctionComponent, HTMLAttributes, RefAttributes } from 'react';

type LoaderProps = HTMLAttributes<HTMLDivElement> &
  RefAttributes<HTMLDivElement>;

const Loader: FunctionComponent<LoaderProps> = (props) => {
  return (
    <Flex
      as='div'
      className={styles.container}
      width='100%'
      p='3'
      align='center'
      justify='center'
      gap='3'
      {...props}
    >
      <Text as='p' color='gray'>
        Loading Products
      </Text>
      <Spinner size='2' />
    </Flex>
  );
};

export default Loader;
