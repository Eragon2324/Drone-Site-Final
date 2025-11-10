import { useState } from 'react';

interface ModelViewerProps {
  src: string;
}

export default function ModelViewer({ src }: ModelViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-black/40">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 animate-pulse" />
      )}
      <iframe
        src={src}
        className="absolute inset-0 w-full h-full border-0"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        title="3D Model"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
