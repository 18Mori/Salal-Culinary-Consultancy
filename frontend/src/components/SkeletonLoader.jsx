import React from 'react';

const SkeletonLoader = {
  // Skeleton Card - used for stats cards, user avatars
  Card: ({ className, width }) => {
    const baseClass = `bg-charcoal/10 rounded-lg animate-skeleton-shimmer ${className || ''}`;
    const innerWidth = width ? `w-${width}` : '';
    
    return (
      <div className={baseClass} style={{ height: '12px' }} />
    );
  },

  // Skeleton Avatar - circular skeleton for user images
  Avatar: ({ className, size }) => {
    const sz = size || 'md';
    const sizes = {
      sm: 'w-6 h-6 rounded-full',
      md: 'w-8 h-8 rounded-full',
      lg: 'w-10 h-10 rounded-full',
    };
    
    return (
      <div className={`bg-charcoal/10 ${sizes[sz]} animate-skeleton-shimmer ${className || ''}`} />
    );
  },

  // Skeleton Paragraph - for text lines
  Paragraph: ({ className, lines = 2 }) => {
    return (
      <div className={`bg-charcoal/10 rounded animate-skeleton-shimmer ${className || ''} h-4`} />
    );
  },

  // Skeleton Text - single line text skeleton
  Text: ({ className }) => {
    return (
      <div className={`bg-charcoal/10 rounded h-4 w-3/4 animate-skeleton-shimmer ${className || ''}`} />
    );
  },

  // Skeleton Table Row - for dashboard tables
  TableRow: ({ className, cells = 3 }) => {
    return (
      <div className={`bg-charcoal/10 rounded-lg p-3 animate-skeleton-shimmer ${className || ''}`} />
    );
  },

  // Skeleton Image - for product/feature images
  Image: ({ className, aspectRatio = '16/9' }) => {
    return (
      <div className={`bg-charcoal/10 rounded-lg animate-skeleton-shimmer ${className || ''} aspect-[${aspectRatio}]`} />
    );
  },

  // Skeleton Section - full width section loader
  Section: ({ className }) => {
    return (
      <div className={`bg-charcoal/10 h-96 rounded-lg animate-skeleton-shimmer ${className || ''}`} />
    );
  },

  // Skeleton Heading - for section headings
  Heading: ({ className }) => {
    return (
      <div className={`bg-charcoal/10 rounded-blg h-6 w-2/3 animate-skeleton-shimmer ${className || ''}`} />
    );
  },
};

export default SkeletonLoader;