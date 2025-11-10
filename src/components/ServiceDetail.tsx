import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useLazyEmbed } from '../hooks/useLazyEmbed';
import { FEATURE_EMBEDS, VIS_POLISH_V1 } from '../config/flags';
import ModelViewer from './ModelViewer';
import MapViewer from './MapViewer';
import VideoPlayer from './VideoPlayer';
import AerialDetailView from './AerialDetailView';
import OrthoDetailView from './OrthoDetailView';
import ModelDetailView from './ModelDetailView';
import content from '../data/content.json';

interface ServiceDetailProps {
  id: 'aerial' | 'orthos' | 'models';
  title: string;
  description?: string;
  onClose: () => void;
}

export default function ServiceDetail({ id, title, description, onClose }: ServiceDetailProps) {
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const { ready } = useLazyEmbed(true);

  useEffect(() => {
    backButtonRef.current?.focus();
  }, []);

  const renderViewer = () => {
    const service = content.services.find(s => s.id === id);
    if (!service) return null;

    if (service.media.type === 'aerial-detail' && 'photos' in service.media && 'videos' in service.media) {
      const photos = service.media.photos || [];
      const videos = service.media.videos || [];
      const videoSections = ('videoSections' in service ? service.videoSections : []) || [];

      return (
        <AerialDetailView
          title={service.title}
          subtitle={service.subtitle}
          description={service.description}
          photos={photos}
          videos={videos as any}
          videoSections={videoSections as any}
        />
      );
    }

    if (service.media.type === 'ortho-detail' && 'embed' in service && 'pillars' in service && 'process' in service) {
      const embed = service.embed || { type: 'cesium', src: '', hint: '' };
      const pillars = service.pillars || [];
      const process = service.process || [];

      return (
        <OrthoDetailView
          title={service.title}
          subtitle={service.subtitle}
          description={service.description}
          embed={embed as any}
          pillars={pillars as any}
          process={process as any}
        />
      );
    }

    if (service.media.type === 'model-detail' && 'embed' in service && 'pillars' in service && 'useCases' in service && 'deliverables' in service && 'process' in service && 'cta' in service && 'closing' in service) {
      const embed = service.embed || { type: 'sketchfab', src: '', hint: '' };
      const pillars = service.pillars || [];
      const useCases = service.useCases || { heading: '', subheading: '', cases: [] };
      const deliverables = service.deliverables || { heading: '', subheading: '', outputs: [] };
      const process = service.process || [];
      const cta = service.cta || { message: '', submessage: '', note: '' };
      const closing = service.closing || '';

      return (
        <ModelDetailView
          title={service.title}
          subtitle={service.subtitle}
          description={service.description}
          embed={embed as any}
          pillars={pillars as any}
          useCases={useCases as any}
          deliverables={deliverables as any}
          process={process as any}
          cta={cta as any}
          closing={closing}
        />
      );
    }

    if (!ready) {
      return (
        <div className="h-full w-full rounded-2xl border border-brand-gold/10
                        bg-gradient-to-br from-[rgba(215,183,100,0.02)] to-transparent animate-pulse shadow-inner-glow" />
      );
    }

    if (!FEATURE_EMBEDS) {
      return (
        <div className="h-full w-full rounded-2xl border border-brand-gold/20
                        bg-gradient-to-br from-[rgba(215,183,100,0.03)] via-[rgba(255,255,255,0.01)] to-transparent
                        shadow-inner-glow flex items-center justify-center text-sm text-brand-gold/60 tracking-wide">
          Preview coming soon
        </div>
      );
    }

    switch (service.media.type) {
      case 'video':
        if ('src' in service.media && service.media.src) {
          return <VideoPlayer src={service.media.src} poster={'poster' in service.media ? service.media.poster as string : undefined} />;
        }
        return null;
      case 'map':
        if ('src' in service.media && service.media.src) {
          return <MapViewer src={service.media.src} />;
        }
        return null;
      case 'model':
        if ('src' in service.media && service.media.src) {
          return <ModelViewer src={service.media.src} />;
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <motion.div
      layoutId={`card-${id}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
      initial={{ scale: 1.02 }}
      animate={{ scale: 1 }}
      exit={{
        scale: 1.02,
        opacity: 0.95,
        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
      }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
        duration: 0.7,
      }}
      className="absolute inset-0 rounded-3xl border border-brand-gold/25 shadow-glow-strong
                 bg-gradient-to-br from-[rgba(215,183,100,0.05)] via-[#0e0e0e] to-[#0e0e0e]
                 p-5 md:p-8 flex flex-col z-50 overflow-hidden"
    >
      <motion.div
        className={`absolute inset-0 pointer-events-none z-0 ${
          VIS_POLISH_V1 ? 'bg-black/40 backdrop-blur-[2px]' : 'bg-black/50 backdrop-blur-sm'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      />

      <motion.div
        className="absolute inset-0 shadow-inner-glow -z-10 pointer-events-none"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      />

      <motion.div
        className="absolute inset-0 border border-brand-gold/40 rounded-3xl pointer-events-none -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 1, transition: { duration: 0.3, delay: 0.1 } }}
      />

      <motion.button
        ref={backButtonRef}
        onClick={onClose}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
        whileHover={{
          scale: 1.05,
          x: -4,
          textShadow: '0 0 8px rgba(215, 183, 100, 0.5)',
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex items-center gap-2 text-brand-gold hover:text-brand-text
                   transition-colors mb-6 text-sm font-semibold self-start z-10"
        aria-label="Close detail view"
      >
        <span className="text-lg">←</span>
        <span className="uppercase tracking-wider">Back</span>
      </motion.button>

      <div className="flex-1 flex flex-col md:flex-col gap-6 overflow-hidden relative z-10">
        {id === 'aerial' || id === 'orthos' || id === 'models' ? (
          <motion.div
            className="flex-1 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {renderViewer()}
          </motion.div>
        ) : (
          <>
            <motion.div
              className="text-center md:text-center px-4 md:min-h-[30%] relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h3 id="detail-title" className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight relative z-10 isolate">
                {title}
              </h3>
              {description && (
                <p className={`text-sm sm:text-base max-w-3xl mx-auto leading-relaxed tracking-wide relative z-10 ${
                  VIS_POLISH_V1 ? 'text-white/90' : 'text-white/85'
                }`}>
                  {description}
                </p>
              )}
            </motion.div>

            <motion.div
              className="flex-1 md:min-h-[70%] min-h-[400px]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {renderViewer()}
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
