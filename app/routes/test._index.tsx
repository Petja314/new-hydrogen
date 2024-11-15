import React from 'react';
import {ProductTest} from '~/components/HeaderTailwind';

interface Props {
  className?: string;
}

const TestProduct: React.FC<Props> = ({className}) => {
  return (
    <div className={className}>
      <h2>Product test page</h2>
      <ProductTest />
    </div>
  );
};

export default TestProduct;
