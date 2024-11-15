import React from 'react';

interface Props {
  className?: string;
}

const TextComponent: React.FC<Props> = ({className}) => {
  return (
    <div className={'recommended-pr-bg-cl pt-10 pb-10'}>
      <div className={'container text-black text-4xl max-w-[1000px]'}>
        <h2 className={'mt-14 '}>
          Liquid combines comfort, style, and sustainability. Our products are
          made from organic cotton and crafted in Canada.
        </h2>
        <h2 className={'mt-14'}>
          Each product features a minimalist aesthetic, with clean lines and
          neutral colors.
        </h2>
        <h2 className={'mt-14 mb-10'}>
          Join the Liquid movement today and elevate your style.
        </h2>
      </div>
    </div>
  );
};

export default TextComponent;
