import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';

interface Photo {
  src: string;
  caption?: string;
}

interface PhotoCarouselProps {
  photos: Photo[];
}

export default function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [activeIndex, setActiveIndex] = useState(0);

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative px-4">
      <button
        className="photo-carousel-prev absolute left-2 sm:left-8 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full
                   bg-brand-gold/10 hover:bg-brand-gold/20 backdrop-blur-sm
                   border border-brand-gold/30 flex items-center justify-center transition-all duration-300
                   hover:scale-110 cursor-pointer"
        aria-label="Previous photo"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-brand-gold" />
      </button>

      <button
        className="photo-carousel-next absolute right-2 sm:right-8 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full
                   bg-brand-gold/10 hover:bg-brand-gold/20 backdrop-blur-sm
                   border border-brand-gold/30 flex items-center justify-center transition-all duration-300
                   hover:scale-110 cursor-pointer"
        aria-label="Next photo"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-brand-gold" />
      </button>

      <div className="w-full max-w-7xl mx-auto">
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1.2}
          centeredSlides={true}
          loop={true}
          speed={600}
          grabCursor={true}
          navigation={{
            prevEl: '.photo-carousel-prev',
            nextEl: '.photo-carousel-next',
          }}
          breakpoints={{
            640: {
              slidesPerView: 1.5,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 2.2,
              spaceBetween: 32,
            },
            1280: {
              slidesPerView: 2.5,
              spaceBetween: 40,
            },
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full !py-8"
        >
          {photos.map((photo, index) => (
            <SwiperSlide key={index}>
              {({ isActive }) => (
                <motion.div
                  animate={{
                    scale: 1,
                    opacity: isActive ? 1 : 0.85,
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="relative w-full"
                  style={{
                    aspectRatio: '3/4',
                  }}
                >
                  <div
                    className="relative h-full rounded-2xl overflow-hidden border transition-all duration-300"
                    style={{
                      borderColor: isActive ? 'rgba(215,183,100,0.3)' : 'rgba(215,183,100,0.15)',
                      boxShadow: '0 16px 50px rgba(0,0,0,0.45)',
                    }}
                  >
                    {!loadedImages.has(index) && (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 animate-pulse" />
                    )}

                    <img
                      src={photo.src}
                      alt={photo.caption || `Aerial photo ${index + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onLoad={() => handleImageLoad(index)}
                    />

                    {/* Keep size stable: remove heavy inactive overlay */}
                    {!isActive && <div className="absolute inset-0 bg-black/20 pointer-events-none transition-opacity duration-300" />}

                    {photo.caption && isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="absolute bottom-0 left-0 right-0 p-5 text-white/90 text-sm
                                  tracking-wide font-light pointer-events-none
                                  bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                      >
                        {photo.caption}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
