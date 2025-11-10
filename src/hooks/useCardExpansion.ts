import { useState, useEffect } from 'react';

export function useCardExpansion() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const open = (id: string) => setExpandedId(id);
  const close = () => setExpandedId(null);
  const toggle = (id: string) => setExpandedId(expandedId === id ? null : id);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expandedId !== null) {
        close();
      }
    };

    const introHero = document.getElementById('intro-hero');
    const introHeadline = document.getElementById('intro-headline');

    if (expandedId !== null) {
      document.addEventListener('keydown', handleEscape);

      if (introHero) {
        introHero.style.minHeight = '180px';
        introHero.style.paddingTop = '2rem';
        introHero.style.paddingBottom = '2rem';
      }
      if (introHeadline) {
        introHeadline.style.fontSize = '2rem';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        if (introHero) {
          introHero.style.minHeight = '';
          introHero.style.paddingTop = '';
          introHero.style.paddingBottom = '';
        }
        if (introHeadline) {
          introHeadline.style.fontSize = '';
        }
      };
    }
  }, [expandedId]);

  return { expandedId, open, close, toggle };
}
