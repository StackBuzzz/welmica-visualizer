import { Flex, type FlexProps } from '@radix-ui/themes';
import type { ReactNode } from 'react';

type IconGroupProps = FlexProps & {
  children: ReactNode;
};

function IconGroup({ children, ...props }: IconGroupProps) {
  return (
    <Flex direction='row' gap='4' align='center' {...props}>
      {children}
    </Flex>
  );
}

export default IconGroup;
