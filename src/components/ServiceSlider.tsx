import { AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import ServiceCard from './ServiceCard';
import ServiceDetail from './ServiceDetail';
import { useCardExpansion } from '../hooks/useCardExpansion';
import content from '../data/content.json';
import { HOMEPAGE_CARD_CAROUSEL_V1 } from '../config/flags';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ServiceSlider() {
  const { expandedId, open, close } = useCardExpansion();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);

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
                  /* Brand navigation arrows - increased z-index to ensure clickability */
                  .services-home-carousel .swiper-button-next,
                  .services-home-carousel .swiper-button-prev { 
                    width: 48px; height: 48px; border-radius: 9999px; 
                    border: 1px solid rgba(201,162,75,0.5); 
                    background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); 
                    color: #c9a24b;
                    z-index: 50 !important;
                    pointer-events: auto !important;
                  }
                  .services-home-carousel .swiper-button-next:hover,
                  .services-home-carousel .swiper-button-prev:hover { 
                    border-color: #c9a24b; color: #fff; 
                  }
                  .services-home-carousel .swiper-button-next:after,
                  .services-home-carousel .swiper-button-prev:after { font-size: 18px; }
                  .services-home-carousel .swiper-button-prev { left: 8px; }
                  .services-home-carousel .swiper-button-next { right: 8px; }
                  .services-home-carousel .swiper-button-disabled { opacity: 0.3; cursor: not-allowed; }
                `}</style>
                <Swiper
                  modules={[Navigation, Pagination, Keyboard]}
                  slidesPerView={'auto'}
                  centeredSlides
                  loop
                  loopAdditionalSlides={2}
                  loopedSlides={content.services.length}
                  centeredSlidesBounds
                  spaceBetween={28}
                  speed={700}
                  resistanceRatio={0.85}
                  keyboard={{ enabled: true, onlyInViewport: true }}
                  navigation
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
