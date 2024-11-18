import type {ProductVariantFragment} from 'storefrontapi.generated';
import {useEffect, useState} from 'react';
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
  const [activeImage, setActiveImage] = useState(image.url); //TODO ! Check if the after incoming data from server component renders and showing the selected image
  const imageWidth = 100; // Adjust this based on actual image width, including margins
  const visibleImagesCount = 4; // Number of images visible at a time

  useEffect(() => {
    setActiveImage(image.url);
  }, [image.url]);

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

  const getImageStyle = (index: any) => ({
    marginRight: index === 1 ? '-50px' : '0px',
  });

  // console.log('image.url >', image.url);
  // console.log('activeImage >', activeImage);
  // console.log('render');
  return (
    <div>
      <div className="flex md:flex-col md:justify-between md:max-w-[350px] max-w-[300px] overflow-x-auto gap-4 hide-scrollbar relative  ">
        <div className="md:flex md:flex-col md:gap-6 md:items-center">
          <img
            src={activeImage}
            alt="img-preview"
            className="md:h-full md:max-w-[350px] md:aspect-square  rounded-md h-[300px] max-w-[250px] object-cover flex-shrink-0 mr-[5px]"
          />
        </div>

        <div
          ref={containerRef}
          className="md:flex md:flex-row md:justify-between md:h-24 md:overflow-x-auto md:gap-2 md:max-w-full hide-scrollbar cursor-grab inline-flex gap-4"
        >
          {allMediaImages.map((image: any, index: number) => (
            <img
              onClick={() => handleImageClick(image.previewImage.url, index)}
              key={index}
              src={image.previewImage.url}
              alt="Preview"
              draggable="false"
              className={`md:w-24 md:h-24 rounded-md h-[300px] max-w-[250px] cursor-pointer object-cover flex-shrink-0 border border-gray-500 `}
            />
          ))}
        </div>
      </div>

      {/*MOBILE VIEW*/}
      {/*<div className="flex overflow-x-auto gap-4 hide-scrollbar relative max-w-full md:hidden ">*/}
      {/*  /!* Главное изображение *!/*/}
      {/*  <img*/}
      {/*    src={activeImage}*/}
      {/*    alt="img-preview"*/}
      {/*    className="border border-gray-500 rounded-md h-[300px] w-[250px] object-cover flex-shrink-0 mr-[-30px]"*/}
      {/*  />*/}

      {/*  /!* Прочие изображения *!/*/}
      {/*  {allMediaImages.map((image: any, index: any) => (*/}
      {/*    <img*/}
      {/*      key={index}*/}
      {/*      src={image.previewImage.url}*/}
      {/*      alt="Preview"*/}
      {/*      className={`border border-gray-500 rounded-md h-[300px] w-[250px] object-cover flex-shrink-0 ${*/}
      {/*        index === 0 ? 'ml-[30px]' : ''*/}
      {/*      }`}*/}
      {/*      draggable="false"*/}
      {/*    />*/}
      {/*  ))}*/}
      {/*</div>*/}

      {/*DESKTOP VIEW*/}
      {/*<div className="flex flex-col justify-between  max-w-[350px] sm:flex-row md:flex-row lg:flex-row  hidden md:block">*/}
      {/*  <div className="flex flex-col gap-6">*/}
      {/*    /!* Selected image *!/*/}
      {/*    <img*/}
      {/*      src={activeImage}*/}
      {/*      alt="img-preview"*/}
      {/*      className=" h-full aspect-square object-cover rounded-xl "*/}
      {/*    />*/}
      {/*    /!* Scrollable container *!/*/}
      {/*    <div*/}
      {/*      ref={containerRef}*/}
      {/*      className="flex flex-row justify-between h-24 overflow-x-auto gap-2 max-w-full hide-scrollbar cursor-grab "*/}
      {/*    >*/}
      {/*      {allMediaImages.map((image: any, index: number) => (*/}
      {/*        <img*/}
      {/*          onClick={() => handleImageClick(image.previewImage.url, index)}*/}
      {/*          key={index}*/}
      {/*          src={image.previewImage.url}*/}
      {/*          alt="img"*/}
      {/*          draggable="false"*/}
      {/*          className="w-24 h-24 cursor-pointer flex-shrink-0 border border-gray-500 rounded-md "*/}
      {/*        />*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
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
