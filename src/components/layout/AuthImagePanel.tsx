'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/providers/I18nProvider';

const SLIDE_COUNT = 3;

export default function AuthImagePanel() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDE_COUNT);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative hidden lg:flex flex-col justify-end p-8 overflow-hidden bg-[#061a10]">
      {/* Background layers */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0a3320] via-[#061a10] to-[#030d08]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,rgba(255,255,255,0.05) 0px,rgba(255,255,255,0.05) 1px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,rgba(255,255,255,0.05) 0px,rgba(255,255,255,0.05) 1px,transparent 1px,transparent 60px)',
        }}
      />
      <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-[radial-gradient(circle,oklch(69.6%_0.17_162.48_/_0.35)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-20 -left-10 w-48 h-48 rounded-full bg-[radial-gradient(circle,oklch(69.6%_0.17_162.48_/_0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Logo */}
      <div className="absolute top-6 left-7 z-10 text-white/90 text-lg font-semibold tracking-widest">
        SimuTrade
      </div>

      {/* Slide text */}
      <div className="relative z-10">
        <p className="text-white/95 text-2xl font-light italic leading-snug mb-5">
          {t(`auth.slides.${current}.heading`)}
          <br />
          {t(`auth.slides.${current}.subheading`)}
        </p>

        {/* Carousel dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 bg-white/90'
                  : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
