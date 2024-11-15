import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

export function ProductImage({
  image,
  width,
}: {
  image: ProductVariantFragment['image'];
  width?: string;
}) {
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div className="product-image   border border-gray-500  flex items-center">
      <Image
        style={{border: '1px solid red'}}
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        // sizes="(min-width: 45em) 50vw, 100vw"
        // width={'100px'}
      />
    </div>
  );
}
