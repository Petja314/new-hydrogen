import React, {useEffect, useRef, useState} from 'react';
import {useFetcher} from '@remix-run/react';

export function InfiniteScroll<T>({
  query,
  variables,
  extractNodes,
  children,
}: {
  query: string; // GraphQL-запрос
  variables: Record<string, any>; // Начальные переменные
  extractNodes: (data: any) => T[]; // Функция для извлечения элементов
  children: React.FunctionComponent<{node: T; index: number}>;
}) {
  const fetcher: any = useFetcher();
  const [items, setItems] = useState<T[]>([]); // Подгруженные элементы
  const [pageVariables, setPageVariables] = useState(variables); // Текущие переменные
  const [hasNextPage, setHasNextPage] = useState(true); // Доступность следующих данных

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Observer для подгрузки данных при скролле
  useEffect(() => {
    if (!hasNextPage || fetcher.state === 'loading') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetcher.load(
            `/load-more?query=${encodeURIComponent(
              query,
            )}&variables=${encodeURIComponent(JSON.stringify(pageVariables))}`,
          );
        }
      },
      {rootMargin: '100px'},
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, pageVariables, fetcher, query]);

  // Обновление данных после загрузки
  useEffect(() => {
    if (fetcher.data) {
      const newNodes = extractNodes(fetcher.data);
      // debugger;
      setItems((prev) => [...prev, ...newNodes]);

      // Обновляем переменные и статус пагинации
      const newPageInfo = fetcher.data.products?.pageInfo || {};
      setHasNextPage(newPageInfo.hasNextPage);
      setPageVariables((prev) => ({
        ...prev,
        after: newPageInfo.endCursor,
      }));
    }
  }, [fetcher.data, extractNodes]);

  return (
    <div>
      <div className="items-grid">
        {items.map((node, index) => children({node, index}))}
      </div>
      {hasNextPage && (
        <div
          ref={loadMoreRef}
          style={{height: '50px', background: 'transparent'}}
        />
      )}
    </div>
  );
}
