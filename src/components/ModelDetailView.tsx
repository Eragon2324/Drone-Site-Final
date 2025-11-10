import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import UseCaseCards from './UseCaseCards';
import DeliverablesTable from './DeliverablesTable';
import { VIS_POLISH_V1 } from '../config/flags';
import CesiumStory from './CesiumStory';

interface Embed {
  type: string;
  src: string;
  hint: string;
}

interface Pillar {
  title: string;
  body: string;
}

interface ProcessStep {
  step: string;
  line: string;
  detail: string;
}

interface UseCase {
  title: string;
  description: string;
}

interface UseCases {
  heading: string;
  subheading: string;
  cases: UseCase[];
}

interface Deliverable {
  type: string;
  format: string;
  useCase: string;
}

interface Deliverables {
  heading: string;
  subheading: string;
  outputs: Deliverable[];
}

interface CTA {
  message: string;
  submessage: string;
  note: string;
}

interface ModelDetailViewProps {
  title: string;
  subtitle: string;
  description: string;
  embed: Embed;
  pillars: Pillar[];
  useCases: UseCases;
  deliverables: Deliverables;
  process: ProcessStep[];
  cta: CTA;
  closing: string;
}

function ModelStage({ src, hint, glbSrc }: { src: string; hint: string; glbSrc?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-[720px] md:h-[860px] rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 animate-pulse -z-10 pointer-events-none" style={{ opacity: !isLoaded ? 1 : 0, transition: 'opacity 0.3s' }} />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20 pointer-events-none -z-10" />
      <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_40px_rgba(215,183,100,0.08)] pointer-events-none -z-10" />
      {glbSrc ? (
        // Render local GLB with <model-viewer>
        // @ts-ignore - custom element
        <model-viewer
          src={glbSrc}
          camera-controls
          interaction-prompt="none"
          camera-orbit="0deg 45deg 100%"
          camera-target="auto"
          min-camera-orbit="auto 15deg auto"
          max-camera-orbit="auto 100deg auto"
          field-of-view="35deg"
          environment-image="neutral"
          exposure="1.0"
          shadow-intensity="0.2"
          disable-tap
          class="absolute inset-0 w-full h-full"
          onLoad={() => setIsLoaded(true)}
        ></model-viewer>
      ) : (
        <iframe
          src={src}
          className="absolute inset-0 w-full h-full border-0 relative z-10"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          title="Interactive 3D Model"
          aria-label="Interactive 3D model of project site"
          onLoad={() => setIsLoaded(true)}
        />
      )}
      {showHint && isLoaded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full
                   bg-black/40 border border-brand-gold/20
                   text-sm text-white tracking-wide pointer-events-none z-20"
        >
          {hint}
        </motion.div>
      )}
    </div>
  );
}

function ValuePillar({ pillar, index }: { pillar: Pillar; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(201,162,75,0.18)' }}
      className="p-6 rounded-xl border border-[rgba(201,162,75,0.15)] bg-[rgba(255,255,255,0.08)]
               hover:border-[rgba(201,162,75,0.25)] transition-all duration-200 h-full flex flex-col"
    >
      <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 tracking-wide leading-tight relative z-10 isolate">
        {pillar.title}
      </h3>
      <p className={`text-base md:text-lg leading-relaxed tracking-wide relative z-10 ${
        VIS_POLISH_V1 ? 'text-white/90' : 'text-white/85'
      }`}>
        {pillar.body}
      </p>
    </motion.div>
  );
}

