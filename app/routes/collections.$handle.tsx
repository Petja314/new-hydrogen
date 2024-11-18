import {defer, type LoaderFunctionArgs, redirect} from '@shopify/remix-oxygen';
import {Link, type MetaFunction, useLoaderData} from '@remix-run/react';
import {
  Analytics,
  getPaginationVariables,
  Image,
  Money,
  Pagination,
} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import * as React from 'react';
import {ProductsLoadedOnScroll} from '~/components/ProductsLoadedOnScroll';
import {useInView} from 'react-intersection-observer';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

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
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  // console.log('params', params);
  // console.log('request', request);
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });
  // console.log('handleCollection collection >', handle);
  if (!handle) {
    throw redirect('/collections');
  }
  //RENAMING THE VARIABLE TO MAKE API REQUEST IN DIFFERENT ROUTES example : products.$handle.tsx! handleCollection -
  const handleCollection = handle;

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handleCollection, ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handleCollection} not found`, {
      status: 404,
    });
  }

  return {
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const {ref, inView, entry} = useInView();

  // console.log('collection >', collection);
  return (
    <div className={'recommended-pr-bg-cl pt-10 pb-10 '}>
      <div className="collection container max-w-[1200px]">
        <h2 className={'text-4xl text-black  mb-10'}>{collection.title}</h2>
        {/*<p className="collection-description">{collection.description}</p>*/}
        <Pagination connection={collection.products}>
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
                Component={ProductItem}
                className={'grid grid-cols-3 gap-4 place-items-center '}
              />
              <NextLink
                ref={ref}
                className={
                  'inline-block rounded font-medium text-center py-3 px-6 border border-gray-300 bg-contrast text-primary w-full mb-5'
                }
              >
                Load more
              </NextLink>
            </>
          )}
        </Pagination>
        {/*<PaginatedResourceSection*/}
        {/*  connection={collection.products}*/}
        {/*  resourcesClassName="products-grid"*/}
        {/*>*/}
        {/*  {({node: product, index}) => (*/}
        {/*    <ProductItem*/}
        {/*      key={product.id}*/}
        {/*      product={product}*/}
        {/*      loading={index < 8 ? 'eager' : undefined}*/}
        {/*    />*/}
        {/*  )}*/}
        {/*</PaginatedResourceSection>*/}
        <Analytics.CollectionView
          data={{
            collection: {
              id: collection.id,
              handle: collection.handle,
            },
          }}
        />
      </div>
    </div>
  );
}

function ProductItem({
  item,
  loading,
}: {
  item: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = item.variants.nodes[0];
  const variantUrl = useVariantUrl(item.handle, variant.selectedOptions);
  // console.log('variant >', variant);
  // console.log('variantUrl >', variantUrl);
  return (
    <Link
      className="product-item"
      key={item.id}
      prefetch="intent"
      to={variantUrl}
    >
      {item.featuredImage && (
        <Image
          alt={item.featuredImage.altText || item.title}
          aspectRatio="1/1"
          data={item.featuredImage}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4>{item.title}</h4>
      <small>
        <Money data={item.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
export const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handleCollection: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handleCollection) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
