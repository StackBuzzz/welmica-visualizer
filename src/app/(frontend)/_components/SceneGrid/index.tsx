import { Grid } from '@radix-ui/themes';
import Link from 'next/link';
import ResponsiveImage from '@/frontend/components/Media/ResponsiveImage';
import styles from './sceneGrid.module.scss';
import type { Scene } from '@/payload-types';
import type { FunctionComponent } from 'react';

interface SceneGridProps {
  sceneList: Scene[];
}

const SceneGrid: FunctionComponent<SceneGridProps> = ({ sceneList }) => {
  return (
    <Grid gap='6' className={styles.previewGrid}>
      {sceneList.map((scene) => (
        <Link key={scene.id} href={`/${scene.id}`} className={styles.scene}>
          <ResponsiveImage
            className={styles.image}
            data={scene.general.thumbnail}
            alt='scene thumbnail'
          />
        </Link>
      ))}
    </Grid>
  );
};

export default SceneGrid;
