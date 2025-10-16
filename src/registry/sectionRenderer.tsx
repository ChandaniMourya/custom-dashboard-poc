// src/components/sectionRenderer.tsx
import React from 'react';
import { ISection } from '../types/ISection';
import { sectionRegistry } from '../registry/sectionRegistry';

interface SectionRendererProps {
  section: ISection;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  const Component = sectionRegistry[section.definition.typeId];

  if (!Component) return null;

  return <Component section={section} />;
};

export default SectionRenderer;
