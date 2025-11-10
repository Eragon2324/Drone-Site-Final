import { AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import ServiceCard from './ServiceCard';
import ServiceDetail from './ServiceDetail';
import { useCardExpansion } from '../hooks/useCardExpansion';
import content from '../data/content.json';
import { HOMEPAGE_CARD_CAROUSEL_V1 } from '../config/flags';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function ServiceSlider() {
  const { expandedId, open, close } = useCardExpansion();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <section className={`w-full relative z-10 ${expandedId ? 'h-screen' : 'h-[88vh] sm:h-[92vh]'}`}>
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent" />

      {!expandedId && (
        <div className="w-full h-full flex items-center justify-center py-10 md:py-12">
          <div className="relative w-full max-w-[2400px] mx-auto px-6">
            {HOMEPAGE_CARD_CAROUSEL_V1 ? (
              <div className="relative">
                <style>{`
                  .services-home-carousel{ overflow: visible !important; }
                  .services-home-carousel .swiper-wrapper { align-items: center; }
                  /* Keep equal widths to avoid loop jitter; scale only */
                  .services-home-carousel .swiper-slide { width: 560px !important; opacity: 0.7; transform: scale(0.92); transition: transform .45s ease, opacity .45s ease; }
                  .services-home-carousel .swiper-slide-active { opacity: 1; transform: scale(1.18); z-index: 10; }
                  @media (min-width: 1024px){
                    .services-home-carousel .swiper-slide { width: 700px !important; }
                    .services-home-carousel .swiper-slide-active { transform: scale(1.22); }
                  }
                `}</style>
                <Swiper
                  modules={[Pagination, Keyboard]}
                  slidesPerView="auto"
                  centeredSlides={true}
                  loop={true}
                  loopedSlides={content.services.length}
                  loopAdditionalSlides={2}
                  spaceBetween={28}
                  speed={700}
                  grabCursor={true}
                  roundLengths={true}
                  initialSlide={0}
                  keyboard={{ enabled: true, onlyInViewport: true }}
                  pagination={{ clickable: true }}
                  onSwiper={(s) => (swiperRef.current = s)}
                  onSlideChange={(s) => setActiveIndex(s.realIndex)}
                  className="services-home-carousel"
                >
                  {content.services.map((service) => (
                    <SwiperSlide key={service.id}>
                      <div className="w-full h-full flex items-center justify-center py-4">
                        <ServiceCard
                          id={service.id as 'aerial' | 'orthos' | 'models'}
                          title={service.title}
                          subtitle={service.subtitle}
                          onExpand={() => open(service.id as 'aerial' | 'orthos' | 'models')}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                {/* Custom Navigation Buttons */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full 
                           border border-brand-gold/40 bg-black/80 backdrop-blur-sm 
                           text-brand-gold/70 hover:text-brand-gold hover:border-brand-gold 
                           hover:bg-black hover:scale-110
                           transition-all duration-300 flex items-center justify-center"
                  aria-label="Previous slide"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full 
                           border border-brand-gold/40 bg-black/80 backdrop-blur-sm 
                           text-brand-gold/70 hover:text-brand-gold hover:border-brand-gold 
                           hover:bg-black hover:scale-110
                           transition-all duration-300 flex items-center justify-center"
                  aria-label="Next slide"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-stretch justify-items-center">
                {content.services.map((service) => (
                  <div key={service.id} className="w-full max-w-[620px]">
                    <ServiceCard
                      id={service.id as 'aerial' | 'orthos' | 'models'}
                      title={service.title}
                      subtitle={service.subtitle}
                      onExpand={() => open(service.id as 'aerial' | 'orthos' | 'models')}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {expandedId && (
        <div className="h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {content.services.map((service) =>
              expandedId === service.id ? (
                <ServiceDetail
                  key={service.id}
                  id={service.id as 'aerial' | 'orthos' | 'models'}
                  title={service.title}
                  description={service.description}
                  onClose={close}
                />
              ) : null
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
