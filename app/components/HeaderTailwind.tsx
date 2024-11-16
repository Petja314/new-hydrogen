import React, {Fragment, useState} from 'react';

const product = {
  title: 'Beats Headphone 2019',
  previews: [
    {
      previewUrl: '',
      thumbUrl: '',
    },
    {
      previewUrl: '',
      thumbUrl: '',
    },
    {
      previewUrl: '',
      thumbUrl: '',
    },
  ],
  rating: 5.0,
  rateCount: 1256,
  price: 27351,
  colorVariants: [
    {bgcolor: 'bg-yellow-500', value: 'Multi'},
    {bgcolor: 'bg-blue-500', value: 'Blue'},
    {bgcolor: 'bg-red-400', value: 'Pink'},
    {bgcolor: 'bg-black', value: 'Black'},
    {bgcolor: 'bg-red-600', value: 'Red'},
  ],
  sizeVariants: [
    {label: 'XXS', value: 'SSX', title: 'Extra extra small'},
    {label: 'XS', value: 'XS', title: 'Extra small'},
    {label: 'S', value: 'S', title: 'Small'},
    {label: 'M', value: 'M', title: 'Medium'},
    {label: 'L', value: 'L', title: 'Large'},
    {label: 'XL', value: 'XL', title: 'Extra large'},
    {label: 'XXL', value: 'XXL', title: 'Extra extra large'},
    {
      label: 'XXXL',
      value: 'XXXL',
      title: 'Extra extra extra large',
      disabled: true,
    },
  ],
};

const ProductPreviews = ({previews}: any) => {
  const [index, setIndex] = useState(0);

  return (
    <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-4 sm:p-6 lg:p-12 lg:mr-6">
      <div className="text-center mb-4 md:p-6">
        <img
          src={previews[index].previewUrl}
          alt=""
          className="max-w-full h-auto w-full"
        />
      </div>

      <ul className="flex gap-3">
        {previews.map((preview: any, i: any) => (
          <li
            className="w-24 h-24 flex justify-center items-center p-2 rounded-md border border-gray-200 dark:border-slate-700 cursor-pointer"
            key={i}
            onClick={() => setIndex(i)}
          >
            <img src={preview.thumbUrl} alt="" className="max-w-full h-auto" />
          </li>
        ))}
      </ul>
    </div>
  );
};

