import { useEffect, useRef, useState } from 'react';

interface GroundedModelViewerProps {
  src: string; // GLB path
  poster?: string;
}

type MVElement = any; // model-viewer element (typed loosely)

export default function GroundedModelViewer({ src, poster }: GroundedModelViewerProps) {
  const ref = useRef<MVElement>(null);
  const [initialOrbit, setInitialOrbit] = useState<string>('0deg 40deg 100%');
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    // If model-viewer web component is not available, fallback to video
    if (typeof window !== 'undefined' && !customElements.get('model-viewer')) {
      setFallback(true);
      return;
    }

    const el = ref.current as MVElement;
    if (!el) return;

    const handleLoad = () => {
      try {
        // Get model dimensions to calculate optimal viewing distance
        const dims = typeof el.getDimensions === 'function' 
          ? el.getDimensions() 
          : { x: 1, y: 1, z: 1 };

        // Calculate optimal camera distance based on model size
        const maxDimension = Math.max(dims.x, dims.y, dims.z);
        const optimalRadius = maxDimension * 2.5;

        // Set the camera to look at the center of the model
        // The target stays fixed at the model's center
        const centerY = dims.y / 2;
        el.cameraTarget = `0m ${centerY}m 0m`;
        
        // Set initial camera position: slightly elevated, looking down at the model
        const orbit = `0deg 45deg ${optimalRadius}m`;
        el.cameraOrbit = orbit;
        setInitialOrbit(orbit);

        // Set orbit constraints to prevent weird angles and flipping
        // Min: 5 degrees elevation (prevents going underground)
        // Max: 85 degrees elevation (prevents flipping over the top)
        el.minCameraOrbit = `auto 5deg auto`;
        el.maxCameraOrbit = `auto 85deg auto`;
        
        // Set field of view for better perspective
        el.fieldOfView = '35deg';

        // Set zoom limits based on model size
        el.minFieldOfView = '15deg'; // Maximum zoom in
        el.maxFieldOfView = '60deg'; // Maximum zoom out
      } catch (error) {
        console.error('Error setting up model viewer:', error);
      }
    };

    const handleError = () => {
      console.error('Model viewer failed to load');
      setFallback(true);
    };

    el.addEventListener('load', handleLoad);
    el.addEventListener('error', handleError as any);
    
    return () => {
      el.removeEventListener('load', handleLoad);
      el.removeEventListener('error', handleError as any);
    };
  }, [src]);

  const reset = () => {
    const el = ref.current as MVElement;
    if (!el) return;

    try {
      // Reset to initial orbit position
      el.cameraOrbit = initialOrbit;
      
      // Reset field of view if it was changed by zoom
      el.fieldOfView = '35deg';
      
      // Ensure constraints are still in place
      el.minCameraOrbit = `auto 5deg auto`;
      el.maxCameraOrbit = `auto 85deg auto`;
    } catch (error) {
      console.error('Error resetting view:', error);
    }
  };

  return (
    <div className="relative w-full h-[720px] md:h-[860px] rounded-xl overflow-hidden bg-neutral-900">
      {fallback ? (
        <video
          src="/content/Austrian Abbey.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster={poster}
        />
      ) : (
        // @ts-ignore custom element
        <model-viewer
          ref={ref}
          src={src}
          poster={poster}
          camera-controls
          interaction-prompt="none"
          camera-orbit="0deg 45deg 100%"
          field-of-view="35deg"
          min-camera-orbit="auto 5deg auto"
          max-camera-orbit="auto 85deg auto"
          min-field-of-view="15deg"
          max-field-of-view="60deg"
          environment-image="neutral"
          exposure="1.0"
          shadow-intensity="0.3"
          shadow-softness="0.5"
          disable-pan
          interpolation-decay="100"
          class="absolute inset-0 w-full h-full"
        ></model-viewer>
      )}

      <button
        onClick={reset}
        className="absolute top-4 right-4 z-20 px-4 py-2 rounded-md border border-brand-gold/40 bg-black/60 backdrop-blur-sm text-brand-gold/80 hover:text-brand-gold hover:border-brand-gold hover:bg-black/70 text-sm tracking-wide transition-all duration-200"
        aria-label="Reset View"
      >
        Reset View
      </button>
    </div>
  );
}


