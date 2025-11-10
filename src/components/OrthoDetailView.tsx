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

interface OrthoDetailViewProps {
  title: string;
  subtitle: string;
  description: string;
  embed: Embed;
  pillars: Pillar[];
  process: ProcessStep[];
}

function OrthoMapStage({ src, hint }: { src: string; hint: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-[520px] md:h-[580px] lg:h-[640px] rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 animate-pulse -z-10 pointer-events-none" style={{ opacity: !isLoaded ? 1 : 0, transition: 'opacity 0.3s' }} />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20 pointer-events-none -z-10" />
      <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_40px_rgba(215,183,100,0.08)] pointer-events-none -z-10" />
      <iframe
        src={src}
        className="absolute inset-0 w-full h-full border-0 relative z-10"
        allow="geolocation; fullscreen"
        title="Orthomosaic Map"
        onLoad={() => setIsLoaded(true)}
      />
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

function USPCard({ pillar, index }: { pillar: Pillar; index: number }) {
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
        From Flight to Orthomosaic
      </motion.h3>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
            className="relative"
          >
            <div className="p-5 rounded-xl border border-[rgba(201,162,75,0.15)] bg-[rgba(255,255,255,0.08)]
                         hover:border-[rgba(201,162,75,0.25)] transition-all duration-200 h-full flex flex-col min-h-[200px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#d4a849] flex items-center justify-center text-sm font-bold text-black shrink-0 shadow-lg">
                  {index + 1}
                </div>
                <h4 className="text-base md:text-lg font-semibold text-white tracking-wide leading-tight relative z-10">
                  {step.step}
                </h4>
              </div>
              <p className="text-base text-white/85 mb-2 leading-relaxed relative z-10">
                {step.line}
              </p>
              <p className="text-sm text-white/70 leading-relaxed mt-auto relative z-10">
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

export default function OrthoDetailView({
  title,
  subtitle,
  description,
  embed,
  pillars,
  process,
}: OrthoDetailViewProps) {
  const useCases = {
    heading: "Where Orthomosaics Add Value",
    subheading: "From site planning to project communication",
    cases: [
      {
        title: "Construction Monitoring",
        description: "Track progress and spot issues early with up-to-date, measurable site records."
      },
      {
        title: "Infrastructure Inspection",
        description: "Document large assets like roads, roofs, or utilities without scaffolding or lane closures."
      },
      {
        title: "Site Planning",
        description: "Align CAD drawings or GIS data directly with real-world conditions."
      },
      {
        title: "Environmental Tracking",
        description: "Monitor vegetation, erosion, or drainage changes through consistent datasets."
      },
      {
        title: "Public Communication",
        description: "Share clear before-and-after visuals for client or community updates."
      },
      {
        title: "Volume & Earthwork Analysis",
        description: "Calculate material stockpiles or cut-and-fill volumes for accurate reporting and planning."
      }
    ]
  };

  const deliverables = {
    heading: "What You'll Receive",
    subheading: "Output Type • Format • Use Case / Benefit",
    outputs: [
      {
        type: "Orthomosaic Map",
        format: ".tiff, .GeoTIFF",
        useCase: "Scaled, shareable surface map"
      },
      {
        type: "DEM / DSM",
        format: ".tiff, .xyz",
        useCase: "Terrain & elevation insight"
      },
      {
        type: "Contours",
        format: ".shp, .dxf",
        useCase: "Elevation data for engineering"
      },
      {
        type: "KML Overlay",
        format: ".kml",
        useCase: "Lightweight preview in Google Earth or Cesium"
      },
      {
        type: "PDF Report",
        format: ".pdf",
        useCase: "Quick offline overview for sharing"
      }
    ]
  };

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-[#0b0b0b] to-[#111111]">
      <div className="max-w-[2000px] mx-auto pb-12 px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative text-center space-y-4 pt-12 pb-16 md:pt-16 md:pb-20"
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
            {/* Note will be positioned below, right-aligned near first media */}
            <p className="text-sm text-white/70 max-w-2xl mx-auto mt-3 tracking-wide relative z-10">
              Accurate • Shareable • Time-Synced • Geo-Referenced
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="px-3 py-1 text-[0.85rem] rounded-xl border border-[#c9a24b]/50 text-brand-gold/80 hover:text-brand-gold hover:border-[#c9a24b]/70 transition-all duration-300 tracking-wide">
                Mapping
              </span>
              <span className="px-3 py-1 text-[0.85rem] rounded-xl border border-[#c9a24b]/50 text-brand-gold/80 hover:text-brand-gold hover:border-[#c9a24b]/70 transition-all duration-300 tracking-wide">
                Measurement
              </span>
              <span className="px-3 py-1 text-[0.85rem] rounded-xl border border-[#c9a24b]/50 text-brand-gold/80 hover:text-brand-gold hover:border-[#c9a24b]/70 transition-all duration-300 tracking-wide">
                Monitoring
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right-aligned service note aligned with first media section */}
        <div className="px-8 md:px-12">
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
          className="w-full space-y-3 pb-16 md:pb-20"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/15 rounded-xl pointer-events-none -z-10" />
            <div className="shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <CesiumStory url="https://ion.cesium.com/stories/viewer/?id=0a018634-c22a-4d55-9448-d358f779cf96" />
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-sm text-white/70 tracking-wide relative z-10"
          >
            Interactive map — pan, zoom, and explore.
          </motion.p>
        </motion.div>

        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-[#c9a24b]/40 to-transparent mx-auto my-12" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="py-12 md:py-16 px-6 md:px-12 lg:px-18"
        >
          <div className="text-center space-y-3 mb-12">
            <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-wide leading-tight relative z-10 isolate">
              What You See, What You Get
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pillars.map((pillar, index) => (
              <USPCard key={index} pillar={pillar} index={index} />
            ))}
          </div>
        </motion.div>

        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-[#c9a24b]/40 to-transparent mx-auto my-12" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="py-12 md:py-16 px-6 md:px-12 lg:px-18"
        >
          <div className="max-w-6xl mx-auto">
            <UseCaseCards
              heading={useCases.heading}
              subheading={useCases.subheading}
              cases={useCases.cases}
            />
          </div>
        </motion.div>

        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-[#c9a24b]/40 to-transparent mx-auto my-12" />

        {/* From Flight to Orthomosaic (comparison) */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="py-20 md:py-24 bg-gradient-to-b from-[#101010] to-[#0c0c0c]"
        >
          <div className="max-w-[2400px] mx-auto px-6 md:px-12">
            <div className="text-center space-y-3 mb-12">
              <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-wide leading-tight relative z-10 isolate">
                From Flight to Orthomosaic
              </h3>
              <p className={`text-base md:text-lg leading-relaxed tracking-wide max-w-3xl mx-auto relative z-10 ${
                VIS_POLISH_V1 ? 'text-white/90' : 'text-white/85'
              }`}>
                See how aerial footage becomes a precise, geo-referenced map.
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
                className="relative w-full max-w-[1862px] 2xl:max-w-[2128px] rounded-2xl overflow-hidden transition-all duration-200 aspect-video mx-auto"
              >
                <iframe
                  src="https://www.youtube-nocookie.com/embed/Bhv0oZyshX0?autoplay=1&mute=1&loop=1&playlist=Bhv0oZyshX0&controls=0&modestbranding=1&rel=0&showinfo=0"
                  className="w-full h-full rounded-2xl"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Flight to Orthomosaic"
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
                className="relative w-full max-w-[1862px] 2xl:max-w-[2128px] rounded-2xl overflow-hidden transition-all duration-200 aspect-video mx-auto"
              >
                <iframe
                  src="https://www.youtube-nocookie.com/embed/RKhnELEe870?autoplay=1&mute=1&loop=1&playlist=RKhnELEe870&controls=0&modestbranding=1&rel=0&showinfo=0"
                  className="w-full h-full rounded-2xl"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Orthomosaic Result"
                />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/40 text-[10px] text-white/70 uppercase tracking-wider z-10">
                  Autoplay
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-[#c9a24b]/40 to-transparent mx-auto my-12" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="py-12 md:py-16 px-6 md:px-12 lg:px-18"
        >
          <div className="max-w-6xl mx-auto">
            <ProcessTimeline steps={process} />
          </div>
        </motion.div>

        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-[#c9a24b]/40 to-transparent mx-auto my-12" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="py-12 md:py-16 px-6 md:px-12 lg:px-18"
        >
          <div className="max-w-6xl mx-auto">
            <DeliverablesTable
              heading={deliverables.heading}
              subheading={deliverables.subheading}
              outputs={deliverables.outputs}
            />
          </div>
        </motion.div>

        <div className="w-2/3 h-[1px] border-t border-[#c9a24b]/40 mx-auto mt-16 mb-8" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="py-16 md:py-20 bg-gradient-to-b from-[#0a0a0a] to-[#000000] px-6 md:px-12 lg:px-18"
        >
          <div className="relative text-center space-y-4 max-w-3xl mx-auto">
            <p className={`text-lg md:text-xl leading-relaxed tracking-wide font-medium relative z-10 isolate ${
              VIS_POLISH_V1 ? 'text-white' : 'text-white/90'
            }`}>
              See Your Site as a Living Map
            </p>
            <p className={`text-base md:text-lg leading-relaxed tracking-wide relative z-10 ${
              VIS_POLISH_V1 ? 'text-white/90' : 'text-white/85'
            }`}>
              Orthomosaics are easy to update. The same flight plan can be repeated at any interval — giving you a living record of your site as it develops. Happy to share an example or run a small test flight to show how the process works.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="pt-6"
            >
              <a
                href="#contact"
                className="inline-block px-8 py-3 rounded-xl border border-brand-gold/40 text-brand-gold/80 hover:text-brand-gold hover:border-brand-gold transition-all duration-300 tracking-wide"
              >
                Get in touch
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
