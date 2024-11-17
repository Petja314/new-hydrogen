import type {ProductVariantFragment} from 'storefrontapi.generated';
import {useState} from 'react';
import {useDragScroll} from '~/lib/hooks/useDragScroll';

const img = [];

export function ProductImage({
  image,
  width,
  allMediaImages,
}: {
  image: ProductVariantFragment['image'] | any;
  width?: string;
  allMediaImages: any;
}) {
  const [activeImage, setActiveImage] = useState(image.url);
  const imageWidth = 100; // Adjust this based on actual image width, including margins
  const visibleImagesCount = 4; // Number of images visible at a time

  const {containerRef, scrollToRevealNext} = useDragScroll(
    imageWidth,
    visibleImagesCount,
  );

  const handleImageClick = (imageUrl: string, index: number) => {
    activeImageHandler(imageUrl); // Set active image
    scrollToRevealNext(index); // Scroll if needed
  };

  if (!image) {
    return <div className="product-image" />;
  }

  const activeImageHandler = (img: string) => {
    setActiveImage(img);
  };

  return (
    <div className="flex flex-col justify-between lg:flex-row">
      <div className="flex flex-col gap-6">
        {/* Selected image */}
        <img
          src={activeImage}
          alt="img-preview"
          className="w-full h-full aspect-square object-cover rounded-xl"
        />
        {/* Scrollable container */}
        <div
          ref={containerRef}
          className="flex flex-row justify-between h-24 overflow-x-auto gap-2 max-w-full hide-scrollbar cursor-grab"
        >
          {allMediaImages.map((image: any, index: number) => (
            <img
              onClick={() => handleImageClick(image.previewImage.url, index)}
              key={index}
              src={image.previewImage.url}
              alt="img"
              draggable="false"
              className="w-24 h-24 rounded-md cursor-pointer flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// export function ProductImage({
//                                image,
//                                width,
//                                allMediaImages,
//                              }: {
//   image: ProductVariantFragment['image'] | any;
//   width?: string;
//   allMediaImages: any;
// }) {
//   if (!image) {
//     return <div className="product-image" />;
//   }
//   return (
//       <div className="product-image border border-black max-w-[500px] ">
//         {/*Selected image*/}
//         <Image
//             alt={image.altText || 'Product Image'}
//             aspectRatio="1/1"
//             data={image}
//             key={image.id}
//             // sizes="(min-width: 45em) 50vw, 100vw"
//             // width={'100px'}
//             style={{width: '350px'}}
//             className={''}
//         />
//         {/*All images from media*/}
//         {/*below other images*/}
//
//         <div className={'flex'}>
//           {allMediaImages.map((image: any, index: any) => (
//               <div key={index} className={''}>
//                 <img
//                     src={image.previewImage.url}
//                     alt=""
//                     className={'max-w-[300px]'}
//                 />
//               </div>
//           ))}
//         </div>
//       </div>
//   );
// }
