import { useState, useEffect } from 'react';

export function useLazyEmbed(isActive: boolean) {
  const [ready, setReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => setReady(true), 50);
      return () => clearTimeout(t);
    } else {
      setReady(false);
      setIsLoaded(false);
    }
  }, [isActive]);

  return { ready, isLoaded, setIsLoaded };
}
