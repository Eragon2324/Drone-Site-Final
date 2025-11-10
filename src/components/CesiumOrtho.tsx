import { useEffect, useRef, useState } from 'react';

type CesiumOrthoProps = {
  assetId: number;
  token?: string;
  camera?: {
    lat: number;
    lon: number;
    height?: number; // meters
    headingDeg?: number;
    pitchDeg?: number;
    rollDeg?: number;
  };
};

declare global {
  interface Window {
    Cesium: any;
  }
}

export default function CesiumOrtho({ assetId, token, camera }: CesiumOrthoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let viewer: any;
    let cancelled = false;

    const ensureCesium = async () => {
      if (!containerRef.current) {
        throw new Error('Viewer container not available');
      }
      // Inject CSS once
      if (!document.getElementById('cesium-style')) {
        const link = document.createElement('link');
        link.id = 'cesium-style';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/cesium@latest/Build/Cesium/Widgets/widgets.css';
        document.head.appendChild(link);
      }
      // Inject script if needed
      if (!window.Cesium) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/cesium@latest/Build/Cesium/Cesium.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Cesium.js'));
          document.body.appendChild(script);
        });
      }
    };

    const init = async () => {
      try {
        await ensureCesium();
        if (cancelled) return;
        const Cesium = window.Cesium;

        // Set token (explicit override if provided)
        Cesium.Ion.defaultAccessToken =
          token || (import.meta as any).env?.VITE_CESIUM_ION_TOKEN || Cesium.Ion.defaultAccessToken;

        // Create viewer
        viewer = new Cesium.Viewer(containerRef.current!, {
          animation: false,
          timeline: false,
          geocoder: false,
          baseLayerPicker: false,
          navigationHelpButton: false,
          selectionIndicator: false,
          homeButton: false,
          sceneModePicker: false,
          infoBox: false,
          fullscreenButton: false,
          // Start with no imagery; add orthomosaic as base
          imageryProvider: false,
        });

        // Add orthomosaic imagery as base layer
        const provider = await Cesium.IonImageryProvider.fromAssetId(assetId);
        if (!provider) throw new Error('Failed to create imagery provider');
        if (provider.readyPromise) {
          await provider.readyPromise;
        }
        viewer.imageryLayers.removeAll();
        const layer = viewer.imageryLayers.addImageryProvider(provider);
        // Prefer Cesium's built-in zoomTo which respects provider readiness and rectangle
        try {
          if (!viewer || viewer.isDestroyed?.()) throw new Error('Viewer not ready');
          await viewer.zoomTo(layer);
        } catch {
          // ignore; will use fallback or camera below
        }

        // If an explicit camera is provided, fly to it
        if (camera) {
          const Cesium = window.Cesium;
          const destination = Cesium.Cartesian3.fromDegrees(
            camera.lon,
            camera.lat,
            typeof camera.height === 'number' ? camera.height : 100.0
          );
          viewer.scene.camera.flyTo({
            destination,
            orientation: {
              heading: Cesium.Math.toRadians(camera.headingDeg ?? 0),
              pitch: Cesium.Math.toRadians(camera.pitchDeg ?? -45),
              roll: Cesium.Math.toRadians(camera.rollDeg ?? 0),
            },
            duration: 0.8,
          });
        } else {
          // Fallback: fly to rectangle if available
          const rect = provider.rectangle || layer?.imageryProvider?.rectangle;
          if (rect) {
            viewer.scene.camera.flyTo({ destination: rect, duration: 0.8 });
          } else {
            viewer.scene.camera.flyHome(0.8);
          }
        }
        setReady(true);
      } catch (e: any) {
        setError(e?.message || 'Failed to initialize orthomosaic viewer');
      }
    };

    init();
    return () => {
      cancelled = true;
      try {
        (viewer && !viewer.isDestroyed()) && viewer.destroy();
      } catch {
        // ignore
      }
    };
  }, [assetId, token]);

  return (
    <div className="relative w-full h-[520px] md:h-[580px] lg:h-[640px] rounded-xl overflow-hidden border border-brand-gold/10">
      {!ready && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white/70 text-sm">
          Loading orthomosaic…
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-red-300 text-sm px-4 text-center">
          {error}
        </div>
      )}
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}


