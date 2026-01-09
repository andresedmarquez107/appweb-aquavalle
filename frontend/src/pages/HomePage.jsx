import React from 'react';
import { Hero } from '../components/Hero';
import { ImageCarousel } from '../components/ImageCarousel';
import { QuickServices } from '../components/QuickServices';
import { LocationSection } from '../components/LocationSection';
import { CTASection } from '../components/CTASection';

export const HomePage = () => {
  return (
    <div>
      <Hero />
      <QuickServices />
      <ImageCarousel />
      <LocationSection />
      <CTASection />
    </div>
  );
};