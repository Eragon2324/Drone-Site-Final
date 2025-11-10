import { useState } from 'react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export default function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-black/40">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 animate-pulse" />
      )}
      <video
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        className="absolute inset-0 w-full h-full object-cover border-0"
        onLoadedData={() => setIsLoaded(true)}
      />
    </div>
  );
}
