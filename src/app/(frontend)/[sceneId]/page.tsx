import { notFound } from 'next/navigation';
import { getProductCollections } from '@/lib/getProductCollections';
import { getProductSeries } from '@/lib/getProductSeries';
import { getSceneConfigsById } from '@/lib/getSceneConfigsById';
import Header from './_components/Header';
import Main from './_components/Main';
import type { PopulatedScene } from './_components/types';
import type { FunctionComponent } from 'react';

const Page: FunctionComponent<PageProps<'/[sceneId]'>> = async ({ params }) => {
  const { sceneId } = await params;

  const [scene, collections, series] = await Promise.all([
    getSceneConfigsById(sceneId),
    getProductCollections(),
    getProductSeries()
  ]);

  if (!scene) notFound();

  // Cast to PopulatedScene (getSceneConfigsById fetches with depth: 5)
  const populatedScene = scene as unknown as PopulatedScene;

  return (
    <>
      <Header />
      <Main
        scene={populatedScene}
        productFilterData={{ collections, series }}
      />
    </>
  );
};

export default Page;