function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <div className="space-y-8">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-semibold text-white tracking-wide text-center leading-tight relative z-10 isolate"
      >
        How It's Made
      </motion.h3>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-6 justify-items-center items-stretch">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
            className="relative w-full max-w-[300px]"
          >
            <div className="p-5 rounded-xl border border-[rgba(201,162,75,0.15)] bg-[rgba(255,255,255,0.08)]
                         hover:border-[rgba(201,162,75,0.25)] transition-all duration-200 h-full flex flex-col min-h-[300px] md:min-h-[320px] text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#d4a849] flex items-center justify-center text-sm font-bold text-black shrink-0 shadow-lg">
                  {index + 1}
                </div>
                <h4 className="text-base md:text-lg font-semibold text-white tracking-wide leading-tight break-words">
                  {step.step}
                </h4>
              </div>
              <p className="text-base text-white/85 mb-2 leading-relaxed relative z-10 break-words">
                {step.line}
              </p>
              <p className="text-sm text-white/70 leading-relaxed mt-auto relative z-10 break-words">
                {step.detail}
              </p>
            </div>

            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-[1px] border-t border-dashed border-[rgba(201,162,75,0.3)] -translate-y-1/2" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ModelDetailView({
  title,
  subtitle,
  description,
  embed,
  pillars,
  useCases,
  deliverables,
  process,
  cta,
  closing,
}: ModelDetailViewProps) {
  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-[#0b0b0b] to-[#111111]">
      <div className="max-w-[2000px] mx-auto pb-12 px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative text-center space-y-4 pt-20 pb-20 md:pt-24 md:pb-24"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_800px_at_50%_0%,rgba(201,162,75,0.08),transparent)] -z-10 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight relative z-10 isolate">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-brand-gold tracking-wide font-semibold mt-3 relative z-10">
              {subtitle}
            </p>
            <p className={`text-base md:text-lg max-w-3xl mx-auto leading-relaxed tracking-wide mt-4 relative z-10 whitespace-pre-line ${
              VIS_POLISH_V1 ? 'text-white/90' : 'text-white/85'
            }`}>
              {description}
            </p>
            {/* Note will be placed below, right-aligned alongside first media */}
          </div>
        </motion.div>

        {/* Right-aligned service note aligned with first media section */}
        <div className="px-6 md:px-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="text-xs text-white/70 italic mt-2 max-w-3xl ml-auto text-center md:text-right"
          >
            Note: On-site previews are compressed for faster loading. Delivered footage and 3D models are provided in full 4K quality with higher texture fidelity.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full space-y-3 py-20 md:py-24"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/15 rounded-xl pointer-events-none -z-10" />
            <div className="shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <CesiumStory url="https://ion.cesium.com/stories/viewer/?id=3161e9e1-c60f-43e1-b309-0db6c6293443" />
            </div>
            <div className="mt-3 md:mt-4 text-center md:text-left px-2 md:px-0">
              <p className="text-xs md:text-sm text-white/80 tracking-wide">
                <span className="font-semibold text-white/90">Controls:</span> Middle‑click (wheel) drag to orbit · Right‑click drag to pan ·
                Scroll (or trackpad pinch) to zoom.
              </p>
              <p className="text-xs md:text-sm text-white/70 italic mt-2">
                Due to web processing limitations, the true quality of the model may not be fully represented in an embed. For a more accurate
                view, watch this quick 50‑second video:{' '}
                <a
                  href="https://youtu.be/UBH4Qci5teU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-brand-gold hover:text-white"
                >
                  https://youtu.be/UBH4Qci5teU
                </a>
                .
              </p>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-sm text-white/70 tracking-wide relative z-10"
          >
            Interactive model — drag, zoom, and explore.
          </motion.p>
        </motion.div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(201,162,75,0.25)] to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="py-20 md:py-24 px-6 md:px-12 lg:px-18"
        >
          <div className="text-center space-y-3 mb-12">
            <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-wide leading-tight relative z-10 isolate">
              Practical Uses
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pillars.map((pillar, index) => (
            <ValuePillar key={index} pillar={pillar} index={index} />
          ))}
          </div>
        </motion.div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(201,162,75,0.25)] to-transparent" />

        {/* How It's Made — placed directly above From Flight to 3D Reality */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="py-20 md:py-24 px-6 md:px-12 lg:px-18"
        >
          <div className="max-w-6xl mx-auto">
            <ProcessTimeline steps={process} />
          </div>
        </motion.div>

        {/* Removed "Where 3D Models Add Value" per new order */}

        {/* Case study section removed per request */}

        {/* Video comparison moved below How it's made */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          id="video-comparison"
          className="py-20 md:py-24 bg-gradient-to-b from-[#101010] to-[#0c0c0c]"
        >
          <div className="max-w-[2400px] mx-auto px-6 md:px-12">
            <div className="text-center space-y-3 mb-12">
              <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-wide leading-tight relative z-10 isolate">
                From Flight to 3D Reality
              </h3>
              <p className={`text-base md:text-lg leading-relaxed tracking-wide max-w-3xl mx-auto relative z-10 ${
                VIS_POLISH_V1 ? 'text-white/90' : 'text-white/85'
              }`}>
                A few minutes of flight data can be transformed into a high-fidelity, geo-referenced model. These models support planning, inspection, and stakeholder engagement — all from one accessible dataset.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative items-center justify-items-center">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[rgba(201,162,75,0.2)] to-transparent -translate-x-1/2 -z-10 pointer-events-none" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ filter: 'brightness(1.08)' }}
                className="relative w-full max-w-[1862px] 2xl:max-w-[2128px] rounded-2xl overflow-hidden bg-black p-1 transition-all duration-200 aspect-video mx-auto"
              >
                <iframe
                  src="https://www.youtube-nocookie.com/embed/Bhv0oZyshX0?autoplay=1&mute=1&loop=1&playlist=Bhv0oZyshX0&controls=0&modestbranding=1&rel=0&showinfo=0"
                  className="w-full h-full rounded-xl"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="From Flight to 3D Model"
                />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/40 text-[10px] text-white/70 uppercase tracking-wider z-10">
                  Autoplay
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ filter: 'brightness(1.08)' }}
                className="relative w-full max-w-[1862px] 2xl:max-w-[2128px] rounded-2xl overflow-hidden bg-black p-1 transition-all duration-200 aspect-video mx-auto"
              >
                <iframe
                  src="https://www.youtube-nocookie.com/embed/UBH4Qci5teU?autoplay=1&mute=1&loop=1&playlist=UBH4Qci5teU&controls=0&modestbranding=1&rel=0&showinfo=0"
                  className="w-full h-full rounded-xl"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="3D Model Result"
                />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/40 text-[10px] text-white/70 uppercase tracking-wider z-10">
                  Autoplay
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="py-20 md:py-24 px-6 md:px-12 lg:px-18"
        >
          <div className="max-w-6xl mx-auto">
            <DeliverablesTable
            heading={deliverables.heading}
            subheading={deliverables.subheading}
            outputs={deliverables.outputs}
            />
          </div>
        </motion.div>

        {/* Removed duplicate How It's Made at the bottom */}

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(201,162,75,0.25)] to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="py-20 md:py-24 bg-gradient-to-b from-[#0a0a0a] to-[#000000] px-6 md:px-12 lg:px-18"
        >
          <div className="relative text-center space-y-4 max-w-3xl mx-auto">
            <p className={`text-lg md:text-xl leading-relaxed tracking-wide font-medium relative z-10 isolate ${
              VIS_POLISH_V1 ? 'text-white' : 'text-white'
            }`}>
              Curious what your property or project might look like in 3D?
            </p>
            <p className={`text-base md:text-lg leading-relaxed tracking-wide relative z-10 ${
              VIS_POLISH_V1 ? 'text-white/90' : 'text-white/85'
            }`}>
              Happy to share examples or create a small test scan — no pressure.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center pt-8"
          >
            <p className="text-xl md:text-2xl text-brand-gold font-light tracking-wide italic relative z-10">
              {closing}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
