import {useLoaderData, Link} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getPaginationVariables, Image, Pagination} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import * as React from 'react';
import {ProductsLoadedOnScroll} from '~/components/ProductsLoadedOnScroll';
import {useInView} from 'react-intersection-observer';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {collections};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();
  const {ref, inView, entry} = useInView();

  return (
    <div className={'recommended-pr-bg-cl pt-10 pb-10 '}>
      <div className="collection container max-w-[1200px]">
        <h2 className={'text-4xl text-black  mb-10'}>Collections</h2>

        <Pagination connection={collections}>
          {({
            nodes,
            NextLink,
            PreviousLink,
            isLoading,
            hasNextPage,
            nextPageUrl,
            state,
          }) => (
            <>
              <PreviousLink
                className={
                  'inline-block rounded font-medium text-center py-3 px-6 border border-gray-300 bg-contrast text-primary w-full mb-5'
                }
              >
                {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
              </PreviousLink>
              <ProductsLoadedOnScroll
                nodes={nodes}
                inView={inView}
                hasNextPage={hasNextPage}
                nextPageUrl={nextPageUrl}
                state={state}
                Component={CollectionItem}
                className={'grid grid-cols-3 gap-4 place-items-center '}
              />
              <NextLink ref={ref}>Load more</NextLink>
            </>
          )}
        </Pagination>

        {/*<PaginatedResourceSection*/}
        {/*  connection={collections}*/}
        {/*  resourcesClassName="collections-grid"*/}
        {/*>*/}
        {/*  {({node: collection, index}) => (*/}
        {/*    <CollectionItem*/}
        {/*      key={collection.id}*/}
        {/*      collection={collection}*/}
        {/*      index={index}*/}
        {/*    />*/}
        {/*  )}*/}
        {/*</PaginatedResourceSection>*/}
      </div>
    </div>
  );
}

function CollectionItem({
  item,
  index,
}: {
  item: CollectionFragment;
  index: number;
}) {
  return (
    <Link
      className="collection-item"
      key={item.id}
      to={`/collections/${item?.handle}`}
      prefetch="intent"
    >
      <div className={'max-w-[300px]'}>
        {item?.image && (
          <Image
            alt={item.image.altText || item.title}
            aspectRatio="1/1"
            data={item.image}
            loading={index < 3 ? 'eager' : undefined}
          />
        )}
      </div>

      <h5>{item.title}</h5>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
