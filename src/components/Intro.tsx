import { motion } from 'framer-motion';
import { VIS_POLISH_V1 } from '../config/flags';
import content from '../data/content.json';

export default function Intro() {
  if (VIS_POLISH_V1) {
    const introImage = (content as any)?.intro?.image as string | undefined;
    const introImageAlt = ((content as any)?.intro?.imageAlt as string | undefined) || "Thomas Weber";
    return (
      <section id="intro-hero" className="w-full py-24 px-6 relative z-20 bg-brand-bg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(215,183,100,0.08),transparent_60%)] pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Video/Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative"
            >
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-brand-gold/10 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5">
                {introImage ? (
                  <>
                    <img
                      src={introImage}
                      alt={introImageAlt}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="eager"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </>
                ) : (
                  <>
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                      poster="/assets/drone-placeholder.jpg"
                    >
                      <source src="/assets/intro-drone.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </>
                )}
              </div>
            </motion.div>

            {/* Right: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="relative z-10 space-y-6"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-2">
                  Hi, I'm <span className="text-brand-gold">Thomas</span>
                </h1>
                <p className="text-sm md:text-base text-brand-gold/70 font-light tracking-wide">
                  Drone Pilot Based in Leuven, Belgium
                </p>
              </div>

              <div className="space-y-4 text-base md:text-lg text-white/90 leading-relaxed">
                <p>
                  What started as an interest in flying has grown into a real curiosity for what drones can do — from capturing unique visuals to creating data that helps people see and understand projects differently.
                </p>

                <p>
                  I’m learning every day — exploring aerial photography, mapping, 3D modeling, and now FPV flying to capture smoother, more dynamic shots. This website is where I share that progress: a place to document my work, test new ideas, and build a foundation for turning this into a full-time career.
                </p>

                <p>
                  Right now, I’m focused on gaining more hands-on experience and working with local companies who are open to experimenting with aerial data — whether that’s tracking site progress, visualizing change, or just finding new ways to look at familiar places.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/12 to-transparent" />
      </section>
    );
  }

  // Original intro (fallback when VIS_POLISH_V1 = false)
  return (
    <section id="intro-hero" className="min-h-[360px] sm:min-h-[420px] flex flex-col items-center justify-center px-6 py-20 sm:py-24 text-center relative z-20 bg-brand-bg transition-all duration-500">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(215,183,100,0.08),transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full">
        <motion.h1
          id="intro-headline"
          className="text-[2.75rem] leading-[1.1] sm:text-6xl md:text-7xl font-bold text-brand-text mb-5 sm:mb-6 tracking-tight transition-all duration-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Thomas <span className="text-brand-gold">Weber</span>
        </motion.h1>

        <motion.p
          className="text-[1.05rem] sm:text-lg md:text-xl text-brand-text/70 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        >
          Aerial imagery, orthomosaics, and 3D modeling for modern projects.
        </motion.p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/12 to-transparent" />
    </section>
  );
}
