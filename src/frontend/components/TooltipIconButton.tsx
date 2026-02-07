import { IconButton, Tooltip } from '@radix-ui/themes';
import classNames from 'classnames';
import type { IconButtonProps } from '@radix-ui/themes';
import type { ReactNode } from 'react';

type TooltipIconButtonProps = IconButtonProps & {
  tooltip: string;
  children: ReactNode;
};

function TooltipIconButton({
  tooltip,
  children,
  className,
  ...props
}: TooltipIconButtonProps) {
  return (
    <Tooltip sideOffset={10} content={tooltip} style={{ zIndex: 12 }}>
      <IconButton
        className={classNames('transition', className)}
        variant='ghost'
        color='gray'
        aria-label={tooltip}
        {...props}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}

export default TooltipIconButton;
