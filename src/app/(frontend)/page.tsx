import { Flex, Heading, Text } from '@radix-ui/themes';
import { getAmbiances } from '@/lib/getAmbiances';
import { getSceneList } from '@/lib/getSceneList';
import AmbienceList from './_components/AmbienceList';
import MainHeader from './_components/MainHeader';
import SceneGrid from './_components/SceneGrid';
import 'react-indiana-drag-scroll/dist/style.css';
import type { Scene } from '@/payload-types';
import type { FunctionComponent } from 'react';

const Page: FunctionComponent<PageProps<'/'>> = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const ambienceSlug = resolvedSearchParams?.ambience as string | undefined;

  const ambiances = await getAmbiances();
  const sceneList = await getSceneList({ ambienceSlug });

  return (
    <>
      <MainHeader />
      <main className='main'>
        <section className='limit_width wide pt pb'>
          <Flex gap='4' mb='7' direction='column' align='center'>
            <Heading as='h1' weight='regular' align='center' size='8'>
              Select Environment
            </Heading>
            <Text size='5' as='p' align='center' color='gray'>
              Choose an environment to visualize our products.
            </Text>
          </Flex>
          <Flex width='100%' align='center'>
            <AmbienceList ambienceList={ambiances} />
            <SceneGrid sceneList={sceneList as Scene[]} />
          </Flex>
        </section>
      </main>
    </>
  );
};

export default Page;
