'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalPropertyCarouselProps {
  children: React.ReactNode;
  itemCount: number;
}

export const HorizontalPropertyCarousel: React.FC<HorizontalPropertyCarouselProps> = ({
  children,
  itemCount,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragState = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    hasMoved: false,
  });

  const updateScrollButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(maxScroll - el.scrollLeft > 4);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons, { passive: true });
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, [updateScrollButtons, itemCount]);

  const scrollByCard = (direction: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.max(320, Math.round(el.clientWidth * 0.75));
    el.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  // Mouse drag-to-scroll support
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    dragState.current = {
      isDown: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
      hasMoved: false,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragState.current.isDown || !trackRef.current) return;
    const x = e.pageX - trackRef.current.offsetLeft;
    const delta = x - dragState.current.startX;
    if (Math.abs(delta) > 6) {
      dragState.current.hasMoved = true;
    }
    if (dragState.current.hasMoved) {
      e.preventDefault();
      trackRef.current.scrollLeft = dragState.current.scrollLeft - delta * 1.2;
    }
  };

  const stopDragging = () => {
    dragState.current.isDown = false;
    setIsDragging(false);
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragState.current.hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      dragState.current.hasMoved = false;
    }
  };

  return (
    <div className="relative group/carousel pt-8">
      {/* Left Navigation Arrow */}
      <button
        type="button"
        onClick={() => scrollByCard('left')}
        disabled={!canScrollLeft}
        aria-label="Scroll properties left"
        className={`hidden sm:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center border shadow-lg transition-all duration-200 ${
          canScrollLeft
            ? 'bg-white text-[#142C4C] border-slate-200 hover:bg-[#142C4C] hover:text-white hover:scale-105 cursor-pointer opacity-100'
            : 'bg-white/60 text-slate-300 border-slate-200/50 cursor-not-allowed opacity-0 pointer-events-none'
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        type="button"
        onClick={() => scrollByCard('right')}
        disabled={!canScrollRight}
        aria-label="Scroll properties right"
        className={`hidden sm:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center border shadow-lg transition-all duration-200 ${
          canScrollRight
            ? 'bg-white text-[#142C4C] border-slate-200 hover:bg-[#142C4C] hover:text-white hover:scale-105 cursor-pointer opacity-100'
            : 'bg-white/60 text-slate-300 border-slate-200/50 cursor-not-allowed opacity-0 pointer-events-none'
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Horizontal Scroll Track */}
      <div
        ref={trackRef}
        onScroll={updateScrollButtons}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onClickCapture={handleClickCapture}
        className={`flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-4 select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {children}
      </div>

      {/* Mobile / Bottom Arrow Controls when scrollable */}
      {(canScrollLeft || canScrollRight) && (
        <div className="flex sm:hidden items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => scrollByCard('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll properties left"
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${
              canScrollLeft
                ? 'bg-white text-[#142C4C] border-slate-200 shadow-xs'
                : 'bg-slate-100 text-slate-300 border-slate-200/50 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard('right')}
            disabled={!canScrollRight}
            aria-label="Scroll properties right"
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${
              canScrollRight
                ? 'bg-white text-[#142C4C] border-slate-200 shadow-xs'
                : 'bg-slate-100 text-slate-300 border-slate-200/50 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

