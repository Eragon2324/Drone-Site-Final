import { motion } from 'framer-motion';
import PhotoCarousel from './PhotoCarousel';
import AlternatingVideoText from './AlternatingVideoText';
import FeaturedShotsCarousel from './FeaturedShotsCarousel';
import { VIS_POLISH_V1 } from '../config/flags';

interface Photo {
  src: string;
  caption?: string;
}

interface VideoItem {
  type: 'mp4' | 'youtube';
  src: string;
  poster?: string;
  caption?: string;
}

interface VideoSection {
  layout: 'video-left' | 'video-right';
  title: string;
  body: string;
  usps: string[];
  videoRef: number;
}

interface AerialDetailViewProps {
  title: string;
  subtitle: string;
  description: string;
  photos: Photo[];
  videos: VideoItem[];
  videoSections: VideoSection[];
}

export default function AerialDetailView({
  title,
  subtitle,
  description,
  photos,
  videos,
  videoSections,
}: AerialDetailViewProps) {
  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-[#0b0b0b] to-[#111111]">
      <section className="max-w-5xl mx-auto px-8 md:px-12 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'anticipate' }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {title}
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            className="text-lg md:text-xl text-brand-gold tracking-wide font-light"
          >
            {subtitle}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className={`text-base max-w-3xl mx-auto leading-relaxed tracking-wide whitespace-pre-line ${
              VIS_POLISH_V1 ? 'text-white/90' : 'text-white/85'
            }`}
          >
            {description}
          </motion.p>
          {/* Note will be placed below, right-aligned near first media */}
        </motion.div>
      </section>

      {/* Right-aligned service note aligned with first media section */}
      <div className="px-8 md:px-12 max-w-[1400px] mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.05, ease: 'easeOut' }}
          className="text-xs text-white/70 italic mt-2 max-w-3xl ml-auto text-center md:text-right"
        >
          Note: On-site previews are compressed for faster loading. Delivered footage and 3D models are provided in full 4K quality with higher texture fidelity.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
      >
        <FeaturedShotsCarousel />
      </motion.div>

      <section className="max-w-[2400px] mx-auto px-8 md:px-12 py-20">
        <AlternatingVideoText sections={videoSections} videos={videos} />
      </section>

      <section className="w-full border-t border-brand-gold/40 mt-16 pt-16 bg-gradient-to-b from-transparent to-black/60 pb-24 flex flex-col items-center text-center">
        <div className="w-2/3 h-[1px] border-t border-brand-gold/40 mx-auto mb-10" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'anticipate' }}
          className="max-w-xl px-8 md:px-12"
        >
          <h3 className="text-xl md:text-2xl font-medium text-white mb-4">
            Curious what your site could look like from above?
          </h3>
          <p className={`mb-8 leading-relaxed tracking-wide ${
            VIS_POLISH_V1 ? 'text-white/90' : 'text-white/80'
          }`}>
            I'm always happy to chat or share a quick demo — no pressure, no sales talk.
          </p>
          <a
            href="#contact"
            className="inline-block border border-brand-gold/40 text-brand-gold/80 hover:text-brand-gold hover:border-brand-gold px-8 py-3 rounded-xl transition-all duration-300 tracking-wide"
          >
            Let's Talk
          </a>
        </motion.div>
      </section>
    </div>
  );
}
