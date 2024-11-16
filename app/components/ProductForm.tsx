import {Link} from '@remix-run/react';
import {type VariantOption, VariantSelector} from '@shopify/hydrogen';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import React from 'react';

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
    <div className="product-form font-medium  mt-4 mb-10 ">
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
  {bgcolor: 'bg-green-500', value: 'green'},
  {bgcolor: 'bg-blue-500', value: 'blue'},
  {bgcolor: 'bg-red-400', value: 'red'},
  {bgcolor: 'bg-black', value: 'black'},
];

function ProductOptions({option}: {option: VariantOption}) {
  // console.log('option.values', option.values);

  return (
    <div className="product-options  mb-6" key={option.name}>
      {/*<h5 className={'mb-4'}>{option.name}</h5>*/}
      {option.values
        .filter(({isActive}) => isActive)
        .map(({value}) => (
          <h5 key={option.name + value} className="mb-2 mt-2">
            {option.name} : {value}
          </h5>
        ))}

      <div className="product-options-grid ">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className="product-options-item flex "
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
            >
              <div className={''}>
                {option.name === 'Size' ? (
                  <h5
                    style={{
                      background: isActive ? '#292929' : 'transparent',
                      color: isActive ? 'white' : '',
                      border: '1px solid #6A6A6A',
                    }}
                    className={
                      'rounded-sm  w-7 h-7 flex justify-center text-sm items-center'
                    }
                  >
                    {value}
                  </h5>
                ) : option.name === 'Color' ? (
                  <div>
                    {colorVariants
                      .filter((item: any) => item.value === value)
                      .map((item: any, i: any) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full ${item.bgcolor} `}
                          style={{
                            border: isActive ? '1px solid black' : '',
                            padding: '5px',
                          }}
                        ></div>
                      ))}
                  </div>
                ) : (
                  <h5>{value}</h5>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
