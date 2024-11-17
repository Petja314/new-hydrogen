import {useEffect, useRef} from 'react';

export const useDragScroll = (
  imageWidth: number,
  visibleImagesCount: number,
) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Drag-to-scroll variables
    let isDragging = false;
    let startX: number;
    let scrollLeft: number;

    // Drag-to-scroll handlers
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.classList.add('cursor-grabbing');
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = x - startX;
      container.scrollLeft = scrollLeft - walk;
    };

    const onMouseUpOrLeave = () => {
      isDragging = false;
      container.classList.remove('cursor-grabbing');
    };

    // Add event listeners for drag-to-scroll
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseup', onMouseUpOrLeave);
    container.addEventListener('mouseleave', onMouseUpOrLeave);

    return () => {
      // Cleanup event listeners on unmount
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseup', onMouseUpOrLeave);
      container.removeEventListener('mouseleave', onMouseUpOrLeave);
    };
  }, []);

  const scrollToRevealNext = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const lastVisibleIndex =
      Math.floor(container.scrollLeft / imageWidth) + visibleImagesCount;

    // If the clicked image is the last visible one, scroll to the next image
    if (index === lastVisibleIndex - 1) {
      const nextImage = container.children[index + 1] as HTMLElement;
      nextImage?.scrollIntoView({behavior: 'smooth', inline: 'start'});
    }
    // If the clicked image is the first visible one, scroll to the previous image
    else if (index === Math.floor(container.scrollLeft / imageWidth)) {
      const prevImage = container.children[index - 1] as HTMLElement;
      prevImage?.scrollIntoView({behavior: 'smooth', inline: 'start'});
    }
  };

  return {containerRef, scrollToRevealNext};
};
