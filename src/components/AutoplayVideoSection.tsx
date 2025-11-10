import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface VideoItem {
  type: 'mp4' | 'youtube';
  src: string;
  poster?: string;
  caption?: string;
}

interface AutoplayVideoSectionProps {
  videos: VideoItem[];
  valueProps: string[];
}

function VideoBlock({ video, index }: { video: VideoItem; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isInView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  if (video.type === 'youtube') {
    return (
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
        className="w-full"
      >
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-brand-gold/10
                      shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
          <iframe
            src={`${video.src}?autoplay=0&mute=1&controls=1&modestbranding=1&rel=0`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
        {video.caption && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-sm text-brand-text/60 tracking-wide text-center"
          >
            {video.caption}
          </motion.p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="w-full"
    >
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-brand-gold/10
                    shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 animate-pulse" />
        )}
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedData={() => setIsLoaded(true)}
        />
      </div>
      {video.caption && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-sm text-brand-text/60 tracking-wide text-center"
        >
          {video.caption}
        </motion.p>
      )}
    </motion.div>
  );
}

function ValueProp({ text, index }: { text: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex items-start gap-3"
    >
      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold/80 flex-shrink-0" />
      <p className="text-base text-brand-text/80 leading-relaxed tracking-wide">
        {text}
      </p>
    </motion.div>
  );
}

export default function AutoplayVideoSection({ videos, valueProps }: AutoplayVideoSectionProps) {
  return (
    <div className="w-full space-y-12">
      {videos.map((video, videoIndex) => (
        <div key={videoIndex} className="space-y-8">
          <VideoBlock video={video} index={videoIndex} />

          {videoIndex < valueProps.length && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto space-y-4"
            >
              <ValueProp text={valueProps[videoIndex]} index={videoIndex} />
            </motion.div>
          )}
        </div>
      ))}

      {valueProps.slice(videos.length).map((prop, index) => (
        <motion.div
          key={`extra-${index}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <ValueProp text={prop} index={videos.length + index} />
        </motion.div>
      ))}
    </div>
  );
}
