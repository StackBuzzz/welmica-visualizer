'use client';

import classNames from 'classnames';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { stringify } from 'qs-esm';
import { useCallback, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useMedia } from 'react-use';
import ProductSelector from '../ProductSelector';
import Scene from '../Scene';
import { DESKTOP_BREAKPOINT } from '../constants';
import styles from './main.module.scss';
import type { FilterData } from '../ProductSelector/types';
import type { SceneData } from '../Visualizer/types';
import type { SegmentProductMap } from '../types';
import type { FunctionComponent } from 'react';

interface MainProps {
  scene: SceneData;
  productFilterData: FilterData;
}

const Main: FunctionComponent<MainProps> = ({ scene, productFilterData }) => {
  const isDesktop = useMedia(`(min-width: ${DESKTOP_BREAKPOINT})`, false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeSegmentId, setActiveSegmentId] = useState<string>(
    scene.segments[0].id as string
  );

  const segmentProductMap: SegmentProductMap = Object.fromEntries(
    scene.segments
      .map((segment) => [
        segment.id,
        searchParams.get(`applied[${segment.id}]`)
      ])
      .filter((entry) => entry[1] !== null)
  );

  const updateActiveSegment = (segmentId: string) => {
    const foundSegment = scene.segments.find((seg) => seg.id === segmentId);
    if (foundSegment) {
      setActiveSegmentId(foundSegment.id as string);
    }
  };

  const handleProductSelect = (productSlug: string) => {
    if (!activeSegmentId || segmentProductMap[activeSegmentId] === productSlug)
      return;

    const newSearchParams = stringify(
      {
        ...searchParams,
        applied: {
          ...segmentProductMap,
          [activeSegmentId]: productSlug
        }
      },
      { addQueryPrefix: true, arrayFormat: 'brackets', encode: true }
    );

    router.replace(pathname + newSearchParams, { scroll: false });
  };

  const handleLayout = useCallback(() => {
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    <main className={styles.main}>
      <PanelGroup
        direction={isDesktop ? 'horizontal' : 'vertical'}
        className={classNames('limit_width wide', styles.panelGroup)}
        onLayout={handleLayout}
      >
        <Panel defaultSize={55} tagName='section' id='scene-panel'>
          <Scene
            sceneData={scene}
            activeSurfaceId={activeSegmentId}
            onSurfaceSelect={updateActiveSegment}
          />
        </Panel>
        <PanelResizeHandle className={styles.separator}>
          <div className={styles.separatorHandle} />
        </PanelResizeHandle>
        <Panel
          tagName='section'
          defaultSize={45}
          className={styles.productSelectorPanel}
        >
          <ProductSelector
            filterData={productFilterData}
            selectedProductId={segmentProductMap[activeSegmentId]}
            onProductSelect={handleProductSelect}
          />
        </Panel>
      </PanelGroup>
    </main>
  );
};

export default Main;
