import React from 'react';
import { Hero } from '../components/Hero';
import { ImageCarousel } from '../components/ImageCarousel';
import { QuickServices } from '../components/QuickServices';
import { CTASection } from '../components/CTASection';

export const HomePage = () => {
  return (
    <div>
      <Hero />
      <QuickServices />
      <ImageCarousel />
      <CTASection />
    </div>
  );
};