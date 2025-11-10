import { useEffect, useRef, useState } from 'react';

type CesiumModelProps = {
  tilesetAssetId: number;
  token: string;
  background?: 'black' | 'white' | 'gray';
  vacuum?: boolean; // hide globe/sky
};

declare global {
  interface Window {
    Cesium: any;
  }
}

export default function CesiumModel({ tilesetAssetId, token, background = 'black', vacuum = true }: CesiumModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let viewer: any;
    let cancelled = false;

    const ensureCesium = async () => {
      if (!document.getElementById('cesium-style')) {
        const link = document.createElement('link');
        link.id = 'cesium-style';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/cesium@latest/Build/Cesium/Widgets/widgets.css';
        document.head.appendChild(link);
      }
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
        if (cancelled || !containerRef.current) return;
        const Cesium = window.Cesium;

        Cesium.Ion.defaultAccessToken = token;

        viewer = new Cesium.Viewer(containerRef.current, {
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
          imageryProvider: false,
          terrainProvider: undefined,
        });

        // Vacuum look
        if (vacuum) {
          viewer.scene.globe.show = false;
          viewer.scene.skyBox.show = false;
          viewer.scene.skyAtmosphere.show = false;
        }
        viewer.scene.backgroundColor =
          background === 'white'
            ? Cesium.Color.WHITE
            : background === 'gray'
            ? Cesium.Color.GRAY
            : Cesium.Color.BLACK;

        // Load tileset from ion
        const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(tilesetAssetId);
        viewer.scene.primitives.add(tileset);
        // Zoom to tileset
        try {
          await viewer.zoomTo(tileset);
        } catch {
          if (tileset.readyPromise) {
            await tileset.readyPromise;
            await viewer.zoomTo(tileset);
          }
        }
        // Apply default style if provided by ion
        const extras = tileset.asset?.extras;
        if (extras?.ion?.defaultStyle) {
          // eslint-disable-next-line new-cap
          tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
        }

        setReady(true);
      } catch (e: any) {
        setError(e?.message || 'Failed to initialize model viewer');
      }
    };

    init();
    return () => {
      cancelled = true;
      try {
        if (viewer && !viewer.isDestroyed?.()) viewer.destroy();
      } catch {
        // ignore
      }
    };
  }, [tilesetAssetId, token, background, vacuum]);

  return (
    <div className="relative w-full h-[720px] md:h-[860px] rounded-xl overflow-hidden border border-brand-gold/10 bg-black/60">
      {!ready && !error && (
        <div className="absolute inset-0 flex items-center justify-center text-white/80 text-sm">Loading 3D model…</div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-300 text-sm px-4 text-center">
          {error}
        </div>
      )}
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute right-3 top-3 z-10 text-[11px] text-white/70 bg-black/50 border border-white/15 rounded px-2 py-1">
        CesiumJS • Camera: orbit / pan / zoom
      </div>
    </div>
  );
}


