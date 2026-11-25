'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp, Phone } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  const phoneNumber = '919876543210';
  const defaultMessage = encodeURIComponent(
    "Hello PropNest, I'm interested in exploring verified properties."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 360);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Quick contact and navigation actions"
      className="fixed bottom-6 right-5 sm:right-6 z-50 flex flex-col items-center gap-3"
    >
      {/* Scroll to top */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        title="Back to Top"
        className={`w-11 h-11 rounded-full bg-[#142C4C] hover:bg-[#FF7A1A] text-white shadow-lg border border-white/15 flex items-center justify-center transition-all duration-300 ${
          showScrollTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* Direct Call Button */}
      <a
        href={`tel:+${phoneNumber}`}
        aria-label="Call PropNest Advisors"
        title="Call +91 98765 43210"
        className="w-12 h-12 rounded-full bg-[#0B1F38] hover:bg-[#142C4C] text-white shadow-xl border border-white/15 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <Phone className="w-5 h-5" />
      </a>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 animate-whatsapp-pulse focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        aria-label="Chat with PropNest on WhatsApp"
        title="Chat on WhatsApp"
      >
        <svg
          className="w-7 h-7 fill-current transition-transform duration-300 group-hover:rotate-12"
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>

        <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-[#0B1F38] text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl border border-white/10">
          Chat with us on WhatsApp
        </span>
      </a>
    </aside>
  );
};
