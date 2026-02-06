import { CgMenuGridR } from 'react-icons/cg';
import { IoIosList } from 'react-icons/io';
import type { ProductView } from './types';
import type { IconBaseProps } from 'react-icons';

type ViewSelectorProps = IconBaseProps & {
  view: ProductView;
};

function ViewSelectorIcon({ view, ...props }: ViewSelectorProps) {
  const Icon = view === 'grid' ? IoIosList : CgMenuGridR;

  return <Icon {...props} />;
}

export default ViewSelectorIcon;
