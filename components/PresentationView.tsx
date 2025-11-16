
import React, { useState, useEffect, useCallback } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

export interface Slide {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface PresentationViewProps {
  title: string;
  slides: Slide[];
  onClose: () => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ title, slides, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const changeSlide = useCallback((direction: 'next' | 'prev') => {
      setIsFading(true);
      setTimeout(() => {
          if (direction === 'next') {
              setCurrentIndex(prevIndex => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
          } else {
              setCurrentIndex(prevIndex => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
          }
          setIsFading(false);
      }, 150);
  }, [slides.length]);


  const goToPrevious = useCallback(() => changeSlide('prev'), [changeSlide]);
  const goToNext = useCallback(() => changeSlide('next'), [changeSlide]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToPrevious, goToNext, onClose]);

  const currentSlide = slides[currentIndex];

  return (
    <div className="fixed inset-0 bg-brand-bg/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 transition-opacity duration-300" role="dialog" aria-modal="true" onClick={onClose}>
      
      <div className="w-full max-w-3xl" onClick={e => e.stopPropagation()}>
        <header className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-xl font-bold text-brand-text-primary">{title}</h2>
            <button
              onClick={onClose}
              className="h-9 w-9 flex items-center justify-center bg-brand-surface rounded-full border border-brand-border text-brand-text-secondary hover:text-brand-text-primary transition-colors"
              aria-label="Cerrar presentación"
            >
              <XMarkIcon />
            </button>
        </header>

        <div className={`relative w-full bg-brand-surface border border-brand-border rounded-xl shadow-2xl overflow-hidden p-6 sm:p-8 transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex items-start space-x-4">
                <span className="text-brand-accent flex-shrink-0 mt-1">{currentSlide.icon}</span>
                <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-semibold text-brand-text-primary">{currentSlide.title}</h3>
                    <div className="mt-4 text-brand-text-secondary space-y-4">
                        {currentSlide.content}
                    </div>
                </div>
            </div>
        </div>

        <footer className="mt-6 flex justify-between items-center px-2">
          <button
            onClick={goToPrevious}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-brand-surface border border-brand-border hover:bg-brand-border/50 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5"/>
            <span className="hidden sm:inline">Anterior</span>
          </button>
          <span className="text-sm font-medium text-brand-text-secondary">
            {currentIndex + 1} / {slides.length}
          </span>
          <button
            onClick={goToNext}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-brand-surface border border-brand-border hover:bg-brand-border/50 transition-colors"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PresentationView;