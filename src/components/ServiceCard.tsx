import { motion } from 'framer-motion';

interface ServiceCardProps {
  id: 'aerial' | 'orthos' | 'models';
  title: string;
  subtitle?: string;
  onExpand?: () => void;
}

const cardNumbers: Record<string, string> = {
  aerial: '01',
  orthos: '02',
  models: '03',
};

const cardSubtitles: Record<string, string> = {
  aerial: 'From Sky to Story',
  orthos: 'Precision in Pixels',
  models: 'Digital Twin Reality',
};

export default function ServiceCard({ id, title, subtitle, onExpand }: ServiceCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onExpand) {
      e.preventDefault();
      onExpand();
    }
  };

  return (
    <motion.div
      layoutId={`card-${id}`}
      role="button"
      tabIndex={0}
      onClick={onExpand}
      onKeyDown={handleKeyDown}
      whileHover={{
        scale: 1.03,
        rotateY: 1,
        rotateX: -1,
        y: -10,
      }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative w-full aspect-[16/10] rounded-3xl border border-brand-gold/20
                 shadow-glow cursor-grab active:cursor-grabbing select-none outline-none overflow-hidden group
                 bg-gradient-to-br from-[rgba(215,183,100,0.03)] via-[rgba(255,255,255,0.01)] to-transparent"
    >
      <div className="absolute inset-0 shadow-inner-glow -z-10 pointer-events-none" />

      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 pointer-events-none" />

      <div className="h-full flex flex-col items-center justify-center text-center gap-3 px-6 relative z-10 isolate">
        <span className="text-xs uppercase tracking-[0.2em] text-brand-gold/60 font-semibold relative z-10">
          {cardNumbers[id]} — {subtitle?.toUpperCase() || 'SERVICE'}
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight
                       group-hover:text-brand-gold transition-colors duration-400 relative overflow-hidden z-10 isolate">
          {title}
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent
                       -z-10 pointer-events-none"
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </h2>

        <p className="text-sm tracking-wider text-brand-gold/80 uppercase font-light mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
          {cardSubtitles[id]}
        </p>
      </div>

      <span className="absolute bottom-6 right-6 text-xs text-brand-gold/40 uppercase tracking-wider
                       group-hover:text-brand-gold/70 transition-colors duration-300 z-10">
        Explore
      </span>

      <div className="absolute inset-0 bg-gradient-to-t from-brand-gold/5 via-transparent to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none" />
    </motion.div>
  );
}
