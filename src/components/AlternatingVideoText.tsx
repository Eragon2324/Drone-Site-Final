import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { VIS_POLISH_V1 } from '../config/flags';

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

interface AlternatingVideoTextProps {
  sections: VideoSection[];
  videos: VideoItem[];
}

function VideoBlock({ video }: { video: VideoItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.2, rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!videoRef.current || !shouldLoad) return;

    if (isInView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isInView, shouldLoad]);

  if (video.type === 'youtube') {
    let videoId = '';

    if (video.src.includes('youtu.be/')) {
      videoId = video.src.split('youtu.be/')[1].split('?')[0];
    } else if (video.src.includes('embed/')) {
      videoId = video.src.split('embed/')[1].split('?')[0];
    } else if (video.src.includes('v=')) {
      videoId = video.src.split('v=')[1].split('&')[0];
    }

    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&vq=hd1080`;
    console.log('YouTube embed URL:', embedUrl, 'videoId:', videoId);

    return (
      <div ref={containerRef} className="relative w-full rounded-xl overflow-hidden aspect-video bg-black">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0"
          style={{
            pointerEvents: 'none'
          }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={video.caption || 'Aerial video'}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-xl overflow-hidden border border-brand-gold/10 shadow-lg bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 ${
        VIS_POLISH_V1 
          ? 'min-h-[420px] md:min-h-[560px] lg:min-h-[720px]'
          : 'min-h-[520px] md:min-h-[580px] lg:min-h-[640px]'
      } aspect-video`}
    >
      {!shouldLoad && video.poster && (
        <img
          src={video.poster}
          alt={video.caption || 'Video preview'}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {!shouldLoad && !video.poster && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
        </div>
      )}
      {shouldLoad && (
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={video.caption || 'Aerial drone video'}
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedData={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}

function TextBlock({ section }: { section: VideoSection }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: section.layout === 'video-left' ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      className="flex flex-col justify-center space-y-6 max-w-xl"
    >
      <h3 className={`text-2xl md:text-3xl font-semibold tracking-tight relative z-10 isolate ${
        VIS_POLISH_V1 ? 'text-white' : 'text-white'
      }`}>
        {section.title}
      </h3>
      <p className={`text-base md:text-lg leading-relaxed tracking-wide relative z-10 ${
        VIS_POLISH_V1 ? 'text-white/90' : 'text-white/85'
      }`}>
        {section.body}
      </p>
      {section.usps.length > 0 && (
        <div className="space-y-3 relative z-10">
          {section.usps.map((usp, uspIndex) => (
            <motion.div
              key={uspIndex}
              initial={{ opacity: 0, x: section.layout === 'video-left' ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + uspIndex * 0.1, ease: 'easeOut' }}
              className="flex items-start gap-3"
            >
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0" />
              <p className={`text-sm md:text-base leading-relaxed tracking-wide ${
                VIS_POLISH_V1 ? 'text-white/90' : 'text-white/85'
              }`}>
                {usp}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function AlternatingVideoText({ sections, videos }: AlternatingVideoTextProps) {
  return (
    <div className="w-full space-y-0">
      {sections.map((section, index) => {
        const video = videos[section.videoRef];
        if (!video) return null;

        const isVideoLeft = section.layout === 'video-left';

        return (
          <div key={index}>
            {index > 0 && <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-[#c9a24b]/40 to-transparent mx-auto my-24" />}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`grid grid-cols-1 gap-12 md:gap-20 items-center ${
                isVideoLeft 
                  ? 'lg:grid-cols-[1.6fr_1fr]' 
                  : 'lg:grid-cols-[1fr_1.6fr] lg:grid-flow-dense'
              }`}
            >
              <div className={`${isVideoLeft ? '' : 'lg:col-start-2'} order-1 lg:order-none transform scale-105`}>
                <VideoBlock video={video} />
              </div>
              <div className={`${isVideoLeft ? '' : 'lg:col-start-1 lg:row-start-1'} order-2 lg:order-none`}>
                <TextBlock section={section} />
              </div>
            </motion.div>

            {index === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.05, ease: 'easeOut' }}
                className="text-xs text-white/70 italic mt-3 max-w-3xl ml-auto text-center md:text-right"
              >
                Note: On-site previews are compressed for faster loading. Delivered footage and 3D models are provided in full 4K quality with higher texture fidelity.
              </motion.p>
            )}
          </div>
        );
      })}
    </div>
  );
}