const ColorVariant = () => {
  const [selectedColor, setSelectedColor] = useState('Multi');

  const handleColorChange = (value: any) => {
    setSelectedColor(value);
  };

  return (
    <>
      <div className="mb-6">
        <h5 className="font-medium mb-2">
          Color:{' '}
          <span className="opacity-50">
            {selectedColor &&
              product.colorVariants.find(
                (color) => color.value === selectedColor,
              )?.value}
          </span>
        </h5>
        <div className="flex gap-3">
          {product.colorVariants.map((item: any, i) => (
            <Fragment key={i}>
              {/*<input*/}
              {/*  type="radio"*/}
              {/*  className="absolute hidden"*/}
              {/*  autoComplete="off"*/}
              {/*  checked={selectedColor === item.value}*/}
              {/*  onChange={() => handleColorChange(item.value)}*/}
              {/*/>*/}
              <label
                className={`w-8 h-8 rounded-full ${item.bgcolor} 
                border-2 border-white dark:border-[#0b1727] cursor-pointer mt-1 hover:outline hover:outline-1 hover:outline-${
                  item.color
                } ${
                  selectedColor === item.value &&
                  `outline outline-1 outline-${item.color}`
                }`}
                onClick={() => handleColorChange(item.value)}
              ></label>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

const SizeVariant = () => {
  const [selectedSize, setSelectedSize] = useState('XXS');

  const handleSizeChange = (value: any) => {
    if (product.sizeVariants.find((size) => size.value === value)?.disabled) {
      return;
    }
    setSelectedSize(value);
  };

  return (
    <div className="mb-6">
      <h5 className="font-medium mb-2">
        Size:{' '}
        <span className="opacity-50">
          {selectedSize &&
            product.sizeVariants.find((size) => size.value === selectedSize)
              ?.title}
        </span>
      </h5>
      <div className="flex flex-wrap gap-2 mb-2">
        {product.sizeVariants.map((size) => (
          <React.Fragment key={size.label}>
            <input
              type="radio"
              className="absolute hidden"
              autoComplete="off"
              checked={selectedSize === size.label}
              onChange={() => handleSizeChange(size.label)}
            />
            <label
              className={`bg-gray-100 dark:bg-slate-800 
                                hover:bg-slate-100
                                dark:hover:bg-blue-100/[0.2]
                                cursor-pointer
                                py-1 px-4 rounded-full border mt-1 ${
                                  selectedSize === size.label
                                    ? 'border-blue-600 dark:border-blue-600'
                                    : 'border-blue-50 dark:border-blue-600 dark:border-opacity-20'
                                }  ${
                size.disabled
                  ? 'line-through opacity-40 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              onClick={() => handleSizeChange(size.value)}
            >
              {size.label}
            </label>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const QtyField = ({name, value, onChange}: any) => {
  const qtyControl = (qty: any) =>
    onChange({
      target: {
        name,
        type: 'radio',
        value: qty < 1 ? 1 : qty,
      },
    });

  return (
    <div className="flex h-11 w-24 mb-4">
      <input
        className="w-2/3 pl-2 text-center border border-black dark:border-white bg-transparent focus:outline-none rounded-lg overflow-hidden font-bold text-lg"
        type="number"
        placeholder=""
        value={value}
        onChange={(e) => qtyControl(e.target.value)}
      />
      <div className="w-1/3 rounded-lg overflow-hidden flex flex-col border border-black dark:border-white bg-transparent p-0">
        <button
          className="text-blue-600 hover:bg-blue-600 hover:text-white h-1/2 font-bold leading-none text-lg"
          type="button"
          onClick={() => qtyControl(parseInt(value) - 1)}
        >
          -
        </button>
        <button
          className="text-blue-600 hover:bg-blue-600 hover:text-white h-1/2 font-bold leading-none text-lg"
          type="button"
          onClick={() => qtyControl(parseInt(value) + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export const ProductTest = () => {
  const [formData, setFormData] = useState({
    color: 'Multi',
    size: 'XL',
    qty: 1,
  });

  const setField = (e: any) => {
    const {name, value, type, checked} = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <section className="py-14 md:py-24 bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white relative overflow-hidden z-10">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2">
            <ProductPreviews previews={product.previews} />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="mb-6 lg:mb-12">
              <h1 className="text-2xl leading-none md:text-4xl font-medium mb-4">
                {product.title}
              </h1>
              <p className="opacity-70 mb-6">
                <span>4.0</span> {/*<FontAwesomeIcon*/}
                {/*  icon={faStar}*/}
                {/*  className="mx-2 text-yellow-500"*/}
                {/*/>*/}
                <a href="#!" className="text-blue-600 font-medium ml-1">
                  8 Reviews
                </a>{' '}
                <span className="ml-2">104 Order</span>
              </p>
              <p className="opacity-70 lg:mr-56 xl:mr-80 my-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
                nec consequat lorem. Maecenas elementum at diam consequat
                bibendum.
              </p>
              <h3 className="text-2xl text-blue-600 font-medium">
                Rs. {product.price}
              </h3>
            </div>

            <form action="#!">
              <div className="mb-6">
                <ColorVariant />
              </div>
              <div className="mb-6">
                <SizeVariant />
              </div>
              <div className="mb-6">
                <h5 className="font-medium mb-2">QTY</h5>
                <QtyField onChange={setField} name="qty" value={formData.qty} />
              </div>

              <div className="flex flex-col gap-3 w-full my-7">
                <div className="flex items-center gap-4 w-full max-w-lg">
                  <button className="bg-blue-600 border border-blue-600 text-white text-sm rounded uppercase hover:bg-opacity-90 px-10 py-2.5 h-10 md:px-12 w-1/2">
                    Buy Now
                  </button>
                  <button className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-sm rounded uppercase px-6 py-2.5 h-10 md:px-12 w-1/2">
                    Add To Cart
                  </button>
                </div>
                {/*<div className="flex items-center gap-4 w-full">*/}
                {/*  <button className="hover:bg-blue-600 rounded hover:bg-opacity-10 text-blue-600 px-3 py-2">*/}
                {/*    <FontAwesomeIcon icon={faHeart} /> Add to wishlist*/}
                {/*  </button>*/}
                {/*  <button className="hover:bg-blue-600 rounded hover:bg-opacity-10 text-blue-600 px-3 py-2">*/}
                {/*    <FontAwesomeIcon icon={faShareAlt} className="mr-1" /> share*/}
                {/*  </button>*/}
                {/*</div>*/}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
