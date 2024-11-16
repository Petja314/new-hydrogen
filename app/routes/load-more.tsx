import {json, type LoaderFunction} from '@shopify/remix-oxygen';

export const loader: LoaderFunction = async ({request, context}) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('query'); // GraphQL-запрос
  const variables: any = JSON.parse(url.searchParams.get('variables') || '{}'); // Переменные для запроса

  if (!query) {
    throw new Response('Query is required', {status: 400});
  }

  const {storefront} = context;

  const data = await storefront.query(query, {variables});

  return json(data);
};
