import {
  Tab,
  TabPanel,
  TabList,
  TabPanels,
  Tabs,
  chakra,
  Container,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import TabBadge from '../../components/ResourcePage/TabBadge';
import ResourceDataSection from '../../components/ResourcePage/ResourceDataSection';
import { useRouter } from 'next/router';
import Seo from '../../components/Seo';
import ResourceHeader from '../../components/ResourceHeader';
import { GetStaticPaths, GetStaticProps } from 'next';
import { trpc } from '../../utils/trpc';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '../../server/_app';
import superjson from 'superjson';

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [],
//     fallback: 'blocking',
//   };
// };

// export const getStaticProps: GetStaticProps = async (context) => {
//   // trpc time
//   const { slug } = context.params as {
//     slug: string;
//     type: 'tag' | 'search';
//     search: string;
//   };

//   const helpers = createServerSideHelpers({
//     router: appRouter,
//     ctx: {},
//     transformer: superjson, // optional - adds superjson serialization
//   });

//   await helpers.resources.findByTagName.prefetch({
//     name: slug,
//   });

//   await helpers.resources.find.prefetch({
//     name: slug,
//   });

//   return {
//     props: {
//       trpcState: helpers.dehydrate(),
//     },
//     revalidate: 1,
//   };
// };

const Resources = () => {
  const tabStyles = {
    _selected: { color: 'white', bg: 'black.100' },
    bg: 'backgrounds.300',
    borderRadius: '4px',
    h: '40px',
    px: '10px',
    fontWeight: '700',
    minW: { base: '260px', md: 'fit-content' },
    sx: {
      div: {
        bg: 'white',
        color: 'black',
      },
    },
  };

  const router = useRouter();
  const { slug, type } = router.query as {
    slug: string;
    type: 'tag' | 'search';
  };

  const {
    data: dataByTag,
    error: dataByTagError,
    isLoading: dataByTagLoading,
  } = trpc.resources.findByTagName.useQuery(
    {
      name: slug,
    },
    {
      enabled: !!slug && type === 'tag',
    }
  );

  const {
    data: dataBySearch,
    error: dataBySearchError,
    isLoading: dataBySearchLoading,
  } = trpc.resources.find.useQuery(
    {
      name: slug,
    },
    {
      enabled: !!slug && type === 'search',
    }
  );

  const data = dataBySearch || dataByTag;

  console.log({
    dataBySearch,
    dataBySearchError,
  });

  //====================== Split data into 3 parts for the 3 tabs ======================

  const UsefulPackages = useMemo(() => {
    return data?.filter((resource) => resource?.type === 'package');
  }, [data]);

  const HowTosBlogPosts = useMemo(() => {
    return data?.filter((resource) => resource?.type === 'howTo_or_blog_post');
  }, [data]);

  const RecommendedCourses = useMemo(() => {
    return data?.filter((resource) => resource?.type === 'course');
  }, [data]);

  // =====================================================================================

  return (
    <>
      <Seo
        title={slug as string}
        description={`Useful Resources for ${slug}`}
      />
      {/* Header */}
      <ResourceHeader isLoaded={!!data} title={slug as string} />

      {/* main */}
      <chakra.main>
        <chakra.section id='data'>
          <Container>
            <Tabs variant='unstyled' mb='100px'>
              <TabList mt='38px' overflowX={'auto'}>
                <Tab {...tabStyles}>
                  Useful Packages / Resource
                  <TabBadge value={UsefulPackages?.length || 0} />
                </Tab>

                <Tab mx='30px' {...tabStyles}>
                  How Tos and Blog Posts
                  <TabBadge value={HowTosBlogPosts?.length || 0} />
                </Tab>
                <Tab {...tabStyles}>
                  Recommended Courses
                  <TabBadge value={RecommendedCourses?.length || 0} />
                </Tab>
              </TabList>

              <TabPanels mt='44px'>
                <TabPanel px={0}>
                  <ResourceDataSection
                    data={UsefulPackages || []}
                    type='package'
                  />
                </TabPanel>

                <TabPanel px={0}>
                  <ResourceDataSection
                    data={HowTosBlogPosts || []}
                    type='howTo_or_blog_post'
                  />
                </TabPanel>
                <TabPanel px={0}>
                  <ResourceDataSection
                    data={RecommendedCourses || []}
                    type='course'
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Container>
        </chakra.section>
      </chakra.main>
    </>
  );
};

export default Resources;
