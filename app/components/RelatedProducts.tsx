import React from 'react';
import {useDragScroll} from '~/lib/hooks/useDragScroll';

interface Props {
  className?: string;
  collection?: any;
}

const RelatedProducts: React.FC<Props> = ({className, collection}) => {
  const imageWidth = 100; // Adjust this based on actual image width, including margins
  const visibleImagesCount = 4; // Number of images visible at a time
  const {containerRef, scrollToRevealNext} = useDragScroll(
    imageWidth,
    visibleImagesCount,
  );

  // console.log('collection >', collection);
  return (
    <div className={'mt-[120px] mb-[120px]'}>
      <h2 className={'text-black text-3xl flex justify-center'}>
        Related Products
      </h2>

      <div
        ref={containerRef}
        className={
          'flex justify-between font-medium mt-10 overflow-x-auto  cursor-grab  hide-scrollbar'
        }
      >
        {collection.map((product: any) => (
          <div key={product.id} className={''}>
            <img
              draggable="false"
              src={product.featuredImage.url}
              alt="related-product-image"
              className={'max-w-[300px] mb-4'}
            />
            <div className={''}>{product.title}</div>
            <div className={''}>
              {product.priceRange.minVariantPrice.amount}{' '}
              {product.priceRange.minVariantPrice.currencyCode}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
