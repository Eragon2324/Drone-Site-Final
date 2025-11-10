import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { VIS_POLISH_V1 } from '../config/flags';
import content from '../data/content.json';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function FeaturedShotsCarousel() {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const aerial = (content as any).services?.find((s: any) => s.id === 'aerial');
  const photos: Array<{ src: string; caption?: string }> = aerial?.media?.photos ?? [];

  const handlePrev = () => {
    if (VIS_POLISH_V1) {
      swiperRef.current?.slidePrev();
    } else {
      if (index > 0) {
        const newIndex = index - 1;
        setIndex(newIndex);
        scrollToCard(newIndex);
      }
    }
  };

  const handleNext = () => {
    if (VIS_POLISH_V1) {
      swiperRef.current?.slideNext();
    } else {
      if (index < 4) {
        const newIndex = index + 1;
        setIndex(newIndex);
        scrollToCard(newIndex);
      }
    }
  };

  const scrollToCard = (cardIndex: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / 5;
      scrollRef.current.scrollTo({
        left: cardIndex * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  if (VIS_POLISH_V1) {
    return (
      <section className="relative w-full mt-8 mb-32 py-14 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative max-w-[1800px] mx-auto px-8"
        >
          <div className="relative overflow-hidden">
            <style>{`
              .aerial-carousel {
                overflow: hidden !important;
              }
              .aerial-carousel .swiper-wrapper {
                align-items: center;
              }
              .aerial-carousel .swiper-slide {
                /* Cinematic: large frames with fixed widths per breakpoint */
                width: 640px !important;
                height: auto;
                opacity: 0.7;
                transform: scale(0.94);
                transition: opacity 0.45s ease, transform 0.45s ease;
              }
              .aerial-carousel .swiper-slide-active {
                opacity: 1;
                transform: scale(1.12);
                z-index: 10;
              }
              @media (min-width: 768px) {
                .aerial-carousel .swiper-slide {
                  width: 820px !important;
                }
              }
              @media (min-width: 1024px) {
                .aerial-carousel .swiper-slide {
                  width: 1000px !important;
                }
              }
            `}</style>
            
            <Swiper
              modules={[Navigation, Pagination, Keyboard, Autoplay]}
              slidesPerView="auto"
              centeredSlides={true}
              loop={true}
              spaceBetween={28}
              speed={700}
              grabCursor={true}
              roundLengths={true}
              watchSlidesProgress={false}
              initialSlide={0}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              keyboard={{
                enabled: true,
                onlyInViewport: true,
              }}
              pagination={{
                clickable: true,
                el: '.swiper-pagination-custom',
                bulletClass: 'inline-block w-2 h-2 rounded-full bg-brand-gold/40 mx-1 cursor-pointer transition-all duration-300',
                bulletActiveClass: '!bg-brand-gold !w-8',
              }}
              breakpoints={{
                768: {
                  slidesPerView: 'auto',
                  spaceBetween: 32,
                },
                1024: {
                  slidesPerView: 'auto',
                  spaceBetween: 36,
                },
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => {
                setActiveSlideIndex(swiper.realIndex);
              }}
              className="aerial-carousel"
            >
              {(photos.length ? photos : [...Array(5)]).map((p: any, i: number) => (
                <SwiperSlide key={i}>
                  <div
                    className="w-full aspect-[16/9] bg-white/[0.06] rounded-2xl border border-white/[0.08]
                             hover:bg-white/[0.08] hover:border-white/[0.12]
                             transition-all duration-300 cursor-pointer overflow-hidden group relative"
                  >
                    {photos.length ? (
                      <img
                        src={(p as any).src}
                        alt={(p as any).caption || `Aerial photo ${i + 1}`}
                        className="w-full h-full object-cover"
                        width={1600}
                        height={900}
                        decoding="async"
                        loading={i === 0 ? 'eager' : 'lazy'}
                        fetchpriority={i === 0 ? ('high' as any) : undefined}
                        onLoad={() => swiperRef.current?.update()}
                      />
                    ) : (
                      <div className="w-full h-full relative flex items-center justify-center text-white/50 text-sm font-medium">
                        Featured Shot {i + 1}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full 
                       border border-brand-gold/40 bg-black/80 backdrop-blur-sm 
                       text-brand-gold/70 hover:text-brand-gold hover:border-brand-gold 
                       hover:bg-black hover:scale-110
                       transition-all duration-300 flex items-center justify-center
                       shadow-lg hover:shadow-brand-gold/20"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full 
                       border border-brand-gold/40 bg-black/80 backdrop-blur-sm 
                       text-brand-gold/70 hover:text-brand-gold hover:border-brand-gold 
                       hover:bg-black hover:scale-110
                       transition-all duration-300 flex items-center justify-center
                       shadow-lg hover:shadow-brand-gold/20"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Custom Pagination Dots */}
          <div className="swiper-pagination-custom flex justify-center items-center mt-8 gap-2"></div>
        </motion.div>
      </section>
    );
  }

  // Original implementation (fallback when VIS_POLISH_V1 = false)
  return (
    <section className="relative w-full mt-16 mb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative max-w-6xl mx-auto px-6 md:px-8"
      >
        <div className="relative">
          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory scrollbar-hide relative"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="flex gap-6">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                  whileHover={{ scale: 1.02, brightness: 1.1 }}
                  className="flex-none snap-start w-[85vw] sm:w-[75vw] md:w-[calc(100%-4rem)] lg:w-[calc(100%-8rem)] aspect-[16/9] bg-white/[0.06] rounded-2xl border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300 cursor-pointer overflow-hidden group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 pointer-events-none" />
                  <div className="w-full h-full relative z-10">
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div
            className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0b0b0b] to-transparent pointer-events-none -z-10"
            style={{ opacity: index > 0 ? 1 : 0, transition: 'opacity 0.3s' }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0b0b0b] to-transparent pointer-events-none -z-10"
            style={{ opacity: index < 4 ? 1 : 0, transition: 'opacity 0.3s' }}
          />

          <button
            onClick={handlePrev}
            disabled={index === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-brand-gold/40 bg-black/60 backdrop-blur-sm text-brand-gold/70 hover:text-brand-gold hover:border-brand-gold hover:bg-black/80 transition-all disabled:opacity-0 disabled:pointer-events-none flex items-center justify-center"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            disabled={index === 4}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-brand-gold/40 bg-black/60 backdrop-blur-sm text-brand-gold/70 hover:text-brand-gold hover:border-brand-gold hover:bg-black/80 transition-all disabled:opacity-0 disabled:pointer-events-none flex items-center justify-center"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
