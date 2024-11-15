import {Link} from '@remix-run/react';
import {type VariantOption, VariantSelector} from '@shopify/hydrogen';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';

export function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  const {open} = useAside();
  // console.log('variants >', variants);
  // console.log('selectedVariant >', selectedVariant);
  // console.log('product >', product);
  return (
    <div className="product-form font-medium border border-red-500 mt-4 mb-10 ">
      <VariantSelector
        handle={product.handle}
        options={product.options.filter(
          (option) => option.optionValues.length >= 1,
        )}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>

      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

const colorVariants = [
  {bgcolor: 'bg-yellow-500', value: 'Multi'},
  {bgcolor: 'bg-blue-500', value: 'Blue'},
  {bgcolor: 'bg-red-400', value: 'Pink'},
  {bgcolor: 'bg-black', value: 'Black'},
  {bgcolor: 'bg-red-600', value: 'Red'},
];

function ProductOptions({option}: {option: VariantOption}) {
  // console.log('option.values', option.values);

  return (
    <div className="product-options " key={option.name}>
      <h5 className={'mb-4'}>{option.name}</h5>

      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className="product-options-item"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                border: isActive ? '1px solid black' : '1px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {option.name === 'Size' ? (
                <h5 className={''}>{value}</h5>
              ) : option.name === 'Color' ? (
                <div>
                  <h5 className={''}>{value}</h5>
                  <span className="opacity-50">
                    {
                      colorVariants.find((color) => color.value === value)
                        ?.value
                    }
                  </span>
                </div>
              ) : (
                <h5>{value}</h5>
              )}

              {/*{value}*/}
            </Link>
          );
        })}
      </div>
      <br />
    </div>
  );
}
