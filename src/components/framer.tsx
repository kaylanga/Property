'use client';

import { motion } from 'framer-motion';

// Framer Motion components
export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export const MotionButton = motion.button;

// Optional: Example usage component (for demo/testing only)
export function MotionExample() {
  return (
    <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1>Framer Motion Example Component</h1>
    </MotionDiv>
  );
}
