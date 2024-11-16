import {useLocation, useNavigate} from '@remix-run/react';
import {useEffect} from 'react';

export function ProductsLoadedOnScroll({
  nodes,
  inView,
  hasNextPage,
  nextPageUrl,
  state,
  Component,
  className,
}: any) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (inView && hasNextPage) {
      navigate(nextPageUrl, {
        replace: true,
        preventScrollReset: true,
        state,
      });
    }
  }, [inView, navigate, state, nextPageUrl, hasNextPage, location.pathname]);
  // console.log('state >', state);
  console.log('location >', location.pathname);
  // console.log('nextPageUrl >', nextPageUrl);
  return (
    <div className={className as string}>
      {nodes.map((product: any) => (
        <div key={product.id}>
          <Component product={product} />
        </div>
      ))}
    </div>
  );
}
