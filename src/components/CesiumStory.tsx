import React from 'react';

type CesiumStoryProps = {
  url: string;
  showHelp?: boolean;
};

export default function CesiumStory({ url, showHelp = false }: CesiumStoryProps) {
  return (
    <div className="relative w-full h-[520px] md:h-[580px] lg:h-[640px] rounded-xl overflow-hidden border border-brand-gold/10 bg-black/40">
      <iframe
        src={url}
        title="Orthomosaic Story"
        className="absolute inset-0 w-full h-full border-0"
        allow="fullscreen; geolocation; autoplay"
        referrerPolicy="no-referrer"
      />
      {showHelp && (
        <div className="absolute right-3 top-3 md:right-4 md:top-4 z-10 pointer-events-none">
          <div className="max-w-[260px] md:max-w-[280px] text-[11px] md:text-xs leading-relaxed text-white/80 bg-black/50 backdrop-blur-sm border border-white/15 rounded-lg px-3 py-2 shadow-lg">
            <div className="font-semibold text-white/90 mb-1">Viewer Controls</div>
            <ul className="list-disc pl-4 space-y-1">
              <li>Left‑click and drag: orbit</li>
              <li>Right‑click and drag: pan</li>
              <li>Scroll wheel / pinch: zoom</li>
              <li>Middle‑click (scroll wheel) drag: tilt</li>
              <li>Double‑click: focus/zoom</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}


