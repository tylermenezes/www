import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return () => {};
    if(width === null || height === null) {
      setWidth(window.innerHeight);
      setHeight(window.innerHeight);
    }
    window.addEventListener('resize', updateWidthAndHeight);
    return () => window.removeEventListener('resize', updateWidthAndHeight);
  }, [typeof window]);

  return {
    width,
    height,
  }
}