'use client';

import { Flex } from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import LoadingOverlay from '../LoadingOverlay';
import styles from './scene.module.scss';
import type { SceneData } from '../Visualizer/types';
import type { FunctionComponent } from 'react';

const Visualizer = dynamic(() => import('../Visualizer'), {
  ssr: false,
  loading: () => (
    <LoadingOverlay
      title='Loading your scene...'
      subtitle='Preparing your experience, please wait...'
    />
  )
});

interface SceneProps {
  sceneData: SceneData;
  activeSurfaceId: string;
  onSurfaceSelect: (surfaceId: string) => void;
}

const Scene: FunctionComponent<SceneProps> = ({
  sceneData,
  activeSurfaceId,
  onSurfaceSelect
}) => {
  return (
    <Flex direction='column' className={styles.container}>
      {/* Header with environment switcher */}
      <Visualizer
        sceneData={sceneData}
        onSurfaceSelect={onSurfaceSelect}
        activeSurfaceId={activeSurfaceId}
      />
    </Flex>
  );
};

export default Scene;
