import {Suspense} from 'react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction} from '@remix-run/react';
import type {ProductFragment} from 'storefrontapi.generated';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getPaginationVariables,
} from '@shopify/hydrogen';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {getVariantUrl} from '~/lib/variants';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {COLLECTION_QUERY} from '~/routes/collections.$handle';
import RelatedProducts from '~/components/RelatedProducts';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.product.title ?? ''}`}];
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
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  const handleCollection = product?.collections.edges[0].node.handle;
  // console.log('collections handle >', handleCollection);
  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handleCollection, first: 8},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handleCollection} not found`, {
      status: 404,
    });
  }

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }
  return {
    product,
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.

  const variants = context.storefront
    .query(VARIANTS_QUERY, {
      variables: {handle: params.handle!},
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    variants,
  };
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

const selectedVariantImg = {
  url: 'https://cdn.shopify.com/s/files/1/0860/4788/3594/files/62a3dd0421fc5ccf4df6815b3694d734.jpg?v=1731592618',
};

const allMediaImages = [
  {
    previewImage: {
      url: 'https://cdn.shopify.com/s/files/1/0860/4788/3594/files/62a3dd0421fc5ccf4df6815b3694d734.jpg?v=1731592618',
    },
  },
  {
    previewImage: {
      url: 'https://cdn.shopify.com/s/files/1/0860/4788/3594/files/ef0746b3c879000196dfce266154b537.jpg?v=1731592618',
    },
  },
  {
    previewImage: {
      url: 'https://cdn.shopify.com/s/files/1/0860/4788/3594/files/544c0236ac6a8def363f3db689aacf08.jpg?v=1731592618',
    },
  },
  {
    previewImage: {
      url: 'https://cdn.shopify.com/s/files/1/0860/4788/3594/files/62a3dd0421fc5ccf4df6815b3694d734.jpg?v=1731592618',
    },
  },
  {
    previewImage: {
      url: 'https://cdn.shopify.com/s/files/1/0860/4788/3594/files/62a3dd0421fc5ccf4df6815b3694d734.jpg?v=1731592618',
    },
  },
  {
    previewImage: {
      url: 'https://cdn.shopify.com/s/files/1/0860/4788/3594/files/62a3dd0421fc5ccf4df6815b3694d734.jpg?v=1731592618',
    },
  },
];

export default function Product() {
  const {product, variants, collection} = useLoaderData<typeof loader>();
  // console.log('product > ', product);
  // console.log('collection > ', collection);
  const selectedVariant = useOptimisticVariant(
    product.selectedVariant,
    variants,
  );

  const {title, descriptionHtml} = product;
  // console.log('product >', product?.media?.nodes);
  // console.log('selectedVariant >', selectedVariant);
  // console.log('render');

  return (
    <div className=" container max-w-[1200px]  ">
      <div className="product container max-w-[1200px] flex mb-8 ">
        <ProductImage
          image={selectedVariant?.image}
          allMediaImages={product?.media?.nodes}
        />

        {/*<ProductImage*/}
        {/*  image={selectedVariantImg}*/}
        {/*  allMediaImages={allMediaImages}*/}
        {/*/>*/}

        <div className="product-main">
          <h2 className={'text-black text-3xl'}>{title}</h2>
          <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
          />

          <Suspense
            fallback={
              <ProductForm
                product={product}
                selectedVariant={selectedVariant}
                variants={[]}
              />
            }
          >
            <Await
              errorElement="There was a problem loading product variants"
              resolve={variants}
            >
              {(data) => (
                <ProductForm
                  product={product}
                  selectedVariant={selectedVariant}
                  variants={data?.product?.variants.nodes || []}
                />
              )}
            </Await>
          </Suspense>

          <p>
            <strong>Description</strong>
          </p>
          <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
        </div>
      </div>

      <RelatedProducts collection={collection?.products?.nodes} />

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
fragment Product on Product {
  id
  title
  vendor
  handle
  descriptionHtml
  description
  collections(first : 1){
    edges{
      node{
        handle
        id
        title
        image{
          url
          altText
        }
      }
    }
  }
  media(first: 8) {
    nodes {
      previewImage {
        url
      }
    }
  }
  options {
    name
    optionValues {
      name
    }
  }
  selectedVariant: variantBySelectedOptions(
    selectedOptions: $selectedOptions
    ignoreUnknownOptions: true
    caseInsensitiveMatch: true
  ) {
    ...ProductVariant
  }
  variants(first: 1) {
    nodes {
      ...ProductVariant
    }
  }
  seo {
    description
    title
  }
}
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
